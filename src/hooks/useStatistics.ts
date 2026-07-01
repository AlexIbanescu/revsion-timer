import { useState, useEffect, useCallback } from 'react';
import { Session, Statistics } from '../types';

export const useStatistics = (sessions: Session[]) => {
  const [stats, setStats] = useState<Statistics>({
    totalSessions: 0,
    totalMinutes: 0,
    todaysSessions: 0,
    todaysMinutes: 0,
    weeklyData: [],
    streak: 0,
    longestStreak: 0,
  });

  const calculateStats = useCallback(() => {
    const workSessions = sessions.filter((s) => s.phase === 'work' && s.completed);
    const totalMinutes = workSessions.reduce((sum, s) => sum + s.duration, 0);
    
    const today = new Date().toDateString();
    const todaysSessions = sessions.filter((s) => new Date(s.timestamp).toDateString() === today && s.phase === 'work');
    const todaysMinutes = todaysSessions.reduce((sum, s) => sum + s.duration, 0);

    const weekData: { [key: string]: number } = {};
    const today_date = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today_date);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      weekData[dateStr] = 0;
    }

    sessions.forEach((session) => {
      if (session.phase === 'work' && session.completed) {
        const date = new Date(session.timestamp);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (dateStr in weekData) {
          weekData[dateStr] += session.duration;
        }
      }
    });

    const weeklyData = Object.entries(weekData).map(([day, minutes]) => ({ day, minutes }));

    setStats({
      totalSessions: workSessions.length,
      totalMinutes,
      todaysSessions: todaysSessions.length,
      todaysMinutes,
      weeklyData,
      streak: 0,
      longestStreak: 0,
    });
  }, [sessions]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const exportData = useCallback(() => {
    const csv = [
      ['Date', 'Phase', 'Duration (min)', 'Status'],
      ...sessions.map((s) => [
        new Date(s.timestamp).toISOString(),
        s.phase,
        s.duration,
        s.completed ? 'Completed' : 'Abandoned',
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revision-timer-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [sessions]);

  return { stats, exportData };
};