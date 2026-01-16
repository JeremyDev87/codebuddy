# Rollback Strategies

Comprehensive rollback procedures by migration type.

## The Golden Rule

```
EVERY MIGRATION MUST HAVE A TESTED ROLLBACK BEFORE EXECUTION
```

- Test rollback in staging with production-like data
- Measure rollback duration
- Verify data integrity after rollback
- Document the exact rollback commands

## Rollback Decision Matrix

| Migration Type | Rollback Complexity | Data Loss Risk | Recommended Strategy |
|----------------|--------------------|-----------------|--------------------|
| ADD COLUMN (nullable) | Simple | None | DROP COLUMN |
| ADD COLUMN (NOT NULL) | Medium | Possible | Dual-write + restore |
| DROP COLUMN | Complex | **Certain** | Restore from backup |
| RENAME COLUMN | Medium | None | Reverse rename |
| CHANGE TYPE (widen) | Simple | None | No action needed |
| CHANGE TYPE (narrow) | Complex | **Possible** | Restore from backup |
| ADD INDEX | Simple | None | DROP INDEX |
| ADD FK | Simple | None | DROP FK |
| DROP FK | Medium | None | Re-add FK |
| SPLIT TABLE | Complex | None | Reverse merge |
| MERGE TABLES | Complex | None | Reverse split |

## Strategy 1: Instant Rollback (DDL-Only)

**Use for:** Schema changes that can be reversed with DDL

### ADD COLUMN Rollback
```sql
-- Forward
ALTER TABLE users ADD COLUMN status VARCHAR(20);

-- Rollback (instant)
ALTER TABLE users DROP COLUMN status;
```

### ADD INDEX Rollback
```sql
-- Forward
CREATE INDEX idx_users_email ON users(email);

-- Rollback (instant)
DROP INDEX idx_users_email;
```

### ADD CONSTRAINT Rollback
```sql
-- Forward
ALTER TABLE orders
ADD CONSTRAINT chk_positive_amount CHECK (amount > 0);

-- Rollback (instant)
ALTER TABLE orders DROP CONSTRAINT chk_positive_amount;
```

## Strategy 2: Data Preservation Rollback

**Use for:** Changes that modify data but preserve original

### NOT NULL with Default

```sql
-- Forward
ALTER TABLE users
ALTER COLUMN status SET DEFAULT 'active',
ALTER COLUMN status SET NOT NULL;

-- Rollback
ALTER TABLE users
ALTER COLUMN status DROP NOT NULL,
ALTER COLUMN status DROP DEFAULT;

-- Note: Data modified (NULLs became 'active')
-- May need: UPDATE users SET status = NULL WHERE status = 'active' AND original_was_null;
```

### Best Practice: Dual-Write Pattern

```sql
-- Before migration: add tracking column
ALTER TABLE users ADD COLUMN status_was_null BOOLEAN;

-- Forward migration
UPDATE users SET status_was_null = (status IS NULL) WHERE status_was_null IS NULL;
UPDATE users SET status = 'active' WHERE status IS NULL;
ALTER TABLE users ALTER COLUMN status SET NOT NULL;

-- Rollback with data preservation
ALTER TABLE users ALTER COLUMN status DROP NOT NULL;
UPDATE users SET status = NULL WHERE status_was_null = true;
ALTER TABLE users DROP COLUMN status_was_null;
```

## Strategy 3: Backup-Based Rollback

**Use for:** Destructive changes (DROP, TYPE narrowing)

### Pre-Migration Backup

```sql
-- Create backup before destructive change
CREATE TABLE users_backup_20240115 AS SELECT * FROM users;

-- Forward (destructive)
ALTER TABLE users DROP COLUMN legacy_data;

-- Rollback from backup
ALTER TABLE users ADD COLUMN legacy_data TEXT;

UPDATE users u
SET legacy_data = b.legacy_data
FROM users_backup_20240115 b
WHERE u.id = b.id;

-- Cleanup after confirmed rollback
DROP TABLE users_backup_20240115;
```

### Point-in-Time Recovery (PITR)

```sql
-- PostgreSQL: Recover to specific time
-- (Requires proper WAL archiving configuration)
SELECT pg_create_restore_point('before_migration_xyz');

-- After migration failure, restore to this point
-- This is a DBA operation, not a SQL command
```

## Strategy 4: Shadow Table Rollback

**Use for:** Complex transformations, column renames

### Forward Migration

```sql
-- Create shadow
ALTER TABLE products ADD COLUMN name_v2 VARCHAR(255);

-- Sync trigger
CREATE TRIGGER sync_name
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION sync_columns('name', 'name_v2');

-- Backfill
UPDATE products SET name_v2 = name WHERE name_v2 IS NULL;

-- Application switches to name_v2
-- ... time passes, monitoring shows success ...

-- Contract (danger zone)
DROP TRIGGER sync_name ON products;
ALTER TABLE products DROP COLUMN name;
ALTER TABLE products RENAME COLUMN name_v2 TO name;
```

### Rollback at Each Phase

**Phase: Shadow exists**
```sql
-- Simple: just drop shadow
DROP TRIGGER sync_name ON products;
ALTER TABLE products DROP COLUMN name_v2;
```

**Phase: Application using shadow**
```sql
-- Revert application to old column
-- Drop shadow
DROP TRIGGER sync_name ON products;
ALTER TABLE products DROP COLUMN name_v2;
```

**Phase: After contract (original dropped)**
```sql
-- Complex: restore from backup
ALTER TABLE products ADD COLUMN name VARCHAR(255);

UPDATE products p
SET name = b.name
FROM products_backup_20240115 b
WHERE p.id = b.id;
```

## Strategy 5: Blue-Green Database Rollback

**Use for:** Major schema overhauls, critical systems

### Setup

```
DB-Blue:  Current production schema
DB-Green: New schema (clone of Blue + migrations)
```

### Rollback Process

```
1. Issue detected with Green
2. Stop writes to Green
3. Switch application back to Blue (DNS/config)
4. Resume operations on Blue
5. Debug Green offline
```

### Data Sync Consideration

```sql
-- If data written to Green needs preservation:
-- Export Green-only data
SELECT * FROM green_db.orders
WHERE created_at > :cutover_time
INTO OUTFILE '/tmp/green_orders.csv';

-- Import to Blue
LOAD DATA INFILE '/tmp/green_orders.csv'
INTO TABLE blue_db.orders;
```

## Rollback Testing Checklist

| Test | Purpose | Pass Criteria |
|------|---------|---------------|
| Execute rollback | Verify commands work | No errors |
| Data integrity | Verify no data loss | Row counts match |
| Application health | Verify app works after rollback | All smoke tests pass |
| Performance | Verify acceptable speed | Query times unchanged |
| Constraint validity | Verify FK/CHECK constraints | No violations |
| Index integrity | Verify indexes valid | EXPLAIN plans correct |

## Rollback Time Estimates

| Operation | Table Size | Estimated Time |
|-----------|------------|----------------|
| DROP COLUMN | Any | Instant |
| DROP INDEX | Any | Instant |
| DROP CONSTRAINT | Any | Instant |
| ADD COLUMN | Any | Instant |
| Restore from backup | 1M rows | 5-15 min |
| Restore from backup | 10M rows | 30-60 min |
| Restore from backup | 100M rows | 4-8 hours |
| PITR | Depends on WAL | 15-60 min |

## Automated Rollback Script Template

```bash
#!/bin/bash
# rollback-migration-xyz.sh

set -e  # Exit on error

MIGRATION_NAME="xyz"
BACKUP_TABLE="users_backup_${MIGRATION_NAME}"
ROLLBACK_LOG="/var/log/migrations/rollback_${MIGRATION_NAME}.log"

echo "Starting rollback for migration: ${MIGRATION_NAME}" | tee -a $ROLLBACK_LOG
echo "Timestamp: $(date -Iseconds)" | tee -a $ROLLBACK_LOG

# Step 1: Verify backup exists
echo "Checking backup table..." | tee -a $ROLLBACK_LOG
psql -c "SELECT COUNT(*) FROM ${BACKUP_TABLE}" || {
    echo "ERROR: Backup table not found!" | tee -a $ROLLBACK_LOG
    exit 1
}

# Step 2: Execute rollback
echo "Executing rollback DDL..." | tee -a $ROLLBACK_LOG
psql -f /migrations/${MIGRATION_NAME}/rollback.sql 2>&1 | tee -a $ROLLBACK_LOG

# Step 3: Restore data if needed
echo "Restoring data from backup..." | tee -a $ROLLBACK_LOG
psql -c "
    UPDATE users u
    SET dropped_column = b.dropped_column
    FROM ${BACKUP_TABLE} b
    WHERE u.id = b.id;
" 2>&1 | tee -a $ROLLBACK_LOG

# Step 4: Verify rollback
echo "Verifying rollback..." | tee -a $ROLLBACK_LOG
VERIFICATION=$(psql -t -c "
    SELECT COUNT(*) FROM users
    WHERE dropped_column IS NULL
      AND id IN (SELECT id FROM ${BACKUP_TABLE} WHERE dropped_column IS NOT NULL);
")

if [ "$VERIFICATION" != "0" ]; then
    echo "ERROR: Rollback verification failed! ${VERIFICATION} rows missing data." | tee -a $ROLLBACK_LOG
    exit 1
fi

echo "Rollback completed successfully!" | tee -a $ROLLBACK_LOG
```

## Emergency Rollback Procedure

**When things go wrong in production:**

### Step 1: STOP (30 seconds)
```
- Stop the migration if still running
- Assess the damage (what failed, what's affected)
- Do NOT attempt ad-hoc fixes
```

### Step 2: COMMUNICATE (1 minute)
```
- Post in incident channel
- Alert on-call DBA
- Update status page if user-facing
```

### Step 3: ASSESS (2-5 minutes)
```
- Check application errors
- Check replication status
- Identify rollback strategy needed
```

### Step 4: EXECUTE (varies)
```
- Use pre-tested rollback script
- Monitor progress
- Verify each step
```

### Step 5: VERIFY (5-10 minutes)
```
- Run validation queries
- Check application health
- Confirm service restored
```

### Step 6: DOCUMENT
```
- Record what happened
- Schedule postmortem
- Update rollback procedures if needed
```

## Common Rollback Mistakes

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| No backup before DROP | Permanent data loss | Always backup before destructive ops |
| Untested rollback script | Script fails in production | Test every rollback in staging |
| Forgot trigger removal | Dual-write continues | Include trigger cleanup in rollback |
| Rollback during peak | Extended impact | Schedule rollbacks for low-traffic |
| Partial rollback | Inconsistent state | Rollback fully or not at all |
| Skip verification | Silent failures | Always run post-rollback validation |
