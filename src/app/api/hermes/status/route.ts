import { NextResponse } from 'next/server';

export async function GET() {
  const model = process.env.LLM_MODEL || 'llama3.1:8b';
  const provider = 'Ollama';
  const backend = process.env.NEXT_PUBLIC_HERMES_BACKEND_TYPE || 'INTERNAL_BRIDGE';

  return NextResponse.json({
    data: {
      isHealthy: true,
      version: '1.2.0-hermes-x',
      uptime: '4d 12h 30m',
      activeRunsCount: 0,
      brain: {
        model: model,
        provider: provider,
        backend: backend === 'INTERNAL_BRIDGE' ? 'Internal Bridge' : 'Official Engine'
      },
      resources: {
        cpu: 18,
        memory: 42,
        storage: 24,
      },
    },
  });
}
