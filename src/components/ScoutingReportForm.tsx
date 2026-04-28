"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ScoutingReportFormProps {
  playerId: number;
  userId?: number;
}

export default function ScoutingReportForm({ playerId, userId = 1 }: ScoutingReportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    power: 50,
    contact: 50,
    speed: 50,
    fielding: 50,
    arm: 50,
    overall: 50,
    executiveSummary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'executiveSummary' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Check if we are running in a static environment (like GitHub Pages) where API routes won't work
    if (window.location.hostname.includes('github.io')) {
      setError('Form submission is disabled on GitHub Pages because it is a static host. To test submissions, run the project locally or deploy to Vercel/Railway.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Reverted the fetch call back to the standard path since we removed the basePath config
      const response = await fetch('/api/scouting-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          playerId,
          userId, // Hardcoded for demo purposes as we don't have auth
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setFormData({
        power: 50,
        contact: 50,
        speed: 50,
        fielding: 50,
        arm: 50,
        overall: 50,
        executiveSummary: '',
      });

      router.refresh(); // Refresh the page to show the new report
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics = ['power', 'contact', 'speed', 'fielding', 'arm', 'overall'] as const;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Add Scouting Report</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <div key={metric} className="space-y-2">
              <label htmlFor={metric} className="block text-sm font-medium text-gray-700 capitalize">
                {metric} (20-80)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id={metric}
                  name={metric}
                  min="20"
                  max="80"
                  step="5"
                  value={formData[metric]}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 text-center font-mono font-semibold text-gray-700">
                  {formData[metric]}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="executiveSummary" className="block text-sm font-medium text-gray-700">
            Executive Summary
          </label>
          <textarea
            id="executiveSummary"
            name="executiveSummary"
            rows={4}
            required
            value={formData.executiveSummary}
            onChange={handleChange}
            placeholder="Detailed notes on the player's performance..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}
