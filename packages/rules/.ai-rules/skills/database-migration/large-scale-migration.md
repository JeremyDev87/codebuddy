# Large-Scale Migration Guide

Strategies for migrating tables with millions or billions of rows.

## Overview

Large tables require special handling to avoid:
- Lock contention causing application timeouts
- Replication lag affecting read replicas
- Memory exhaustion from large transactions
- Blocking other database operations

## Batch Size Guidelines

| Row Count | Recommended Batch | Pause Between | Est. Duration |
|-----------|-------------------|---------------|---------------|
| 1M-10M | 10,000 | 100ms | 10-60 min |
| 10M-100M | 5,000 | 200ms | 1-8 hours |
| 100M-1B | 1,000 | 500ms | 8-48 hours |
| >1B | 500 | 1s | Days |

**Factors affecting batch size:**
- Row width (bytes per row)
- Index count (more indexes = slower writes)
- Available memory
- Replication topology
- Peak vs off-peak traffic

## Lock Minimization Strategies

### Strategy 1: Primary Key Chunking

```sql
-- Find chunk boundaries
SELECT id FROM target_table
ORDER BY id
OFFSET 10000 ROWS FETCH NEXT 1 ROWS ONLY;

-- Process chunk
UPDATE target_table
SET column = transform(column)
WHERE id >= :chunk_start AND id < :chunk_end;
```

**Benefits:**
- Predictable chunk sizes
- Uses primary key index efficiently
- Easy progress tracking

### Strategy 2: Modulo Partitioning

```sql
-- Process rows where id % 100 = 0, then 1, then 2, etc.
UPDATE target_table
SET column = transform(column)
WHERE id % 100 = :partition
  AND column IS NULL;
```

**Benefits:**
- Spreads load across table
- Reduces hot spots
- Good for random access patterns

### Strategy 3: Range-Based Processing

```sql
-- For timestamp-based tables
UPDATE target_table
SET column = transform(column)
WHERE created_at >= :range_start
  AND created_at < :range_end;
```

**Benefits:**
- Aligns with data partitioning
- Good for time-series data
- Predictable lock scope

## Progress Monitoring

### Progress Table Pattern

```sql
CREATE TABLE migration_progress (
    migration_name VARCHAR(100) PRIMARY KEY,
    last_processed_id BIGINT,
    total_processed BIGINT DEFAULT 0,
    started_at TIMESTAMP DEFAULT NOW(),
    last_updated_at TIMESTAMP DEFAULT NOW(),
    estimated_total BIGINT,
    status VARCHAR(20) DEFAULT 'running'
);

-- Update progress after each batch
UPDATE migration_progress
SET last_processed_id = :current_id,
    total_processed = total_processed + :batch_count,
    last_updated_at = NOW()
WHERE migration_name = :name;
```

### ETA Calculation

```sql
SELECT
    migration_name,
    total_processed,
    estimated_total,
    ROUND(100.0 * total_processed / estimated_total, 2) as percent_complete,
    last_updated_at - started_at as elapsed,
    (last_updated_at - started_at) * (estimated_total - total_processed) / NULLIF(total_processed, 0) as eta_remaining
FROM migration_progress
WHERE migration_name = :name;
```

### Real-Time Monitoring Query

```sql
-- PostgreSQL: Monitor active migration
SELECT
    pid,
    now() - query_start as duration,
    state,
    wait_event_type,
    wait_event,
    LEFT(query, 100) as query_preview
FROM pg_stat_activity
WHERE query LIKE '%migration%'
  AND state != 'idle';
```

## Peak Traffic Avoidance

### Traffic Pattern Analysis

```sql
-- Find low-traffic windows (PostgreSQL)
SELECT
    date_trunc('hour', created_at) as hour,
    COUNT(*) as transactions
FROM audit_log
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY 1
ORDER BY 2 ASC
LIMIT 10;
```

### Adaptive Throttling

```sql
-- Pseudocode for adaptive batch processing
DO $$
DECLARE
    batch_size INT := 10000;
    min_batch INT := 1000;
    max_batch INT := 50000;
    target_lag_ms INT := 5000;
    current_lag_ms INT;
BEGIN
    LOOP
        -- Process batch
        PERFORM process_batch(batch_size);

        -- Check replication lag
        SELECT EXTRACT(MILLISECONDS FROM replay_lag) INTO current_lag_ms
        FROM pg_stat_replication;

        -- Adjust batch size based on lag
        IF current_lag_ms > target_lag_ms THEN
            batch_size := GREATEST(min_batch, batch_size * 0.8);
            PERFORM pg_sleep(1); -- Extra pause
        ELSIF current_lag_ms < target_lag_ms * 0.5 THEN
            batch_size := LEAST(max_batch, batch_size * 1.2);
        END IF;

        EXIT WHEN migration_complete();
    END LOOP;
END $$;
```

### Scheduled Execution

```yaml
# Example: Kubernetes CronJob for off-peak migration
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-migration
spec:
  schedule: "0 2 * * *"  # 2 AM daily
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: migration
            image: migration-runner
            env:
            - name: MAX_DURATION_HOURS
              value: "4"
            - name: STOP_BEFORE_PEAK
              value: "06:00"
```

## Memory Management

### Cursor-Based Processing

```sql
-- PostgreSQL: Server-side cursor
DECLARE migration_cursor CURSOR FOR
    SELECT id, column FROM target_table
    WHERE needs_migration = true
    ORDER BY id;

-- Fetch in batches
FETCH 1000 FROM migration_cursor;
```

### Streaming Updates (Application)

```typescript
// Node.js example with cursor streaming
async function* streamRows(db: Database, query: string) {
  const cursor = db.query(query).cursor();
  for await (const row of cursor) {
    yield row;
  }
}

async function migrateBatched(db: Database) {
  let batch: Row[] = [];
  const BATCH_SIZE = 1000;

  for await (const row of streamRows(db, 'SELECT * FROM table')) {
    batch.push(transformRow(row));

    if (batch.length >= BATCH_SIZE) {
      await db.batchUpdate(batch);
      batch = [];
      await sleep(100); // Pause between batches
    }
  }

  if (batch.length > 0) {
    await db.batchUpdate(batch);
  }
}
```

## Replication Lag Management

### Monitor Lag

```sql
-- PostgreSQL
SELECT client_addr, state, sent_lsn, replay_lsn,
       (sent_lsn - replay_lsn) as lag_bytes,
       replay_lag
FROM pg_stat_replication;

-- MySQL
SHOW SLAVE STATUS\G
-- Look for: Seconds_Behind_Master
```

### Lag-Aware Processing

```python
# Python example
def migrate_with_lag_check(db, max_lag_seconds=10):
    while True:
        lag = db.get_replication_lag()

        if lag > max_lag_seconds:
            print(f"Lag {lag}s > threshold, pausing...")
            time.sleep(lag)  # Wait for lag to catch up
            continue

        rows_updated = db.process_batch(1000)

        if rows_updated == 0:
            break

        time.sleep(0.1)  # Brief pause
```

## Abort and Resume

### Checkpoint Pattern

```sql
-- Create checkpoint table
CREATE TABLE migration_checkpoints (
    checkpoint_id SERIAL PRIMARY KEY,
    migration_name VARCHAR(100),
    last_id BIGINT,
    batch_count INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Save checkpoint after each batch
INSERT INTO migration_checkpoints (migration_name, last_id, batch_count)
VALUES (:name, :last_id, :count);

-- Resume from checkpoint
SELECT last_id FROM migration_checkpoints
WHERE migration_name = :name
ORDER BY checkpoint_id DESC
LIMIT 1;
```

### Abort Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Replication lag | >30s | Pause |
| Replication lag | >60s | Abort |
| Lock wait | >30s | Reduce batch |
| Lock wait | >60s | Abort |
| Error rate | >1% | Pause |
| Error rate | >5% | Abort |
| Memory usage | >80% | Reduce batch |
| Memory usage | >95% | Abort |

### Graceful Shutdown

```python
import signal
import sys

running = True

def handle_signal(signum, frame):
    global running
    print("Received shutdown signal, finishing current batch...")
    running = False

signal.signal(signal.SIGTERM, handle_signal)
signal.signal(signal.SIGINT, handle_signal)

while running:
    process_batch()
    save_checkpoint()

print("Migration paused, can resume from checkpoint")
```

## Parallel Processing

### Multi-Worker Pattern

```
Worker 1: id % 4 = 0
Worker 2: id % 4 = 1
Worker 3: id % 4 = 2
Worker 4: id % 4 = 3
```

### Coordination Table

```sql
CREATE TABLE migration_workers (
    worker_id INT PRIMARY KEY,
    range_start BIGINT,
    range_end BIGINT,
    status VARCHAR(20),
    last_processed BIGINT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Claim work range
UPDATE migration_workers
SET status = 'running', started_at = NOW()
WHERE worker_id = :id AND status = 'pending'
RETURNING range_start, range_end;
```

## Validation During Migration

### Continuous Validation

```sql
-- Run periodically during migration
SELECT
    (SELECT COUNT(*) FROM source_table) as source_count,
    (SELECT COUNT(*) FROM target_table) as target_count,
    (SELECT COUNT(*) FROM source_table WHERE migrated_at IS NOT NULL) as migrated_count;
```

### Sampling Validation

```sql
-- Verify random sample
SELECT s.id, s.value, t.transformed_value,
       expected_transform(s.value) as expected
FROM source_table s
JOIN target_table t ON s.id = t.id
WHERE random() < 0.001  -- 0.1% sample
  AND t.transformed_value != expected_transform(s.value);
```

## Common Pitfalls

| Pitfall | Impact | Prevention |
|---------|--------|------------|
| No checkpoints | Lost progress on failure | Save checkpoint every batch |
| Fixed batch size | Inefficient or overwhelming | Adaptive sizing based on lag |
| Process all rows | Memory exhaustion | Use streaming/cursors |
| Single transaction | Lock entire table | Commit per batch |
| No pause between batches | Replication lag | Add configurable sleep |
| Ignore errors | Silent data loss | Log and retry or abort |
