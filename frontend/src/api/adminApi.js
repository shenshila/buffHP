// src/api/adminApi.js
const API_BASE_URL = 'http://localhost:8080/api/admin'; // Базовый URL для админских API

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch all users');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

export const updateRolesForUser = async (userId, newRoles) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/roles`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ userId, newRoles })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update user roles');
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating user roles:", error);
        throw error;
    }
};

export const fetchAllRoles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch all roles');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching all roles:", error);
        throw error;
    }
};