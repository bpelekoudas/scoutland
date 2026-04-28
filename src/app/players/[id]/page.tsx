import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfile({ params }: Props) {
  const resolvedParams = await params;
  const playerId = parseInt(resolvedParams.id, 10);

  if (isNaN(playerId)) {
    notFound();
  }

  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: {
      scoutingReports: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!player) {
    notFound();
  }

  const reports = player.scoutingReports;
  const numReports = reports.length;

  let communityGrades = {
    power: 0,
    contact: 0,
    speed: 0,
    fielding: 0,
    arm: 0,
    overall: 0,
  };

  if (numReports > 0) {
    communityGrades = reports.reduce(
      (acc, report) => ({
        power: acc.power + report.power,
        contact: acc.contact + report.contact,
        speed: acc.speed + report.speed,
        fielding: acc.fielding + report.fielding,
        arm: acc.arm + report.arm,
        overall: acc.overall + report.overall,
      }),
      { power: 0, contact: 0, speed: 0, fielding: 0, arm: 0, overall: 0 }
    );

    communityGrades = {
      power: Math.round(communityGrades.power / numReports),
      contact: Math.round(communityGrades.contact / numReports),
      speed: Math.round(communityGrades.speed / numReports),
      fielding: Math.round(communityGrades.fielding / numReports),
      arm: Math.round(communityGrades.arm / numReports),
      overall: Math.round(communityGrades.overall / numReports),
    };
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Player Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
        <div className="mt-2 text-lg text-gray-600 flex gap-4">
          <span>{player.position}</span>
          <span>&bull;</span>
          <span>{player.team}</span>
        </div>
      </div>

      {/* Community Grades */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Community Grades</h2>
        {numReports === 0 ? (
          <p className="text-gray-500 italic">No scouting reports available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {Object.entries(communityGrades).map(([metric, grade]) => (
              <div key={metric} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {metric}
                </span>
                <span className="mt-2 text-3xl font-bold text-blue-600">{grade}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Qualitative Reports */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Scouting Reports</h2>
        {numReports === 0 ? (
          <p className="text-gray-500 italic">No executive summaries to display.</p>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-gray-900">
                    Scout: {report.user.name} (Rep: {report.user.reputationScore})
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{report.executiveSummary}</p>
                <div className="mt-3 flex gap-3 text-xs text-gray-500 font-mono">
                  <span>POW: {report.power}</span>
                  <span>CON: {report.contact}</span>
                  <span>SPD: {report.speed}</span>
                  <span>FLD: {report.fielding}</span>
                  <span>ARM: {report.arm}</span>
                  <span>OVR: {report.overall}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}