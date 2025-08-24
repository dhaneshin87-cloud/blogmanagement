'use client';

import { useState, useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_ENDPOINTS } from '../../../../config/api';
import { useAuth } from '../../../../contexts/AuthContext';
import { NotificationContext } from '../../../../app/layout';

export default function EditBlogPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);
  const { showMessage } = useContext(NotificationContext);

  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading, getCurrentUserId } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (params.id) {
      fetchPost();
    }
  }, [params.id, router, isAuthenticated, isLoading]);

  const fetchPost = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(API_ENDPOINTS.POST_BY_ID(params.id), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const postData = await response.json();
        const userResponse = await fetch(API_ENDPOINTS.PROFILE, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData._id !== postData.authorId._id) {
            router.push('/blog');
            return;
          }
        }
        setPost(postData);
        setTitle(postData.title);
        setContent(postData.content);
      } else {
        setError('Post not found');
        showMessage('Post not found', 'error');
      }
    } catch (error) {
      setError('Error fetching post');
      showMessage('Error fetching post', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      showMessage('Please fill in all fields', 'error');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(API_ENDPOINTS.UPDATE_POST(params.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });
      if (response.ok) {
        showMessage('Post updated successfully', 'success');
        router.push(`/blog`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update post');
        showMessage(errorData.message || 'Failed to update post', 'error');
      }
    } catch (error) {
      setError('Error updating post. Please try again.');
      showMessage('Error updating post. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Unable to load post for editing.'}</p>
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href={`/blog/${post.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline flex items-center"
          >
            ← Back to Post
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="mt-2 text-gray-600">Make changes to your post</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your post title"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Write your blog post content here..."
                required
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href={`/blog/${post.id}`}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
