// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

// ProtectedRoute принимает authState и список разрешенных ролей
const ProtectedRoute = ({ children, authState, allowedRoles }) => {
    const location = useLocation();

    if (authState.isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
                <p className="ms-2">Загрузка данных пользователя...</p>
            </div>
        );
    }

    if (!authState.isAuthenticated) {
        // Если не аутентифицирован, перенаправляем на страницу входа
        return <Navigate to="/auth?tab=login" state={{ from: location }} replace />;
    }

    // Проверяем, есть ли у пользователя одна из разрешенных ролей
    const hasRequiredRole = allowedRoles.some(role => authState.userRole === role.replace('ROLE_', '')); // Сравниваем "DOCTOR" с "ROLE_DOCTOR"

    if (!hasRequiredRole) {
        // Если нет нужной роли, можно перенаправить на страницу "нет доступа"
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Alert variant="warning">У вас нет разрешения на доступ к этой странице.</Alert>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;