const API_BASE_URL = 'http://localhost:8080/api/analytics';

// Функция для получения заголовков с авторизацией
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Запрос для Динамики заболеваемости
export const fetchDiseaseTrends = async (startDate, endDate) => {
  const response = await fetch(
    `${API_BASE_URL}/disease-trends?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: getAuthHeaders()
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch disease trends');
  }
  
  return await response.json();
};

// Запрос для Топ N диагнозов
export const fetchTopDiagnoses = async (startDate, endDate, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/top-diagnoses?startDate=${startDate}&endDate=${endDate}&limit=${limit}`,
    {
      headers: getAuthHeaders()
    }
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch top diagnoses');
  }
  
  return await response.json();
};

// // Запрос для Гендерного распределения
// export const fetchGenderDistribution = async () => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/gender-distribution`, {
//             headers: commonHeaders(),
//         });
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch gender distribution');
//         }
//         return response.json();
//     } catch (error) {
//         console.error('Error fetching gender distribution:', error);
//         throw error;
//     }
// };

// // Запрос для Возрастного распределения
// export const fetchAgeDistribution = async () => {
//     try {
//         const response = await fetch(`${API_BASE_URL}/age-distribution`, {
//             headers: commonHeaders(),
//         });
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch age distribution');
//         }
//         return response.json();
//     } catch (error) {
//         console.error('Error fetching age distribution:', error);
//         throw error;
//     }
// };

// // Запрос для Активности докторов (приемы)
// export const fetchDoctorAppointmentsActivity = async (startDate, endDate) => {
//     try {
//         const response = await fetch(
//             `${API_BASE_URL}/doctor-appointments-activity?startDate=${startDate}&endDate=${endDate}`,
//             {
//                 headers: commonHeaders(),
//             }
//         );
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch doctor appointments activity');
//         }
//         return response.json();
//     } catch (error) {
//         console.error('Error fetching doctor appointments activity:', error);
//         throw error;
//     }
// };

// // Запрос для Активности докторов (рецепты)
// export const fetchDoctorPrescriptionsActivity = async (startDate, endDate) => {
//     try {
//         const response = await fetch(
//             `${API_BASE_URL}/doctor-prescriptions-activity?startDate=${startDate}&endDate=${endDate}`,
//             {
//                 headers: commonHeaders(),
//             }
//         );
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Failed to fetch doctor prescriptions activity');
//         }
//         return response.json();
//     } catch (error) {
//         console.error('Error fetching doctor prescriptions activity:', error);
//         throw error;
//     }
// };