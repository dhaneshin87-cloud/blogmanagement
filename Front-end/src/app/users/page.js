'use client';
// User List Page (Admin Only)
import { useEffect, useState } from 'react';
import { useAuth } from '../../components/../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserListPage() {
  const { isAuthenticated, isAdmin, user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      router.replace('/');
      return;
    }
    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  }, [isAuthenticated, isAdmin, token, router]);

  if (!isAuthenticated || !isAdmin()) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <Link href="/users/create" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Create User</Link>
      <ul className="divide-y divide-gray-200">
        {users.map(u => (
          <li key={u.id} className="py-2 flex justify-between items-center">
            <span>{u.email}</span>
            <Link href={`/users/edit/${u.id}`} className="text-blue-600 hover:underline">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
