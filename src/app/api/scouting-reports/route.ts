import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Ideally, validate data with Zod before insertion
    const newReport = await prisma.scoutingReport.create({
      data: {
        power: Number(data.power),
        contact: Number(data.contact),
        speed: Number(data.speed),
        fielding: Number(data.fielding),
        arm: Number(data.arm),
        overall: Number(data.overall),
        executiveSummary: data.executiveSummary,
        userId: Number(data.userId), // Ensure these are provided by the client
        playerId: Number(data.playerId), // Ensure these are provided by the client
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error creating scouting report:', error);
    return NextResponse.json(
      { error: 'Failed to create scouting report' },
      { status: 500 }
    );
  }
}
