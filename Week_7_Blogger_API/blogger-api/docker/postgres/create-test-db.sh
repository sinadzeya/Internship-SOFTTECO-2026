#!/bin/sh

set -e

echo "Creating test database: $TEST_DB_DATABASE"

psql \
  -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  -c "CREATE DATABASE \"$TEST_DB_DATABASE\";"