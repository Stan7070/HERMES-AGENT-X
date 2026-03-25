import { NextRequest } from 'next/server';
import { globalOrchestrator } from '@/lib/runtime/orchestrator';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const encoder = new TextEncoder();
  const missionText = messages[messages.length - 1].content;

  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // 1. Mission Creation
        const run = await globalOrchestrator.createRun(missionText, 'hermes-x-ops');
        sendUpdate({ 
           type: 'status_update', 
           status: 'planning', 
           log: `Agent Runtime active: Mission ${run.id} created`,
           runId: run.id 
        });

        // 2. Planning Phase
        const plannerTask = await globalOrchestrator.addTask(run.id, {
           type: 'planning',
           title: 'Task Generation',
           status: 'running',
           workerName: 'PlannerWorker'
        });
        sendUpdate({ type: 'status_update', runId: run.id, tasks: run.tasks, events: run.events });
        
        let toolRan = '';
        let artifactDetails = '';

        // Simplistic Semantic Router for Real Computer Use testing
        const intent = typeof missionText === 'string' ? missionText.toLowerCase() : '';
        
        if (intent.includes('screenshot') || intent.includes('capture')) {
           plannerTask.status = 'completed';
           const desktopTask = await globalOrchestrator.addTask(run.id, { type: 'desktop', title: 'System Visual Audit', status: 'running', workerName: 'DesktopWorker' });
           sendUpdate({ type: 'status_update', tasks: run.tasks, events: run.events });
           
           const toolRes = await globalOrchestrator.executeTool(run.id, desktopTask.id, 'desktop.screenshot', { fullScreen: true });
           desktopTask.status = toolRes.status === 'success' ? 'completed' : 'failed';
           toolRan = 'desktop.screenshot';
           artifactDetails = toolRes.artifactPath || toolRes.error || '';
        } 
        else if (intent.includes('ouvre') || intent.includes('open') || intent.includes('lance')) {
           plannerTask.status = 'completed';
           const appName = intent.includes('safari') ? 'Safari' : intent.includes('chrome') ? 'Google Chrome' : 'Terminal';
           
           const desktopTask = await globalOrchestrator.addTask(run.id, { type: 'desktop', title: `Launch App: ${appName}`, status: 'running', workerName: 'DesktopWorker' });
           sendUpdate({ type: 'status_update', tasks: run.tasks, events: run.events });
           
           const toolRes = await globalOrchestrator.executeTool(run.id, desktopTask.id, 'desktop.open_app', { appName });
           desktopTask.status = toolRes.status === 'success' ? 'completed' : 'failed';
           toolRan = 'desktop.open_app';
           artifactDetails = toolRes.result || toolRes.error || '';
        } 
        else if (intent.includes('info') || intent.includes('system') || intent.includes('santé')) {
           plannerTask.status = 'completed';
           const desktopTask = await globalOrchestrator.addTask(run.id, { type: 'desktop', title: `System Status Fetch`, status: 'running', workerName: 'DesktopWorker' });
           sendUpdate({ type: 'status_update', tasks: run.tasks, events: run.events });
           
           const toolRes = await globalOrchestrator.executeTool(run.id, desktopTask.id, 'system.info', {});
           desktopTask.status = toolRes.status === 'success' ? 'completed' : 'failed';
           toolRan = 'system.info';
           artifactDetails = toolRes.result || toolRes.error || '';
        }
        else {
           // Default stub if no direct command
           plannerTask.status = 'completed';
           const browserTask = await globalOrchestrator.addTask(run.id, { type: 'browser', title: 'Web Scraping', status: 'running', workerName: 'BrowserWorker' });
           sendUpdate({ type: 'status_update', tasks: run.tasks, events: run.events });
           await globalOrchestrator.executeTool(run.id, browserTask.id, 'browser.open', { url: 'https://example.com' });
           browserTask.status = 'failed';
           toolRan = 'browser.open (not implemented)';
        }

        sendUpdate({ type: 'status_update', tasks: run.tasks, events: run.events });

        // 4. Summarization
        sendUpdate({ status: 'consolidating', log: 'AGGR: Compiling Computer Use results...' });
        
        const finalContent = `La mission ${run.id} a été traitée avec une exécution vérifiable.
- Action engagée : ${toolRan}
- Résultat / Preuve : ${artifactDetails ? artifactDetails : 'Aucune preuve / Erreur'}`;

        sendUpdate({ role: 'assistant', content: finalContent });
        
      } catch (err: any) {
        console.error('Runtime Error:', err);
        sendUpdate({ error: err.message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
