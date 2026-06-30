#!/bin/bash
set -e
echo "Fetching backend health check status..."
curl -s -f https://chessome-api.fly.dev/v1/health || { echo "Health check failed!"; exit 1; }
echo -e "\nHealth check passed!"
