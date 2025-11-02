#!/bin/bash
set -e  # Exit immediately if a command fails

# Ensure NODE_ENV is set
if [ -z "$NODE_ENV" ]; then
  echo "NODE_ENV is not set. Please set it before running tests."
  exit 1;
fi

echo "Running tests in NODE_ENV=$NODE_ENV";

if [ "$NODE_ENV" = "local" ]; then
  yarn test:unit && yarn test:integration;
else
  yarn test:unit;
fi
