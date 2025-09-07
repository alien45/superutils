# #!/usr/bin/env bash

#
# Lil script to run Vitest with the environment variables
# Example usage:
# `npm test` // watch & run all test on all packages
# `npm test core` // watuch & run test only on "core" package
# `npm test core:ui` // watch & run test on "core" package and open web UI
# `npm test core:once` // run test on "core" package once and exit
#

# Respect existing environment variables
PKG="${PKG:-*}" # * => all packages
UI="${UI:-false}"
RUN="${RUN:-false}"
FIRST=$1

if [[ "${FIRST}" == ":ui" ]]; then
    UI="true"
elif [[ -n "$FIRST" ]]; then
    arr=(${FIRST//:/ })
    PKG="${PKG:-${arr[0]}}"
    if [[ "${arr[1]}" == "ui" ]]; then
        UI="true"
    fi
    if [[ "${arr[1]}" == "run" || "${arr[1]}" == "once" ]]; then
        RUN="true"
    fi
fi

# run Vitest with the environment variables
PKG="$PKG" UI="$UI" RUN="$RUN" npm run vitest