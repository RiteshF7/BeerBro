import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Redirect to dashboard as default
  redirect('/admin/dashboard');
}
