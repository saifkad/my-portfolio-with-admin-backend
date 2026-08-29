import { ImageResponse } from 'next/og';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Developer portfolio';

export default async function OgImage() {
  let name = 'Developer';
  let title = 'Full Stack Developer';
  let location = '';
  try {
    await connectDB();
    const user = await User.findOne({}).lean();
    if (user) {
      name = user.name || name;
      title = user.title || title;
      location = user.location || '';
    }
  } catch {
    // build must never fail because the DB is unreachable — fallback values used
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', fontSize: 36, opacity: 0.6, marginBottom: 24 }}>{'<SaifDev />'}</div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700 }}>{name}</div>
        <div style={{ display: 'flex', fontSize: 44, opacity: 0.85, marginTop: 16 }}>{title}</div>
        {location && (
          <div style={{ display: 'flex', fontSize: 28, opacity: 0.6, marginTop: 24 }}>{location}</div>
        )}
      </div>
    ),
    size
  );
}