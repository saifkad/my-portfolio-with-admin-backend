import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/lib/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// --- CRITICAL PART ---
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Log to terminal to see if data arrives
    console.log("Creating project:", data); 

    const project = await Project.create(data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

// Add DELETE handler later if needed, or implement via /[id]/route.js