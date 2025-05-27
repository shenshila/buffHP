const API_URL = 'http://localhost:8080/api/appointments';

// Функция для получения заголовков с авторизацией
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Получить список всех докторов
export const fetchAllDoctors = async () => {
  const response = await fetch(`${API_URL}/doctors`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch doctors');
  }
  
  return await response.json();
};

// Получить свободные слоты для доктора на дату
export const fetchAvailableSlots = async (doctorId, date) => {
  const response = await fetch(
    `${API_URL}/available-slots?doctorId=${doctorId}&date=${date}`,
    {
      headers: getAuthHeaders()
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch available slots');
  }
  
  return await response.json();
};

// Создать запись
export const createAppointment = async (appointmentRequest) => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(appointmentRequest)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create appointment');
  }
  
  return await response.json();
};

// Отменить запись
export const cancelAppointment = async (appointmentId) => {
  const response = await fetch(`${API_URL}/${appointmentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to cancel appointment');
  }
  
  return true;
};