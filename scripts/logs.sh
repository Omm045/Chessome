#!/bin/bash
set -e
echo "Fetching backend logs from Fly.io..."
fly logs
