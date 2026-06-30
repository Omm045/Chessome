#!/bin/bash
set -e
echo "Updating deployment..."
fly deploy --ha=false
echo "Update complete."
