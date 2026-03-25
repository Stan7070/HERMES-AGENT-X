const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const os = require('os');
const path = require('path');
const cors = require('cors');

const execAsync = promisify(exec);
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3002;

app.post('/api/execute', async (req, res) => {
  const { tool, args } = req.body;
  
  const response = {
    tool: tool,
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
      // By default, save to public dir of nextjs if possible, or /tmp
      const artifactPath = path.join('/tmp', fileName);
      
      // Execute the macOS native screenshot command
      await execAsync(`/usr/sbin/screencapture -x "${artifactPath}"`);
      
      response.executed = true;
      response.success = true;
      response.artifactPath = artifactPath;
      response.proof = `Screenshot successfully captured and saved to ${artifactPath}`;
      
    } else if (tool === 'desktop.open_app') {
      const appName = args.appName;
      if (!appName) throw new Error('appName argument is required');
      
      // Execute the macOS native open command
      await execAsync(`open -a "${appName}"`);
      
      response.executed = true;
      response.success = true;
      response.proof = `Application ${appName} launched via native macOS API.`;
      
    } else {
      response.error = `Tool ${tool} is strictly not implemented in the native macOS companion.`;
    }
  } catch (err) {
    response.executed = true;
    response.success = false;
    response.error = err.message;
  }

  res.json(response);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[Hermes macOS Companion] Active and securely listening on http://127.0.0.1:${PORT}`);
  console.log(`[Hermes macOS Companion] EXPOSED TOOLS: system.info, desktop.screenshot, desktop.open_app`);
});
