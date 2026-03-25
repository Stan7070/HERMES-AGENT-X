import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 'log-1', level: 'info', source: 'SYSTEM', message: 'Hermes Bridge initialized successfully.', timestamp: new Date().toISOString() },
      { id: 'log-2', level: 'info', source: 'NETWORK', message: 'Connected to local next.js agent engine.', timestamp: new Date(Date.now() - 5000).toISOString() },
      { id: 'log-3', level: 'warn', source: 'CORE', message: 'Official backend not found. Using internal bridge.', timestamp: new Date(Date.now() - 10000).toISOString() }
    ]
  });
}
