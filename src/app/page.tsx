import ScoutingReportForm from '@/components/ScoutingReportForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <ScoutingReportForm playerId={1} userId={1} />
    </div>
  );
}
