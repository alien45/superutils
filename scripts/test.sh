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
export PKG="${PKG:-*}" # * => all packages
export UI="${UI:-false}"
export RUN="${RUN:-false}"
export COVERAGE="${COVERAGE:-false}"

SCRIPT="vitest"
FIRST=$1

if [[ "${FIRST}" == :* ]]; then
    export FIRST="*${FIRST}"
fi

if [[ -n "$FIRST" ]]; then
    arr=(${FIRST//:/ }) # split by ':'
    export PKG="${PKG:-${arr[0]}}"
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

# run Vitest, it will inherit all exported variables
npm run $SCRIPT
