#!/bin/bash

# Path to the root of the monorepo
ROOT_DIR="$(pwd)"

# Extract project references from tsconfig.json
REFERENCES=$(jq -r '.references[].path' "$ROOT_DIR/tsconfig.json")

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "jq (JSON processor) is required. Please install it."
    exit 1
fi

# Build each referenced project
COMMAND="tsgo" # or "tsc" if you want to fallback to the standard TypeScript compiler.
if [[ "$tsgo" == "0" ]]; then
    COMMAND="tsc"
fi
ARGS=()

for PROJECT in $REFERENCES; do
    ARGS+=("--project")
    ARGS+=("$ROOT_DIR/$PROJECT/tsconfig.json")
done

echo "$COMMAND ${ARGS[@]}"
# Run the final command with all arguments
"$COMMAND" "${ARGS[@]}"