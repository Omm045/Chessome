#!/bin/bash
set -e

echo "Verifying Stockfish engine capability..."

# The Stockfish WASM binary is used in our platform
ENGINE_PATH="packages/engine-stockfish/src/wasm/stockfish.js"

if [ ! -f "$ENGINE_PATH" ]; then
    echo "ERROR: Engine binary not found at $ENGINE_PATH"
    echo "Ensure you have built the engine dependencies before deploying."
    exit 1
fi

echo "Binary exists at $ENGINE_PATH"

# Test the UCI handshake using node to execute the wasm wrapper
echo "Testing UCI handshake..."
RESPONSE=$(echo -e "uci\nisready\nquit" | node "$ENGINE_PATH" | grep "readyok" || true)

if [[ -z "$RESPONSE" ]]; then
    echo "ERROR: Engine did not respond with 'readyok'."
    echo "Full handshake failed."
    exit 1
fi

echo "Engine verification passed. UCI handshake successful."
exit 0
