#!/usr/bin/env sh
# Hook helper: runs npm run prepush which in turn runs the check-stack script.
# Exits non-zero if Bun is missing or check-stack fails.
set -e
printf "Running pre-push stack check...\n"
npm run prepush
printf "Pre-push stack check passed.\n"
