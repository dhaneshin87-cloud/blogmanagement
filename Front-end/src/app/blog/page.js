'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

export default function BlogListing() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, isAdmin, canManagePost, getCurrentUserId } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      let endpoint = '';
  
      // If user is authenticated, fetch posts based on their role
      if (isAuthenticated) {
        if (isAdmin()) {
          // Admin can see all posts (no userId needed)
          endpoint = API_ENDPOINTS.POSTS;
        } else {
          // Regular users see only their own posts (userId required)
          const userId = getCurrentUserId();
          endpoint = API_ENDPOINTS.MY_POSTS(userId);
        }
      } else {
        // Non-authenticated users see no posts (redirect to login)
        setPosts([]);
        setLoading(false);
        return;
      }
  
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
  
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else if (response.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError('Failed to fetch posts');
      }
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_POST(postId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        // Remove the deleted post from the list
        setPosts(posts.filter(post => post._id !== postId));
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchPosts}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {isAuthenticated ? 'My Posts' : 'Blog Posts'}
              </h1>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                {isAuthenticated 
                  ? isAdmin() 
                    ? 'Manage all posts and users on the platform.'
                    : 'Your personal blog posts and stories.'
                  : 'Please log in to view your posts.'
                }
              </p>
            </div>
            
            {isAuthenticated && (
              <div className="ml-8">
                <Link
                  href="/blog/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Create New Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {isAuthenticated ? 'No posts yet' : 'Authentication required'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isAuthenticated 
                ? 'Start writing your first blog post!'
                : 'Please log in to view and create posts.'
              }
            </p>
            {isAuthenticated ? (
              <div className="mt-6">
                <Link
                  href="/blog/create"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatDate(post.createdAt)}</span>
                      {post.updatedAt !== post.createdAt && (
                        <span className="ml-2">• Updated {formatDate(post.updatedAt)}</span>
                      )}
                    </div>
                    
                    {/* Show post status for admins */}
                    {isAdmin() && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/blog/${post.id}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content
                    }
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {post.author?.firstName ? post.author.firstName[0] : 'U'}
                        </span>
                      </div>
                      <span className="ml-2 text-sm text-gray-700">
                        {post.author?.firstName && post.author?.lastName 
                          ? `${post.author.firstName} ${post.author.lastName}`
                          : post.author?.email || 'Unknown Author'
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                      >
                        Read more →
                      </Link>
                      
                      
                     
                      
                          <Link
                            href={`/blog/edit/${post._id}`}
                            className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline"
                          >
                            Delete
                          </button>
                        
                      
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
