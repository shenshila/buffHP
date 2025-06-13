// src/components/PrescriptionForm.jsx (ПРИМЕР)
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
// import { searchPatients } from '../api/patientApi'; // Если нужно искать пациента
// import { createPrescription } from '../api/prescriptionApi'; // API для выписки рецепта

const PrescriptionForm = ({ doctorId, patientId: initialPatientId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: initialPatientId || '',
    medication: '',
    dosage: '',
    instructions: '',
    expiryDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [patients, setPatients] = useState([]); // Для поиска пациентов

  useEffect(() => {
    if (initialPatientId) {
      setFormData(prev => ({ ...prev, patientId: initialPatientId }));
    }
    // if (!initialPatientId) {
    //   // Загрузить список пациентов или включить поиск
    // }
  }, [initialPatientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.patientId || !formData.medication || !formData.dosage || !formData.expiryDate) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    try {
      setLoading(true);
      // Здесь вызывай API для создания рецепта
      // await createPrescription({ ...formData, doctorId: doctorId });
      console.log("Выписываем рецепт:", { ...formData, doctorId: doctorId });
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API запроса
      onSuccess();
    } catch (err) {
      setError('Ошибка при выписке рецепта: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Пациент ID</Form.Label>
        <Form.Control
          type="text"
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          placeholder="UUID пациента"
          required
          disabled={!!initialPatientId} // Отключаем поле, если пациент уже выбран
        />
        {/* Добавь здесь функционал поиска пациента, если initialPatientId не всегда известен */}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Лекарство</Form.Label>
        <Form.Control
          type="text"
          name="medication"
          value={formData.medication}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Дозировка</Form.Label>
        <Form.Control
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Инструкции</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Дата истечения</Form.Label>
        <Form.Control
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="me-2" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Выписать'}
      </Button>
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        Отмена
      </Button>
    </Form>
  );
};

export default PrescriptionForm;