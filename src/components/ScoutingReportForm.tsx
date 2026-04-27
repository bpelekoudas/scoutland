'use client';

import { useState } from 'react';

const SCALE_OPTIONS = Array.from({ length: 13 }, (_, i) => 20 + i * 5); // 20, 25, ... 80

export default function ScoutingReportForm({
  playerId,
  userId,
}: {
  playerId: number;
  userId: number;
}) {
  const [formData, setFormData] = useState({
    power: 50,
    contact: 50,
    speed: 50,
    fielding: 50,
    arm: 50,
    overall: 50,
    executiveSummary: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'executiveSummary' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/scouting-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, playerId, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      // Reset form on success or navigate away
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const metrics = ['power', 'contact', 'speed', 'fielding', 'arm', 'overall'] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Scouting Report</h2>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric} className="flex flex-col">
            <label htmlFor={metric} className="mb-1 capitalize font-medium text-gray-700">
              {metric} (20-80)
            </label>
            <select
              id={metric}
              name={metric}
              value={formData[metric]}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {SCALE_OPTIONS.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <label htmlFor="executiveSummary" className="mb-1 font-medium text-gray-700">
          Executive Summary
        </label>
        <textarea
          id="executiveSummary"
          name="executiveSummary"
          value={formData.executiveSummary}
          onChange={handleChange}
          rows={4}
          className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Provide a qualitative assessment of the player..."
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Report'}
      </button>

      {status === 'success' && <p className="text-green-600 mt-2">Report submitted successfully!</p>}
      {status === 'error' && <p className="text-red-600 mt-2">Failed to submit report. Please try again.</p>}
    </form>
  );
}
