import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerId, userId, power, contact, speed, fielding, arm, overall, executiveSummary } = body;

    // Validate inputs
    if (!playerId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify player and user exist (basic check)
    const player = await prisma.player.findUnique({ where: { id: Number(playerId) } });
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    const report = await prisma.scoutingReport.create({
      data: {
        power: Number(power),
        contact: Number(contact),
        speed: Number(speed),
        fielding: Number(fielding),
        arm: Number(arm),
        overall: Number(overall),
        executiveSummary,
        playerId: Number(playerId),
        userId: Number(userId),
      },
    });

    // Revalidate the player profile page to show the new report
    revalidatePath(`/players/${playerId}`);

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Failed to create scouting report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
