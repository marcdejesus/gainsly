const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const backendPath = path.join(__dirname, 'gainsly-api');
const frontendPath = path.join(__dirname, 'gainsly-app');

// Check if node_modules exists in both directories
const backendNodeModules = path.join(backendPath, 'node_modules');
const frontendNodeModules = path.join(frontendPath, 'node_modules');

// Install dependencies if needed
if (!fs.existsSync(backendNodeModules)) {
  console.log('Installing backend dependencies...');
  execSync('npm install', { cwd: backendPath, stdio: 'inherit' });
}

if (!fs.existsSync(frontendNodeModules)) {
  console.log('Installing frontend dependencies...');
  execSync('npm install', { cwd: frontendPath, stdio: 'inherit' });
}

// Store child processes
const processes = [];

// Function to start a process
function startProcess(command, args, cwd, name) {
  console.log(`Starting ${name}...`);
  
  const childProcess = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: true }
  });
  
  childProcess.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  childProcess.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });
  
  childProcess.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });
  
  processes.push({ process: childProcess, name });
  return childProcess;
}

// Start backend
const backendProcess = startProcess('npx', ['nodemon', '--exec', 'ts-node', 'src/index.ts'], backendPath, 'Backend');

// Start frontend
const frontendProcess = startProcess('npm', ['start'], frontendPath, 'Frontend');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down all processes...');
  
  processes.forEach(({ process, name }) => {
    console.log(`Terminating ${name}...`);
    // On Windows use process.kill(process.pid)
    process.kill('SIGINT');
  });
  
  // Give processes a moment to clean up before exiting
  setTimeout(() => {
    console.log('All processes terminated. Exiting.');
    process.exit(0);
  }, 1000);
});

console.log('Development servers started. Press Ctrl+C to stop all servers.'); 