#!/bin/bash
# Marketplace utility functions for GitHub Actions workflow
# Eliminates duplication between validate and build jobs

set -euo pipefail

# Configuration
MARKETPLACE_JSON="${MARKETPLACE_JSON:-.claude-plugin/marketplace.json}"

# Get the number of plugins in marketplace.json
get_plugin_count() {
  jq '.plugins | length' "$MARKETPLACE_JSON"
}

# Get plugin name by index
get_plugin_name() {
  local index=$1
  jq -r ".plugins[$index].name" "$MARKETPLACE_JSON"
}

# Get plugin source by index
get_plugin_source() {
  local index=$1
  jq -r ".plugins[$index].source" "$MARKETPLACE_JSON"
}

# Validate a single plugin's required fields and directory structure
# Returns 0 on success, 1 on failure
validate_plugin() {
  local index=$1
  local plugin_name
  local plugin_source

  plugin_name=$(get_plugin_name "$index")
  plugin_source=$(get_plugin_source "$index")

  # Check name field
  if [ "$plugin_name" == "null" ] || [ -z "$plugin_name" ]; then
    echo "Error: Plugin at index $index missing 'name' field"
    return 1
  fi

  # Check source field
  if [ "$plugin_source" == "null" ] || [ -z "$plugin_source" ]; then
    echo "Error: Plugin '$plugin_name' missing 'source' field"
    return 1
  fi

  # Check if plugin source directory exists
  if [ ! -d "$plugin_source" ]; then
    echo "Error: Plugin '$plugin_name' source directory '$plugin_source' not found"
    return 1
  fi

  # Check if plugin.json exists in source
  if [ ! -f "$plugin_source/.claude-plugin/plugin.json" ]; then
    echo "Error: Plugin '$plugin_name' missing plugin.json at '$plugin_source/.claude-plugin/plugin.json'"
    return 1
  fi

  return 0
}

