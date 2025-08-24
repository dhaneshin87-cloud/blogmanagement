// Create User Page (Admin Only)
import { useState } from 'react';
import { useAuth } from '../../../components/../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreateUserPage() {
  const { isAuthenticated, isAdmin, token } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  if (!isAuthenticated || !isAdmin()) {
    router.replace('/');
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch('/api/user/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, role }),
    });
    router.push('/users');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full border p-2" required />
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full border p-2">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}
