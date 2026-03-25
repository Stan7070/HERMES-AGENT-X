import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [
      { id: 'mem-1', key: 'user_preferred_theme', value: 'dark', type: 'string', lastUpdated: new Date().toISOString() },
      { id: 'mem-2', key: 'project_context', value: 'HERMES OS Integration', type: 'string', lastUpdated: new Date().toISOString() }
    ]
  });
}
