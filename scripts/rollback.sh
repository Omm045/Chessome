#!/bin/bash
set -e
echo "Rolling back to a previous deployment..."
fly releases --image
echo "Please find the image ID from the list above and run: fly deploy -i <IMAGE_ID>"
