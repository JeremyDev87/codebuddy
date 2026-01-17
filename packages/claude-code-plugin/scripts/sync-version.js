#!/usr/bin/env node
/**
 * Version Sync Script
 *
 * Synchronizes the plugin version with the MCP server version.
 * This ensures both packages stay in sync during releases.
 */

const fs = require('fs');
const path = require('path');

const MCP_SERVER_PKG_PATH = path.resolve(
  __dirname,
  '../../../apps/mcp-server/package.json',
);
const PLUGIN_PKG_PATH = path.resolve(__dirname, '../package.json');
const PLUGIN_MANIFEST_PATH = path.resolve(
  __dirname,
  '../.claude-plugin/plugin.json',
);

function syncVersion() {
  // Read MCP server version
  const mcpPkg = JSON.parse(fs.readFileSync(MCP_SERVER_PKG_PATH, 'utf8'));
  const version = mcpPkg.version;

  console.log(`[sync-version] MCP Server version: ${version}`);

  // Update plugin package.json
  const pluginPkg = JSON.parse(fs.readFileSync(PLUGIN_PKG_PATH, 'utf8'));
  if (pluginPkg.version !== version) {
    pluginPkg.version = version;
    // Also update peerDependencies to match major.minor
    const [major, minor] = version.split('.');
    pluginPkg.peerDependencies = pluginPkg.peerDependencies || {};
    pluginPkg.peerDependencies.codingbuddy = `^${major}.${minor}.0`;

    fs.writeFileSync(
      PLUGIN_PKG_PATH,
      JSON.stringify(pluginPkg, null, 2) + '\n',
    );
    console.log(`[sync-version] Updated package.json to ${version}`);
  } else {
    console.log(`[sync-version] package.json already at ${version}`);
  }

  // Update plugin manifest
  const manifest = JSON.parse(fs.readFileSync(PLUGIN_MANIFEST_PATH, 'utf8'));
  if (manifest.version !== version) {
    manifest.version = version;
    fs.writeFileSync(
      PLUGIN_MANIFEST_PATH,
      JSON.stringify(manifest, null, 2) + '\n',
    );
    console.log(`[sync-version] Updated plugin.json to ${version}`);
  } else {
    console.log(`[sync-version] plugin.json already at ${version}`);
  }

  console.log('[sync-version] Version sync complete!');
}

try {
  syncVersion();
} catch (error) {
  console.error('[sync-version] Error:', error.message);
  process.exit(1);
}
