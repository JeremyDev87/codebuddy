#!/bin/bash
# validate-translations.sh
# Validates translated documentation files for common issues
# Usage: ./scripts/validate-translations.sh [--fix]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "=========================================="
echo "  Translation Validation Script"
echo "=========================================="
echo ""

# Function to check Portuguese accents
check_portuguese_accents() {
    local file="$1"
    local issues=0

    # Check for unaccented -cao words (should be -ção)
    if grep -qE '\b[a-zA-Z]+cao\b' "$file" 2>/dev/null; then
        echo -e "${RED}ERROR:${NC} $file contains unaccented -cao words (should be -ção)"
        grep -nE '\b[a-zA-Z]+cao\b' "$file" | head -5
        ((issues++))
    fi

    # Check for unaccented -coes words (should be -ções)
    if grep -qE '\b[a-zA-Z]+coes\b' "$file" 2>/dev/null; then
        echo -e "${RED}ERROR:${NC} $file contains unaccented -coes words (should be -ções)"
        grep -nE '\b[a-zA-Z]+coes\b' "$file" | head -5
        ((issues++))
    fi

    # Check for common unaccented words
    if grep -qwE 'voce|versao|metodo|secao|opcao|sessao|Portugues' "$file" 2>/dev/null; then
        echo -e "${RED}ERROR:${NC} $file contains common unaccented Portuguese words"
        grep -nwE 'voce|versao|metodo|secao|opcao|sessao|Portugues' "$file" | head -5
        ((issues++))
    fi

    return $issues
}

# Function to check language selector consistency
check_language_selector() {
    local file="$1"
    local expected_langs=("English" "한국어" "中文" "日本語" "Español" "Português")
    local issues=0

    for lang in "${expected_langs[@]}"; do
        if ! grep -q "$lang" "$file" 2>/dev/null; then
            echo -e "${YELLOW}WARNING:${NC} $file missing language selector for: $lang"
            ((issues++))
        fi
    done

    return $issues
}

# Function to check AI disclaimer
check_ai_disclaimer() {
    local file="$1"
    local dir=$(dirname "$file")
    local issues=0

    # Skip English files (no disclaimer needed)
    if [[ "$dir" == "docs" || "$dir" == "./docs" ]]; then
        return 0
    fi

    if ! grep -q "🤖" "$file" 2>/dev/null; then
        echo -e "${YELLOW}WARNING:${NC} $file missing AI translation disclaimer"
        ((issues++))
    fi

    return $issues
}

# Main validation
echo "Checking Portuguese translations..."
echo "-----------------------------------"
for file in docs/pt-BR/plugin-*.md; do
    if [[ -f "$file" ]]; then
        check_portuguese_accents "$file"
        ERRORS=$((ERRORS + $?))
    fi
done
echo ""

echo "Checking language selectors..."
echo "------------------------------"
for file in docs/plugin-*.md docs/*/plugin-*.md; do
    if [[ -f "$file" ]]; then
        check_language_selector "$file"
        WARNINGS=$((WARNINGS + $?))
    fi
done
echo ""

echo "Checking AI disclaimers..."
echo "--------------------------"
for file in docs/*/plugin-*.md; do
    if [[ -f "$file" ]]; then
        check_ai_disclaimer "$file"
        WARNINGS=$((WARNINGS + $?))
    fi
done
echo ""

# Summary
echo "=========================================="
echo "  Validation Summary"
echo "=========================================="
if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
    echo -e "${GREEN}All checks passed!${NC}"
    exit 0
elif [[ $ERRORS -eq 0 ]]; then
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo -e "${GREEN}Errors: 0${NC}"
    exit 0
else
    echo -e "${RED}Errors: $ERRORS${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    exit 1
fi
