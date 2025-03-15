const { networkInterfaces } = require('os');

// Get the local IP address
const getLocalIpAddress = () => {
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  console.log('Available network interfaces:');
  for (const [key, value] of Object.entries(results)) {
    console.log(`${key}: ${value.join(', ')}`);
  }

  // Try to find a common interface
  const en0 = results['en0'] || [];
  const wlan0 = results['wlan0'] || [];
  const eth0 = results['eth0'] || [];
  
  const ip = en0[0] || wlan0[0] || eth0[0] || Object.values(results)[0]?.[0];
  
  if (ip) {
    console.log(`\nYour local IP address is: ${ip}`);
    console.log(`\nUpdate your API_URL in gainsly-app/src/services/api.ts to:`);
    console.log(`const API_URL = 'http://${ip}:5001/api';`);
  } else {
    console.log('\nCould not determine your local IP address.');
  }
};

getLocalIpAddress(); 