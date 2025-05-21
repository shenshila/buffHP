const API_URL = 'http://localhost:8080/api/user';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getCurrentUserProfile = async () => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch user profile');
  }

  return await response.json();
};

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update profile');
  }

  return await response.json();
};

export default {
  getCurrentUserProfile,
  updateUserProfile
};