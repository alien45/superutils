# #!/usr/bin/env bash

#
# Lil script to run Vitest with the environment variables
# Example usage:
# `npm test` // watch & run all test on all packages
# `npm test core` // watuch & run test only on "core" package
# `npm test core:ui` // watch & run test on "core" package and open web UI
# `npm test core:once` // run test on "core" package once and exit
# `npm test core:%` // run test on "core" package with coverage enabled

# Respect existing environment variables
FIRST=$1
export PKG="${PKG:-*}" # * => all packages
export UI="${UI:-false}"
export RUN="${RUN:-false}"
export COVERAGE="${COVERAGE:-false}"

SCRIPT="vitest"

if [[ "${FIRST}" == :* ]]; then
    export FIRST="*${FIRST}"
fi

if [[ -n "$FIRST" ]]; then
    # Create a new variable "arr" by splitting "FIRST" variable by ':'
    # IFS = Internal Field Separator
    # What IFS Does: The read command, and the shell in general, uses the IFS variable 
    # to determine how to split a line of text into separate "fields" or "words".
    # TLDR: DO NOT CHANGE "IFS"
    IFS=':' read -r -a arr <<< "$FIRST"

    if [[ "$arr[0]" != "*" ]]; then
        export PKG="${arr[0]}"
    fi

    options=("${arr[@]:1}") # remove first element
    isOption () {
        for opt in "${options[@]}"; do [[ "$opt" == "$1" ]] && return 0;
        done
        return 1
    }

    if isOption "ui"; then
        export UI="true"
    fi

    if isOption "run" || isOption "once"; then
        export RUN="true"
    fi

    if isOption "coverage" || isOption "%"; then
        export COVERAGE="true"
    fi
fi

if [[ "${COVERAGE}" == "true" ]]; then
    SCRIPT="vitest:coverage"
    rm -rf ./coverage
fi

echo $SCRIPT
# run Vitest, it will inherit all exported variables
npm run $SCRIPT
