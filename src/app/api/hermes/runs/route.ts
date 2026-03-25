import { NextResponse } from 'next/server';
import { globalOrchestrator } from '@/lib/runtime/orchestrator';

export const runtime = 'nodejs';

export async function GET() {
  const runs = Array.from((globalOrchestrator as any).runs?.values() || []);
  
  // Sort by date descending
  runs.sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return NextResponse.json({
    data: runs
  });
}
