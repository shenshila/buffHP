const API_URL = 'http://localhost:8080/api/prescriptions';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const createPrescription = async (data) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create prescription');
  }
  
  return await response.json();
};

export const verifyPrescription = async (code) => {
  const response = await fetch(`${API_URL}/verify/${code}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to verify prescription');
  }
  
  return await response.json();
};