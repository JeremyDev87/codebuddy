# Expand-Contract Patterns

Zero-downtime migration techniques for production database changes.

## Overview

The Expand-Contract pattern (also called Parallel Change) enables schema changes without downtime by:
1. **Expand**: Add new structure alongside old
2. **Migrate**: Move data gradually
3. **Contract**: Remove old structure after verification

## When to Use Expand-Contract

| Scenario | Direct Change | Expand-Contract |
|----------|---------------|-----------------|
| Add nullable column | OK | Overkill |
| Add NOT NULL column | Risky | Recommended |
| Rename column | Impossible | Required |
| Change column type | Risky | Required |
| Split table | Impossible | Required |
| Remove column | OK (if unused) | Recommended |

## Pattern 1: Adding NOT NULL Column

**Problem:** Adding NOT NULL column requires default or backfill, which locks table.

**Solution: Three-Phase Approach**

### Phase 1: Expand (Add Nullable)
```sql
-- Add as nullable first (instant, no lock)
ALTER TABLE users ADD COLUMN email_verified BOOLEAN;

-- Application: Write to new column, read from both
-- Code: user.email_verified ?? user.legacy_verified
```

### Phase 2: Migrate (Backfill)
```sql
-- Backfill in batches (no lock)
UPDATE users
SET email_verified = COALESCE(legacy_verified, false)
WHERE email_verified IS NULL
  AND id BETWEEN :start AND :end;
```

### Phase 3: Contract (Add Constraint)
```sql
-- After backfill complete, add NOT NULL
ALTER TABLE users ALTER COLUMN email_verified SET NOT NULL;

-- Remove old column (if replacing)
ALTER TABLE users DROP COLUMN legacy_verified;
```

**Application Changes:**
1. Deploy: Write to both columns
2. After Phase 2: Switch reads to new column
3. After Phase 3: Remove old column references

## Pattern 2: Renaming Column

**Problem:** Renaming column breaks existing queries instantly.

**Solution: Shadow Column**

### Phase 1: Add New Column
```sql
ALTER TABLE products ADD COLUMN product_name VARCHAR(255);
```

### Phase 2: Dual-Write Trigger
```sql
-- Trigger to sync old -> new
CREATE TRIGGER sync_product_name
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION sync_columns('name', 'product_name');

-- Backfill existing data
UPDATE products SET product_name = name WHERE product_name IS NULL;
```

### Phase 3: Application Migration
```
1. Deploy: Read from new, write to both
2. Verify: All reads using new column
3. Remove trigger and old column
```

### Phase 4: Contract
```sql
DROP TRIGGER sync_product_name ON products;
ALTER TABLE products DROP COLUMN name;
```

## Pattern 3: Changing Column Type

**Problem:** Type change may require table rewrite and data transformation.

**Solution: Shadow Column with Transform**

### Example: VARCHAR(50) to TEXT with validation

### Phase 1: Add New Column
```sql
ALTER TABLE comments ADD COLUMN content_v2 TEXT;
```

### Phase 2: Backfill with Transform
```sql
-- Batch update with transformation
UPDATE comments
SET content_v2 = TRIM(content)
WHERE content_v2 IS NULL
  AND id BETWEEN :start AND :end;
```

### Phase 3: Verify and Switch
```sql
-- Verify all data migrated
SELECT COUNT(*) FROM comments WHERE content_v2 IS NULL AND content IS NOT NULL;

-- Application: Switch to new column
-- Rename in next migration
ALTER TABLE comments DROP COLUMN content;
ALTER TABLE comments RENAME COLUMN content_v2 TO content;
```

## Pattern 4: Splitting Tables

**Problem:** Monolithic table needs to be split for performance or normalization.

**Solution: Gradual Extraction**

### Example: Extract `user_preferences` from `users`

### Phase 1: Create New Table
```sql
CREATE TABLE user_preferences (
    user_id BIGINT PRIMARY KEY REFERENCES users(id),
    theme VARCHAR(50),
    notifications_enabled BOOLEAN,
    language VARCHAR(10)
);
```

### Phase 2: Dual-Write
```sql
-- Trigger on users to sync to new table
CREATE TRIGGER sync_user_preferences
AFTER INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION sync_to_preferences();

-- Backfill existing data
INSERT INTO user_preferences (user_id, theme, notifications_enabled, language)
SELECT id, theme, notifications_enabled, language
FROM users
ON CONFLICT (user_id) DO NOTHING;
```

### Phase 3: Application Migration
```
1. Read from user_preferences (with fallback to users)
2. Write to both tables
3. Remove fallback after verification
```

### Phase 4: Contract
```sql
DROP TRIGGER sync_user_preferences ON users;
ALTER TABLE users DROP COLUMN theme;
ALTER TABLE users DROP COLUMN notifications_enabled;
ALTER TABLE users DROP COLUMN language;
```

## Pattern 5: Online Index Creation

**Problem:** CREATE INDEX locks table for writes.

**Solution: CONCURRENTLY option (PostgreSQL)**

```sql
-- Non-blocking index creation
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- Note: Takes longer, but no locks
-- Note: Can fail, leaving invalid index
-- Always verify:
SELECT * FROM pg_indexes WHERE indexname = 'idx_users_email';
```

**MySQL Online DDL:**
```sql
ALTER TABLE users ADD INDEX idx_email (email), ALGORITHM=INPLACE, LOCK=NONE;
```

## Pattern 6: Foreign Key Addition

**Problem:** Adding FK requires validation scan, blocking writes.

**Solution: NOT VALID + VALIDATE SEPARATELY**

### PostgreSQL
```sql
-- Add FK without validation (instant)
ALTER TABLE orders
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id) REFERENCES users(id)
NOT VALID;

-- Validate in background (non-blocking)
ALTER TABLE orders VALIDATE CONSTRAINT fk_orders_user;
```

### MySQL
```sql
-- Disable FK checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE orders
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id) REFERENCES users(id);

SET FOREIGN_KEY_CHECKS = 1;

-- Run integrity check manually
SELECT o.id, o.user_id
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE u.id IS NULL;
```

## Duration Guidelines

| Table Size | Expand Phase | Migrate Phase | Contract Phase |
|------------|--------------|---------------|----------------|
| <100K rows | Instant | <1 min | Instant |
| 100K-1M | Instant | 5-15 min | <1 min |
| 1M-10M | Instant | 1-4 hours | 5-15 min |
| 10M-100M | Instant | 4-24 hours | 1-4 hours |
| >100M | Instant | Days (batched) | 4-24 hours |

## Application Coordination

### Feature Flags for Migration
```typescript
// Read with fallback
function getUserEmail(user: User): string {
  if (featureFlags.useNewEmailColumn) {
    return user.email_normalized ?? user.email;
  }
  return user.email;
}

// Write to both
async function updateUserEmail(userId: string, email: string) {
  await db.user.update({
    where: { id: userId },
    data: {
      email: email,
      email_normalized: normalizeEmail(email),
    },
  });
}
```

### Rollout Strategy
1. **10% traffic**: Test new column reads
2. **50% traffic**: Verify performance
3. **100% traffic**: Full cutover
4. **Cleanup**: Remove old column

## Common Mistakes

| Mistake | Consequence | Prevention |
|---------|-------------|------------|
| Skip dual-write | Data inconsistency | Always write to both during migration |
| Contract too early | Application errors | Verify all reads switched before contract |
| No feature flag | Risky rollback | Use flags to control migration phases |
| Ignore failed index | Wasted space, slow queries | Check index validity after CONCURRENTLY |
| Rush timeline | Incomplete migration | Plan realistic durations per phase |

## Verification Queries

### Check Migration Progress
```sql
-- Percentage complete
SELECT
    COUNT(*) FILTER (WHERE new_column IS NOT NULL) as migrated,
    COUNT(*) as total,
    ROUND(100.0 * COUNT(*) FILTER (WHERE new_column IS NOT NULL) / COUNT(*), 2) as percent
FROM target_table;
```

### Verify Data Consistency
```sql
-- Compare old vs new
SELECT COUNT(*)
FROM target_table
WHERE old_column != new_column
  AND old_column IS NOT NULL
  AND new_column IS NOT NULL;
```

### Check for Orphaned References
```sql
-- After FK migration
SELECT COUNT(*)
FROM child_table c
LEFT JOIN parent_table p ON c.new_parent_id = p.id
WHERE c.new_parent_id IS NOT NULL AND p.id IS NULL;
```
