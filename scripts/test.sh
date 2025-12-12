# #!/usr/bin/env bash

#
# Lil script to run Vitest with the environment variables
# Example usage:
# `npm test` => watch & run all test on all packages
# `npm test core` => watuch & run test only on "core" package
# `npm test core:1` => run test on "core" package once and exit
# `npm test core:%` => run test on "core" package with coverage enabled
# `npm test core:ui` => watch & run test on "core" package and open web UI
# `UI=1 npm test` => run test on all packages and enable UI
# `UI=true npm test` => run test on all packages and enable UI
# `COVERAGE=1 UI=1 npm test` => watch and run all pacakges with test coverage
#
# Vitest CLI flags can be passed by adding "--" followed by the flag (eg: --passWithNoTests)
# `npm test core:1 -- --passWithNoTests`
# OR,
# `npm test  -- --passWithNoTests core:1`

# Respect existing environment variables
export PKG="${PKG:-*}" # * => all packages
export UI="${UI:-false}"
export RUN="${RUN:-false}"
export COVERAGE="${COVERAGE:-false}"
SCRIPT="vitest"

# Initialize variables for Vitest arguments
VITEST_CLI_ARGS=""
OPTIONS=()

# Parse arguments for test.sh and Vitest CLI
for arg in "$@"; do
    if [[ "$arg" == "--" ]]; then
        # Ignore the '--' separator itself, its job is done.
        continue
    fi
    if [[ "$arg" == --* ]]; then
        # Collect arguments to be passed directly to Vitest
        # Quotes are important to preserve arguments with spaces
        # VITEST_CLI_ARGS+=" \"$arg\""
        VITEST_CLI_ARGS+=" $arg"
    else
        # Collect arguments for test.sh's own parsing
        OPTIONS+=("$arg")
    fi
done

OPTIONS="${OPTIONS[0]}" # This will be like 'core:ui' or just 'core'
echo $OPTIONS
if [[ "${OPTIONS}" == :* ]]; then
    export OPTIONS="*${OPTIONS}"
fi

if [[ -n "$OPTIONS" ]]; then
    # Create a new variable "arr" by splitting "OPTIONS" variable by ':'
    # IFS = Internal Field Separator
    # What IFS Does: The read command, and the shell in general, uses the IFS variable 
    # to determine how to split a line of text into separate "fields" or "words".
    # TLDR: DO NOT CHANGE "IFS"
    IFS=':' read -r -a arr <<< "$OPTIONS"

    if [[ "$arr[0]" != "*" ]]; then
        export PKG="${arr[0]}"
    fi

    options=("${arr[@]:1}") # remove first element
    isOption () {
        for opt in "${options[@]}"; do [[ "$opt" == "$1" ]] && return 0;
        done
        return 1
    }

    if isOption "ui" || [[ "${UI}" == "1" ]]; then
        export UI="true"
    fi

    if isOption "run" || isOption "1" || [[ "${RUN}" == "1" ]]; then
        export RUN="true"
    fi

    if isOption "coverage" || isOption "%" || [[ "${COVERAGE}" == "1" ]]; then
        export COVERAGE="true"
    fi
fi

if [[ "${COVERAGE}" == "true" ]]; then
    SCRIPT="vitest:coverage"
fi

# Use eval to correctly handle arguments with spaces or quotes
# The '--' separator tells npm to pass all subsequent args to the script
eval npm run "$SCRIPT" -- $VITEST_CLI_ARGS
