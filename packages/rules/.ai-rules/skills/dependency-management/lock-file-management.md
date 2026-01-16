# Lock File Management

Procedures for maintaining lock file integrity and resolving conflicts.

## Why Lock Files Matter

Lock files ensure **reproducible builds**:
- Exact versions installed across all environments
- Prevents "works on my machine" issues
- Security audit trail for dependencies
- Faster installs (resolved dependency tree)

**Treat lock files as source code.** They deserve the same care as any other code.

## Lock File Types by Package Manager

| Manager | Lock File | Format |
|---------|-----------|--------|
| npm | `package-lock.json` | JSON |
| Yarn Classic | `yarn.lock` | Custom |
| Yarn Berry | `yarn.lock` | YAML |
| pnpm | `pnpm-lock.yaml` | YAML |
| Bun | `bun.lockb` | Binary |

## Merge Conflict Resolution

### Prevention First

**Golden rule:** Never have two PRs modifying dependencies at the same time.

If unavoidable:
1. Merge one PR first
2. Rebase second PR
3. Regenerate lock file

### Resolution Procedure

When conflicts occur:

```bash
# Step 1: Accept the target branch's package.json (usually main)
git checkout main -- package.json

# Step 2: Delete the conflicted lock file
rm package-lock.json  # or yarn.lock, pnpm-lock.yaml

# Step 3: Reinstall to regenerate lock file
npm install  # or yarn, pnpm install

# Step 4: Verify no unexpected changes
git diff package-lock.json

# Step 5: Commit the resolved lock file
git add package.json package-lock.json
git commit -m "chore: resolve lock file conflict"
```

### What NOT to Do

- **Don't manually edit lock files** - Always regenerate
- **Don't merge conflict markers** - Lock files aren't mergeable
- **Don't use `--force` flags** - Investigate the conflict
- **Don't skip lock file in commits** - It's required for reproducibility

## CI/CD Validation

### Lock File Integrity Check

```yaml
# GitHub Actions example
- name: Verify lock file integrity
  run: |
    # For npm
    npm ci
    # Fails if lock file would change

    # For yarn
    yarn install --frozen-lockfile

    # For pnpm
    pnpm install --frozen-lockfile
```

### Preventing Lock File Drift

```yaml
# Fail if lock file is out of sync
- name: Check lock file sync
  run: |
    npm install
    git diff --exit-code package-lock.json || {
      echo "Lock file out of sync with package.json"
      exit 1
    }
```

### Security Audit in CI

```yaml
- name: Security audit
  run: |
    npm audit --audit-level=high
    # Fails build on high+ vulnerabilities
```

## Automated Update Strategies

### Dependabot Configuration

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    # Group minor/patch updates
    groups:
      dependencies:
        patterns:
          - "*"
        update-types:
          - "minor"
          - "patch"
    # Separate PRs for majors
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
```

### Renovate Configuration

```json
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchUpdateTypes": ["patch", "minor"],
      "automerge": true,
      "automergeType": "branch"
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false,
      "labels": ["breaking-change"]
    }
  ],
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 5am on monday"]
  }
}
```

### Auto-merge Safety Rules

Only auto-merge when:
- [ ] Patch/minor version only
- [ ] All CI checks pass
- [ ] No security advisories for new version
- [ ] Package has >1M weekly downloads (stability indicator)
- [ ] Not a critical dependency

## Lock File Best Practices

### Commit Lock Files Always

```gitignore
# .gitignore - DON'T ignore lock files
# ❌ package-lock.json
# ❌ yarn.lock
```

### Regenerate Periodically

Schedule lock file regeneration:
- Weekly for active projects
- Before major releases
- After security incidents

```bash
# Full regeneration
rm -rf node_modules package-lock.json
npm install
```

### Review Lock File Changes

When reviewing PRs with lock file changes:

1. **Check package.json first** - What was the intended change?
2. **Verify version updates match** - Lock file should reflect package.json
3. **Look for unexpected changes** - Transitive deps shouldn't change randomly
4. **Check integrity hashes** - Should be present for all packages

## Troubleshooting

### "Lock file out of date"

```bash
# Regenerate lock file
rm package-lock.json
npm install
```

### "Peer dependency conflict"

```bash
# Find the conflict
npm ls <conflicting-package>

# Options:
# 1. Update the parent package
# 2. Use resolutions/overrides to force version
# 3. Use --legacy-peer-deps (last resort)
```

### "Integrity checksum mismatch"

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Different lock file locally vs CI"

Causes:
- Different npm version
- Different Node version
- npm registry differences

Solutions:
```bash
# Pin npm version in CI
npm install -g npm@10.x

# Use .npmrc for registry consistency
# .npmrc
registry=https://registry.npmjs.org/

# Use engines in package.json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

## Lock File Audit

### Finding Outdated Lock Entries

```bash
# List outdated packages
npm outdated

# Check for packages not in package.json
npm prune --dry-run
```

### Removing Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove and regenerate lock
npm uninstall <unused-package>
```

### Lock File Size Management

Large lock files indicate:
- Too many dependencies
- Duplicate packages
- Outdated transitive deps

```bash
# Deduplicate (npm 7+)
npm dedupe

# Check package count
jq '.packages | length' package-lock.json
```

## Private Registry Handling

When using private npm registries (npm Enterprise, Artifactory, Verdaccio, GitHub Packages):

### Authentication Setup

```bash
# .npmrc for private registry
@myorg:registry=https://npm.mycompany.com/
//npm.mycompany.com/:_authToken=${NPM_TOKEN}

# GitHub Packages
@myorg:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# Multiple registries
@company-a:registry=https://npm.company-a.com/
@company-b:registry=https://npm.company-b.com/
```

### CI/CD Authentication

```yaml
# GitHub Actions
- name: Setup npm auth
  run: |
    echo "@myorg:registry=https://npm.pkg.github.com/" >> .npmrc
    echo "//npm.pkg.github.com/:_authToken=${{ secrets.NPM_TOKEN }}" >> .npmrc

# GitLab CI
before_script:
  - echo "@myorg:registry=https://${CI_SERVER_HOST}/api/v4/packages/npm/" >> .npmrc
  - echo "//${CI_SERVER_HOST}/api/v4/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc
```

### Audit with Private Registries

```bash
# npm audit may not work with all private registries
# Alternative: use registry-specific tools

# Artifactory
jfrog rt audit

# Snyk (works with private registries)
snyk test

# GitHub Advisory Database (public packages only)
npm audit --registry=https://registry.npmjs.org/
```

### Lock File Considerations

1. **Registry URLs in lock file**
   - Lock files contain resolved URLs
   - Private registry URLs will be in lock file
   - Don't commit auth tokens (they shouldn't be in lock file)

2. **Mirrored packages**
   - If using registry mirror, lock file URLs point to mirror
   - CI/CD needs access to same registry
   - Consider fallback to public registry

3. **Scoped packages**
   - Scoped packages (@org/pkg) route to configured registry
   - Unscoped packages use default registry
   - Verify both are accessible in CI

### Troubleshooting Private Registries

**"401 Unauthorized"**
```bash
# Verify token is set
npm whoami --registry=https://npm.mycompany.com/

# Re-authenticate
npm login --registry=https://npm.mycompany.com/ --scope=@myorg
```

**"404 Not Found"**
```bash
# Check if package exists in private registry
npm view @myorg/package --registry=https://npm.mycompany.com/

# May need to proxy to public registry
```

**"UNABLE_TO_VERIFY_LEAF_SIGNATURE"**
```bash
# Self-signed certificate issue
npm config set strict-ssl false  # Not recommended for production

# Better: Add CA certificate
npm config set cafile /path/to/ca-cert.pem
```

## Emergency Procedures

### Lock File Corruption

```bash
# Nuclear option - full reset
rm -rf node_modules package-lock.json .npm
npm cache clean --force
npm install
```

### Rollback Lock File

```bash
# Find last known good lock file
git log --oneline -- package-lock.json

# Restore specific version
git checkout <commit-hash> -- package-lock.json
npm ci
```

### Force Specific Versions

When you need to override versions:

```json
// package.json (npm)
{
  "overrides": {
    "vulnerable-package": "2.0.1"
  }
}

// package.json (yarn)
{
  "resolutions": {
    "vulnerable-package": "2.0.1"
  }
}

// package.json (pnpm)
{
  "pnpm": {
    "overrides": {
      "vulnerable-package": "2.0.1"
    }
  }
}
```
