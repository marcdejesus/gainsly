#!/bin/bash

# Store process IDs
pids=()

# Function to kill all processes
cleanup() {
  echo -e "\nShutting down all processes..."
  
  # Kill all child processes
  for pid in "${pids[@]}"; do
    echo "Terminating process $pid"
    kill -TERM "$pid" 2>/dev/null
  done
  
  # Wait a moment for processes to clean up
  sleep 1
  echo "All processes terminated. Exiting."
  exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup INT TERM

# Get the directory of the script
SCRIPT_DIR="$(dirname "$0")"

# Check if node_modules exists in both directories
if [ ! -d "$SCRIPT_DIR/gainsly-api/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd "$SCRIPT_DIR/gainsly-api" && npm install
fi

if [ ! -d "$SCRIPT_DIR/gainsly-app/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd "$SCRIPT_DIR/gainsly-app" && npm install
fi

# Start backend server
echo "Starting Backend..."
cd "$SCRIPT_DIR/gainsly-api" && npx nodemon --exec ts-node src/index.ts &
pids+=($!)

# Start frontend server
echo "Starting Frontend..."
cd "$SCRIPT_DIR/gainsly-app" && npm start &
pids+=($!)

echo "Development servers started. Press Ctrl+C to stop all servers."

# Wait for all processes to finish
wait 