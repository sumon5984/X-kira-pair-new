
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function RealTimeStats() {
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API || "";
        const apiProUrl = process.env.NEXT_PUBLIC_API_PRO || "";
        
        let total = 0;

        // Fetch from regular API
        if (apiUrl) {
          try {
            const response = await fetch(`${apiUrl}/sessions`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              mode: 'cors',
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
              mode: 'cors',
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

        setTotalSessions(total);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {loading ? (
          <span className="animate-pulse">--</span>
        ) : (
          <span>{totalSessions}+</span>
        )}
      </div>
      <div className="text-muted-foreground">Active Deployments</div>
    </motion.div>
  );
}
