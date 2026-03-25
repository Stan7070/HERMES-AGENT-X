import { globalOrchestrator } from './src/lib/runtime/orchestrator';

async function main() {
  console.log('🚀 INITIALIZING HERMES SUPER-AGENT RUNTIME...');
  
  // 1. Mission Creation
  const run = await globalOrchestrator.createRun('Scanner l\'architecture de hermes-agent', 'hermes-x-ops');
  console.log(`\n✅ Mission Created: [${run.id}] -> ${run.mission}`);
  
  // 2. Planning Phase
  console.log('\n[PLANNING WORKER]');
  const plannerTask = await globalOrchestrator.addTask(run.id, {
    type: 'planning',
    title: 'Mission Decomposition',
    status: 'running',
    workerName: 'PlannerWorker'
  });
  console.log('-> ' + plannerTask.title + ' (Status: ' + plannerTask.status + ')');
  
  await new Promise(r => setTimeout(r, 800));
  plannerTask.status = 'completed';
  console.log('-> ' + plannerTask.title + ' (Status: ' + plannerTask.status + ')');
  
  // 3. Browser Phase
  console.log('\n[BROWSER WORKER]');
  const browserTask = await globalOrchestrator.addTask(run.id, {
    type: 'browser',
    title: 'Navigate to hermes-agent GitHub',
    status: 'running',
    workerName: 'BrowserWorker'
  });
  
  try {
    const resultUrl = await globalOrchestrator.executeTool(run.id, browserTask.id, 'browser.open', { url: 'https://github.com/NousResearch/hermes-agent' });
    console.log(`-> TOOL SUCCESS [browser.open]: ${resultUrl}`);
    
    // Test second tool mock
    const resultCheck = await globalOrchestrator.executeTool(run.id, browserTask.id, 'browser.screenshot', { scale: 1.0 });
    console.log(`-> TOOL SUCCESS [browser.screenshot]: ${resultCheck}`);
  } catch (e: any) {
    console.log(`-> TOOL ERROR: ${e.message}`);
  }
  
  browserTask.status = 'completed';

  // 4. Dump Event Stream
  console.log('\n======================================================');
  console.log('🛡️ HIGH-FIDELITY EVENT LOGS (Sent to UI)');
  console.log('======================================================');
  run.events.forEach(evt => {
    console.log(`[${evt.timestamp.split('T')[1].replace('Z','')}][${evt.level.toUpperCase()}] ${evt.source}: ${evt.message}`);
  });
  console.log('======================================================');
  
  // Clean up playwright if open
  import('./src/lib/runtime/tools/browser').then(m => m.browserTool.close());
}

main().catch(console.error);
