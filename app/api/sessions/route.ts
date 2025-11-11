
import { NextResponse } from 'next/server';

interface Session {
  connected: boolean;
  user: string;
  jid: string;
  healthy: boolean;
}

interface SessionsResponse {
  total: number;
  healthy: number;
  sessions: Record<string, Session>;
}

export async function GET() {
  let total = 0;
  
  const apiUrl = process.env.NEXT_PUBLIC_API || "";
  const apiProUrl = process.env.NEXT_PUBLIC_API_PRO || "";

  // Fetch from regular API
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/sessions`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });
      if (response.ok) {
        const data: SessionsResponse = await response.json();
        total += data.total || 0;
      }
    } catch (error) {
      console.warn('API endpoint not reachable:', apiUrl);
    }
  }

  // Fetch from PRO API
  if (apiProUrl) {
    try {
      const response = await fetch(`${apiProUrl}/sessions`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });
      if (response.ok) {
        const data: SessionsResponse = await response.json();
        total += data.total || 0;
      }
    } catch (error) {
      console.warn('API PRO endpoint not reachable:', apiProUrl);
    }
  }

  return NextResponse.json({ total });
}
