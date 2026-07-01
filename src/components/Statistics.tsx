import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Statistics } from '../types';
import { Download } from 'lucide-react';

interface StatisticsProps {
  stats: Statistics;
  onExport?: () => void;
}

export default function StatisticsComponent({ stats, onExport }: StatisticsProps) {
  return (
    <div className="bg-gray-800 bg-opacity-80 rounded-2xl p-6 mb-6 border border-gray-700 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">📊 Your Statistics</h3>
        {onExport && <button onClick={onExport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"><Download size={16} /> Export</button>}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: '🎯' },
          { label: 'Total Minutes', value: stats.totalMinutes, icon: '⏱️' },
          { label: 'Today\'s Sessions', value: stats.todaysSessions, icon: '📅' },
          { label: 'Longest Streak', value: stats.longestStreak, icon: '🔥' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-700 bg-opacity-50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">Weekly Progress</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
            <Bar dataKey="minutes" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}