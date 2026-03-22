import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find({}).sort({ order: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    console.log("Error fetching skills:", error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    console.log("Creating skill:", data);
    const skill = await Skill.create(data);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}