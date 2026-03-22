'use client';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings size={24} /> Settings</h1>
      
      <div className="bg-gray-800 p-8 rounded-xl text-center border border-dashed border-gray-600">
        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Features like password management and site-wide theme configuration will be added here.
        </p>
      </div>
    </div>
  );
}