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

# Helper function to check if an array contains a given element.
# @param $1 - The element to search for.
# @param $2.. - The array elements.
# @return 0 if found, 1 if not found.
arrContains () {
  local e match="$1"
  shift
  for e; do [[ "$e" == "$match" ]] && return 0; done
  return 1
}

if [[ -n "$FIRST" ]]; then
    options=(${FIRST//:/ }) # split by ':'
    export PKG="${PKG:-${options[0]}}"

    if arrContains "ui" "${options[@]}"; then
        export UI="true"
    fi

    if arrContains "run" "${options[@]}" || arrContains "once" "${options[@]}"; then
        export RUN="true"
    fi

    if arrContains "coverage" "${options[@]}" || arrContains "%" "${options[@]}"; then
        export COVERAGE="true"
    fi
fi

if [[ "${COVERAGE}" == "true" ]]; then
    SCRIPT="vitest:coverage"
    rm -rf ./coverage
fi

# run Vitest, it will inherit all exported variables
npm run $SCRIPT
