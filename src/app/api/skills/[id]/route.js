import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Skill from '@/lib/models/Skill';

// DELETE handler to remove a skill
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // Get the ID from the URL (e.g., /api/skills/12345 -> params.id is "12345")
    const { id } = params;

    // Find and delete the skill
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if (!deletedSkill) {
      return NextResponse.json(
        { error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}