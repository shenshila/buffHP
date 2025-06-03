const API_URL = 'http://localhost:8080/api/medical-records';

// Функция для получения заголовков с авторизацией
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Получить все медзаписи пациента
export const fetchMedicalRecordsByPatientId = async (patientId) => {
  const response = await fetch(`${API_URL}/patient/${patientId}`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch medical records');
  }
  
  return await response.json();
};

// Создать медзапись
export const createMedicalRecord = async (medicalRecordData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(medicalRecordData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create medical record');
  }
  
  return await response.json();
};

// Обновить медзапись
export const updateMedicalRecord = async (recordId, medicalRecordData) => {
  console.log('Updating record with ID:', recordId); // Добавьте это
  console.log('Data:', medicalRecordData); // И это
  
  const response = await fetch(`${API_URL}/${recordId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(medicalRecordData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update medical record');
  }
  
  return await response.json();
};

// Удалить медзапись
export const deleteMedicalRecord = async (recordId) => {
  const response = await fetch(`${API_URL}/${recordId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete medical record');
  }
  
  return true;
};