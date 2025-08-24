'use client';
// Edit User Page (Admin Only)
import { useEffect, useState } from 'react';
import { useAuth } from '../../../../components/../contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';

export default function EditUserPage() {
  const { isAuthenticated, isAdmin, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.replace('/');
      return;
    }
    fetch(`/api/user/profile?id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setEmail(data.email || '');
        setRole(data.role || 'user');
      });
  }, [isAuthenticated, isAdmin, token, userId, router]);

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch(`/api/user/profile?id=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, role }),
    });
    router.push('/users');
  };

  if (!isAuthenticated || !isAdmin()) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2" required />
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
