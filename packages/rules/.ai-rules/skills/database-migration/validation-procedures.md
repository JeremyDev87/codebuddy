# Validation Procedures

Data integrity verification before and after migrations.

## Overview

Validation is not optional. Every migration must have:
- Pre-migration validation (baseline)
- Post-migration validation (verification)
- Comparison analysis (change detection)

## Pre-Migration Validation Checklist

### 1. Row Count Baseline

```sql
-- Record baseline counts
SELECT
    'users' as table_name,
    COUNT(*) as total_rows,
    COUNT(*) FILTER (WHERE deleted_at IS NULL) as active_rows,
    NOW() as captured_at
FROM users;

-- For all affected tables
INSERT INTO migration_baselines (migration_id, table_name, metric, value)
VALUES
    (:migration_id, 'users', 'total_rows', (SELECT COUNT(*) FROM users)),
    (:migration_id, 'users', 'active_rows', (SELECT COUNT(*) FROM users WHERE deleted_at IS NULL));
```

### 2. Data Distribution

```sql
-- Capture distribution for validation
SELECT
    column_name,
    COUNT(*) as count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM (
    SELECT
        CASE
            WHEN status IS NULL THEN 'NULL'
            ELSE status
        END as column_name
    FROM users
) t
GROUP BY column_name
ORDER BY count DESC;
```

### 3. Referential Integrity

```sql
-- Check foreign key integrity BEFORE migration
SELECT 'orders.user_id -> users.id' as relationship,
       COUNT(*) as orphan_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL AND o.user_id IS NOT NULL

UNION ALL

SELECT 'order_items.order_id -> orders.id',
       COUNT(*)
FROM order_items oi
LEFT JOIN orders o ON oi.order_id = o.id
WHERE o.id IS NULL AND oi.order_id IS NOT NULL;
```

### 4. Constraint Status

```sql
-- PostgreSQL: List all constraints
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS references_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'target_table';
```

### 5. Index Status

```sql
-- PostgreSQL: Index information
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_indexes
JOIN pg_stat_user_indexes ON indexrelname = indexname
WHERE tablename = 'target_table';
```

## Post-Migration Validation Checklist

### 1. Row Count Comparison

```sql
-- Compare with baseline
SELECT
    b.table_name,
    b.value as baseline_count,
    CASE b.table_name
        WHEN 'users' THEN (SELECT COUNT(*) FROM users)
        -- Add cases for other tables
    END as current_count,
    CASE b.table_name
        WHEN 'users' THEN (SELECT COUNT(*) FROM users) - b.value
    END as difference
FROM migration_baselines b
WHERE b.migration_id = :migration_id
  AND b.metric = 'total_rows';
```

### 2. Data Transformation Verification

```sql
-- Verify transformation applied correctly
-- Example: Email normalization migration
SELECT COUNT(*) as failed_transforms
FROM users
WHERE email_normalized IS NULL
  AND email IS NOT NULL;

-- Verify transformation logic
SELECT COUNT(*) as incorrect_transforms
FROM users
WHERE email_normalized != LOWER(TRIM(email))
  AND email IS NOT NULL;
```

### 3. NULL Value Analysis

```sql
-- Check for unexpected NULLs after migration
SELECT
    'new_column' as column_name,
    COUNT(*) FILTER (WHERE new_column IS NULL) as null_count,
    COUNT(*) FILTER (WHERE new_column IS NOT NULL) as non_null_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE new_column IS NULL) / COUNT(*), 2) as null_percentage
FROM users;
```

### 4. Referential Integrity (Post)

```sql
-- Verify no new orphans created
SELECT 'orders.user_id' as foreign_key,
       COUNT(*) as orphan_count,
       CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL AND o.user_id IS NOT NULL;
```

### 5. Unique Constraint Verification

```sql
-- Check for duplicate violations before adding unique constraint
SELECT column_value, COUNT(*) as duplicate_count
FROM (
    SELECT new_column as column_value
    FROM target_table
    WHERE new_column IS NOT NULL
) t
GROUP BY column_value
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 10;
```

## Comparison Queries

### Data Diff Report

```sql
-- Generate diff report
WITH baseline AS (
    SELECT * FROM users_backup_20240115
),
current AS (
    SELECT * FROM users
)
SELECT
    'added' as change_type,
    c.id,
    c.email
FROM current c
LEFT JOIN baseline b ON c.id = b.id
WHERE b.id IS NULL

UNION ALL

SELECT
    'removed' as change_type,
    b.id,
    b.email
FROM baseline b
LEFT JOIN current c ON b.id = c.id
WHERE c.id IS NULL

UNION ALL

SELECT
    'modified' as change_type,
    c.id,
    c.email
FROM current c
JOIN baseline b ON c.id = b.id
WHERE c.updated_at > b.updated_at;
```

### Column Value Comparison

```sql
-- Compare specific column before/after
SELECT
    COALESCE(b.status, 'N/A') as old_value,
    COALESCE(c.status, 'N/A') as new_value,
    COUNT(*) as row_count
FROM users_backup_20240115 b
FULL OUTER JOIN users c ON b.id = c.id
GROUP BY 1, 2
ORDER BY 3 DESC;
```

## Sampling Validation

For large tables, validate a statistical sample:

### Random Sample Verification

```sql
-- Validate 1% random sample
WITH sample AS (
    SELECT *
    FROM users
    WHERE random() < 0.01
    LIMIT 10000
)
SELECT
    COUNT(*) as sample_size,
    COUNT(*) FILTER (WHERE transformation_valid(old_col, new_col)) as valid_transforms,
    COUNT(*) FILTER (WHERE NOT transformation_valid(old_col, new_col)) as invalid_transforms
FROM sample;
```

### Stratified Sample

```sql
-- Sample from each partition/category
WITH stratified AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY status ORDER BY random()) as rn
    FROM users
)
SELECT
    status,
    COUNT(*) as sample_count,
    SUM(CASE WHEN new_col IS NOT NULL THEN 1 ELSE 0 END) as migrated
FROM stratified
WHERE rn <= 100  -- 100 samples per status
GROUP BY status;
```

## Automated Validation Framework

### Validation Rule Definition

```sql
CREATE TABLE validation_rules (
    rule_id SERIAL PRIMARY KEY,
    migration_id VARCHAR(100),
    rule_name VARCHAR(100),
    rule_type VARCHAR(50),  -- 'count', 'integrity', 'transform', 'custom'
    table_name VARCHAR(100),
    check_query TEXT,
    expected_result TEXT,
    severity VARCHAR(20)  -- 'error', 'warning', 'info'
);

-- Example rules
INSERT INTO validation_rules (migration_id, rule_name, rule_type, table_name, check_query, expected_result, severity)
VALUES
    ('mig_001', 'row_count_preserved', 'count', 'users',
     'SELECT COUNT(*) FROM users',
     '${baseline_count}', 'error'),

    ('mig_001', 'no_orphan_orders', 'integrity', 'orders',
     'SELECT COUNT(*) FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE u.id IS NULL',
     '0', 'error'),

    ('mig_001', 'transform_complete', 'transform', 'users',
     'SELECT COUNT(*) FROM users WHERE new_col IS NULL AND old_col IS NOT NULL',
     '0', 'error');
```

### Validation Runner

```sql
-- Run all validations for a migration
WITH validation_results AS (
    SELECT
        r.rule_id,
        r.rule_name,
        r.severity,
        r.expected_result,
        -- Dynamic execution would need procedural code
        'placeholder' as actual_result
    FROM validation_rules r
    WHERE r.migration_id = :migration_id
)
SELECT
    rule_name,
    severity,
    expected_result,
    actual_result,
    CASE WHEN expected_result = actual_result THEN 'PASS' ELSE 'FAIL' END as status
FROM validation_results
ORDER BY
    CASE severity WHEN 'error' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END,
    rule_name;
```

## Continuous Validation

For long-running migrations, validate continuously:

### Progress Validation

```sql
-- Check every N batches
SELECT
    (SELECT COUNT(*) FROM users WHERE new_col IS NOT NULL) as migrated,
    (SELECT COUNT(*) FROM users) as total,
    (SELECT COUNT(*) FROM users WHERE new_col IS NULL AND old_col IS NOT NULL) as pending,
    (SELECT COUNT(*) FROM users WHERE new_col != expected_transform(old_col)) as errors
FROM dual;
```

### Error Log Table

```sql
CREATE TABLE migration_errors (
    error_id SERIAL PRIMARY KEY,
    migration_id VARCHAR(100),
    row_id BIGINT,
    error_type VARCHAR(50),
    error_message TEXT,
    old_value TEXT,
    attempted_value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Log errors during migration
INSERT INTO migration_errors (migration_id, row_id, error_type, error_message, old_value, attempted_value)
SELECT
    :migration_id,
    id,
    'transform_error',
    'Value truncation required',
    old_col,
    LEFT(old_col, 50)
FROM users
WHERE LENGTH(old_col) > 50;
```

## Validation Report Template

### Summary Section

```
Migration Validation Report
===========================
Migration ID: mig_001
Executed At: 2024-01-15 14:30:00
Duration: 2 hours 15 minutes

Overall Status: PASS/FAIL

Tables Affected: 3
Rows Processed: 1,500,000
Errors Encountered: 0
```

### Detail Sections

```
Row Count Validation
--------------------
| Table   | Baseline  | Current   | Diff  | Status |
|---------|-----------|-----------|-------|--------|
| users   | 1,000,000 | 1,000,000 | 0     | PASS   |
| orders  | 500,000   | 500,000   | 0     | PASS   |

Transformation Validation
-------------------------
| Column          | Expected | Actual | Status |
|-----------------|----------|--------|--------|
| email_normalized| 1,000,000| 1,000,000| PASS  |

Integrity Validation
--------------------
| Relationship            | Orphans | Status |
|-------------------------|---------|--------|
| orders.user_id -> users | 0       | PASS   |
```

## Common Validation Mistakes

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| Skip pre-migration baseline | No comparison possible | Always capture baseline first |
| Sample too small | Miss edge cases | Use statistically significant sample |
| Only validate success | Miss silent failures | Also validate expected counts |
| Ignore warnings | Issues become errors later | Address all warnings |
| Validate once | Miss delayed issues | Continuous validation for large migrations |
| Trust row counts only | Data corruption undetected | Validate data content too |
