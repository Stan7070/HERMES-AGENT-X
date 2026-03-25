import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class DesktopToolService {
  /**
   * Captures a real screenshot using macOS native 'screencapture' binary via the Companion API.
   */
  async screenshot(runId: string): Promise<{ success: boolean; executed: boolean; artifactPath?: string; error?: string; result?: string; simulated?: boolean }> {
    try {
      const res = await fetch('http://127.0.0.1:3002/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'desktop.screenshot' })
      });
      const data = await res.json();
      return {
        success: data.success,
        executed: data.executed,
        result: data.proof,
        artifactPath: data.artifactPath,
        error: data.error,
        simulated: data.simulated
      };
    } catch (err: any) {
      return { success: false, executed: false, error: `[Companion Offline] ${err.message}` };
    }
  }

  /**
   * Opens an application on macOS via the Companion API.
   */
  async openApp(appName: string): Promise<{ success: boolean; executed: boolean; result?: string; error?: string; simulated?: boolean }> {
    try {
      const res = await fetch('http://127.0.0.1:3002/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'desktop.open_app', args: { appName } })
      });
      const data = await res.json();
      return {
        success: data.success,
        executed: data.executed,
        result: data.proof,
        error: data.error,
        simulated: data.simulated
      };
    } catch (err: any) {
      return { success: false, executed: false, error: `[Companion Offline] ${err.message}` };
    }
  }

  /**
   * Retrieves realtime system health info via the Companion API.
   */
  async systemInfo(): Promise<{ success: boolean; executed: boolean; result?: any; error?: string; simulated?: boolean }> {
    try {
       const res = await fetch('http://127.0.0.1:3002/api/execute', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ tool: 'system.info' })
       });
       const data = await res.json();
       return {
         success: data.success,
         executed: data.executed,
         result: JSON.stringify(data.proof),
         error: data.error,
         simulated: data.simulated
       };
    } catch (err: any) {
       return { success: false, executed: false, error: `[Companion Offline] ${err.message}` };
    }
  }
}

export const desktopTool = new DesktopToolService();

