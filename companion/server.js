const http = require('http');
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');
const path = require('path');

const execAsync = promisify(exec);
const PORT = 3002;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/execute') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      let data = {};
      try {
        data = JSON.parse(body);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }

      const { tool, args = {} } = data;
      const response = {
        tool: tool || 'unknown',
        executed: false,
        success: false,
        simulated: false,
        error: null,
        proof: null,
        artifactPath: null
      };

      try {
        if (tool === 'system.info') {
          const info = {
            platform: os.platform(),
            release: os.release(),
            cpu: os.cpus()[0]?.model,
            totalMemoryGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
            freeMemoryGB: (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
            uptime: os.uptime()
          };
          
          response.executed = true;
          response.success = true;
          response.proof = info;
          
        } else if (tool === 'desktop.screenshot') {
          const fileName = `screenshot_${Date.now()}.png`;
          const publicDir = path.join('/Users/stane/HERMES AGENT X', 'public', 'runs');
          // If public/runs doesn't exist, we fallback to /tmp
          const fs = require('fs');
          if (!fs.existsSync(publicDir)) {
             fs.mkdirSync(publicDir, { recursive: true });
          }
          const absolutePath = path.join(publicDir, fileName);
          
          // Execute the macOS native screenshot command
          await execAsync(`/usr/sbin/screencapture -x "${absolutePath}"`);
          
          response.executed = true;
          response.success = true;
          response.artifactPath = `/runs/${fileName}`; // Web URL relative
          response.proof = `[MACOS NATIVE] Screenshot physically saved to ${absolutePath}`;
          
        } else if (tool === 'desktop.open_app') {
          const appName = args.appName;
          if (!appName) throw new Error('appName argument is required for desktop.open_app');
          
          // Execute the macOS native open command
          const { stdout, stderr } = await execAsync(`open -a "${appName}"`);
          if (stderr) throw new Error(stderr);
          
          response.executed = true;
          response.success = true;
          response.proof = `[MACOS NATIVE] Application '${appName}' launched successfully.`;
          
        } else {
          response.error = `Tool ${tool} is strictly not implemented in the native macOS companion.`;
        }
      } catch (err) {
        response.executed = true;
        response.success = false;
        response.error = err.message;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n======================================================`);
  console.log(`[HERMES MAC-OS COMPANION] ACTIVATED`);
  console.log(`Strictly executing native tools on port ${PORT}`);
  console.log(`Exposed APIs: system.info, desktop.screenshot, desktop.open_app`);
  console.log(`======================================================\n`);
});
