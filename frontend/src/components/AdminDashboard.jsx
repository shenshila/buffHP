// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Form, Alert, Spinner, Badge, Modal } from 'react-bootstrap';
import { fetchAllUsers, updateRolesForUser, fetchAllRoles } from '../api/adminApi';
import { FaUserShield, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; // Иконки

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState(new Set());
    const [showModal, setShowModal] = useState(false); // Для модального окна подтверждения
    const [currentUserToEdit, setCurrentUserToEdit] = useState(null); // Пользователь, которого редактируем

    useEffect(() => {
        const loadData = async () => {
            try {
                const [usersData, rolesData] = await Promise.all([fetchAllUsers(), fetchAllRoles()]);
                setUsers(usersData);
                setRoles(rolesData);
            } catch (err) {
                setError("Не удалось загрузить данные: " + (err.message || "Неизвестная ошибка"));
                console.error("Error loading admin data:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleEditClick = (user) => {
        setEditingUserId(user.userId);
        setSelectedRoles(new Set(user.roles));
        setCurrentUserToEdit(user);
        setShowModal(true);
    };

    const handleRoleChange = (roleName) => {
        setSelectedRoles(prevRoles => {
            const newRoles = new Set(prevRoles);
            if (newRoles.has(roleName)) {
                newRoles.delete(roleName);
            } else {
                newRoles.add(roleName);
            }
            return newRoles;
        });
    };

    const handleSaveRoles = async () => {
        if (!currentUserToEdit) return;

        // Важное правило: если пользователь имеет связанную сущность Doctor, он должен иметь роль ROLE_DOCTOR.
        // Если пользователь имеет связанную сущность Patient, он должен иметь роль ROLE_PATIENT.
        // Это базовое правило, которое может быть расширено.
        if (currentUserToEdit.roles.includes("ROLE_PATIENT") && !selectedRoles.has("ROLE_PATIENT")) {
            alert("Нельзя удалить роль ROLE_PATIENT у пользователя, который является пациентом.");
            return;
        }
        if (currentUserToEdit.roles.includes("ROLE_DOCTOR") && !selectedRoles.has("ROLE_DOCTOR")) {
            alert("Нельзя удалить роль ROLE_DOCTOR у пользователя, который является доктором.");
            return;
        }


        setLoading(true);
        setError(null);
        try {
            const updatedUser = await updateRolesForUser(currentUserToEdit.userId, Array.from(selectedRoles));
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.userId === updatedUser.userId ? updatedUser : user
                )
            );
            handleCloseModal();
        } catch (err) {
            setError("Ошибка при сохранении ролей: " + (err.response?.data?.message || err.message || "Неизвестная ошибка"));
            console.error("Error saving roles:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUserId(null);
        setCurrentUserToEdit(null);
        setSelectedRoles(new Set());
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
                <p>Загрузка панели администратора...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4 d-flex align-items-center">
                <FaUserShield className="me-2" /> Панель Администратора
            </h2>

            <Card className="shadow-sm">
                <Card.Header className="bg-light">
                    <h5>Управление Пользователями и Ролями</h5>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover responsive className="mb-0">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>ФИО</th>
                                <th>Роли</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId}>
                                    <td>{user.email}</td>
                                    <td>{user.fullName}</td>
                                    <td>
                                        {user.roles.map(role => (
                                            <Badge key={role} bg={
                                                role === "ROLE_ADMIN" ? "danger" :
                                                role === "ROLE_DOCTOR" ? "primary" :
                                                "secondary"
                                            } className="me-1">
                                                {role.replace('ROLE_', '')}
                                            </Badge>
                                        ))}
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <FaEdit /> Изменить роли
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal for editing roles */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить роли для {currentUserToEdit?.fullName || currentUserToEdit?.email}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {roles.map(roleName => (
                            <Form.Check
                                type="checkbox"
                                id={`role-${roleName}`}
                                label={roleName.replace('ROLE_', '')}
                                key={roleName}
                                checked={selectedRoles.has(roleName)}
                                onChange={() => handleRoleChange(roleName)}
                                disabled={
                                    // Пример: Запрет на снятие роли PATIENT, если пациент существует
                                    (currentUserToEdit?.roles.includes("ROLE_PATIENT") && roleName === "ROLE_PATIENT") ||
                                    (currentUserToEdit?.roles.includes("ROLE_DOCTOR") && roleName === "ROLE_DOCTOR")
                                }
                            />
                        ))}
                    </Form>
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSaveRoles} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : <FaCheck />} Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminDashboard;