import { redirect } from 'next/navigation';

export default function AdminRoot() {
  // If the user reaches here, they are logged in (Middleware checked this).
  // So we send them to the dashboard.
  redirect('/admin/dashboard');
}