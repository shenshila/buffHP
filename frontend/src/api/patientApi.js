const API_URL = 'http://localhost:8080/api/patients';

export const searchPatients = async (keyword) => {
  const response = await fetch(`${API_URL}/search?keyword=${keyword}`);
  if (!response.ok) throw new Error('Search failed');
  return await response.json();
};

export const findPatientByInsurance = async (number) => {
  const response = await fetch(`${API_URL}/insurance/${number}`);
  if (!response.ok) throw new Error('Patient not found');
  return await response.json();
};

export const findPatientById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/patients/${id}`);
    if (!response.ok) throw new Error('Patient not found');
    return await response.json();
  };