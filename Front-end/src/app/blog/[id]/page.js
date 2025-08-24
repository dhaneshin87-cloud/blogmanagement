'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '../../../utils/auth';
import { API_ENDPOINTS } from '../../../config/api';

export default function BlogDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');  
      const response = await fetch(API_ENDPOINTS.POST_BY_ID(params.id), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
        
        // Check if current user is the author
        if (isAuthenticated()) {
          const accessToken = localStorage.getItem('accessToken');
          const userResponse = await fetch(API_ENDPOINTS.PROFILE, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setIsAuthor(userData.id === postData.author.id);
          }
        }
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError('Error fetching post');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(API_ENDPOINTS.POST_BY_ID(params.id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        router.push('/blog');
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline flex items-center"
            >
              ← Back to Blog
            </Link>
          </div>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">
                      {post.author.firstName ? post.author.firstName[0] : 'U'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      {post.author.firstName && post.author.lastName 
                        ? `${post.author.firstName} ${post.author.lastName}`
                        : post.author.email
                      }
                    </span>
                    <div className="text-gray-500">
                      Published {formatDate(post.createdAt)}
                      {post.updatedAt !== post.createdAt && (
                        <span> • Updated {formatDate(post.updatedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {isAuthor && (
                  <div className="flex space-x-2">
                    <Link
                      href={`/blog/edit/${post.id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors duration-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Written by {post.author.firstName && post.author.lastName 
                    ? `${post.author.firstName} ${post.author.lastName}`
                    : post.author.email
                  }
                </div>
                
                <Link
                  href="/blog"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  ← Back to Blog
                </Link>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
}
