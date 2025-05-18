const API_URL = 'http://localhost:8080/api/patients';

// Функция для получения заголовков с авторизацией
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const searchPatients = async (keyword) => {
  const response = await fetch(`${API_URL}/search?keyword=${keyword}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Search failed');
  }
  
  return await response.json();
};

export const findPatientByInsurance = async (number) => {
  const response = await fetch(`${API_URL}/insurance/${number}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Patient not found');
  }
  
  return await response.json();
};

export const findPatientById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Patient not found');
  }
  
  return await response.json();
};

export const filterPatients = async (gender, startDate, endDate) => {
  const params = new URLSearchParams();
  if (gender) params.append('gender', gender);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const response = await fetch(`${API_URL}/filter?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Filter failed');
  }
  
  return await response.json();
};

// Новый метод для получения полного профиля пациента
export const getPatientProfile = async (id) => {
  const response = await fetch(`${API_URL}/${id}/profile`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch patient profile');
  }
  
  return await response.json();
};

// export const createPrescription = async (patientId, prescriptionData) => {
//   const response = await fetch(`${API_URL}/prescriptions`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('token')}`
//     },
//     body: JSON.stringify({
//       patientId,
//       ...prescriptionData
//     })
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to create prescription');
//   }

//   return await response.json();
// };

// export const verifyPrescription = async (code) => {
//   const response = await fetch(`${API_URL}/prescriptions/verify/${code}`);

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || 'Failed to verify prescription');
//   }

//   return await response.json();
// };