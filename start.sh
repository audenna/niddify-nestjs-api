#!/bin/sh

echo "Installing Dependencies..."
yarn install --frozen-lockfile

echo "Starting niddify-nestjs-api app..."
yarn start:dev