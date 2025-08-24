// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  REFRESH: `${API_BASE_URL}/api/auth/refresh`,
  
  // Blog endpoints
  POSTS: `${API_BASE_URL}/api/blog/post/list`,
  MY_POSTS: (id) => `${API_BASE_URL}/api/blog/post/list/${id}`,
  POST_BY_ID: (id) => `${API_BASE_URL}/api/blog/post/${id}`,
  CREATE_POST:  `${API_BASE_URL}/api/blog/post/create`,
  UPDATE_POST: (id) => `${API_BASE_URL}/api/blog/post/update/${id}`,
  DELETE_POST: (id) => `${API_BASE_URL}/api/blog/post/delete/${id}`,
  
  // User endpoints
  PROFILE: `${API_BASE_URL}/api/user/profile`,
  PROFILE_UPDATE: (id) => `${API_BASE_URL}/api/user/profile/update/${id}`,
  CHANGE_PASSWORD: `${API_BASE_URL}/api/user/change-password`,
};
