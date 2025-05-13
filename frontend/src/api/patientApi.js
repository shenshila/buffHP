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

// Добавляем новый метод для фильтрации
export const filterPatients = async (gender, startDate, endDate) => {
  const params = new URLSearchParams();
  if (gender) params.append('gender', gender);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(`http://localhost:8080/api/patients/filter?${params.toString()}`);
  if (!response.ok) throw new Error('Filter failed');
  return await response.json();
};

// Новый метод для получения полного профиля пациента
export const getPatientProfile = async (id) => {
  const response = await fetch(`${API_URL}/${id}/profile`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch patient profile');
  }
  
  return await response.json();
};