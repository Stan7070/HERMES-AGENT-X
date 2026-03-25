import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 'skill-1', name: 'Shell Executor', category: 'terminal', isEnabled: true, version: '1.0.0', description: 'Run secure terminal commands.' },
      { id: 'skill-2', name: 'Memory Vault', category: 'database', isEnabled: true, version: '1.2.0', description: 'Access long-term persona knowledge.' },
      { id: 'skill-3', name: 'Web Navigator', category: 'browser', isEnabled: false, version: '0.8.0', description: 'Browse and extract site content.' }
    ]
  });
}
