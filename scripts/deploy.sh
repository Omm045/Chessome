#!/bin/bash
set -e

echo "Deploying backend to Fly.io..."

# Ensure we are logged in to fly
if ! command -v fly &> /dev/null
then
    echo "flyctl could not be found. Please install it first."
    exit 1
fi

fly deploy --ha=false

# WARNING: We use `db push` exclusively for the initial Alpha deployment on an empty database.
# For all future production deployments, change the line below to:
# fly ssh console -C "npx prisma migrate deploy"
echo "Deployment complete. Running Prisma schema push within the VM..."
fly ssh console -C "npx prisma db push --schema packages/database/prisma/schema.prisma"

echo "Backend is live!"
