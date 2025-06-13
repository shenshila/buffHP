import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Modal } from "react-bootstrap";
import { FaCalendarAlt, FaUserMd, FaClock, FaCommentMedical } from "react-icons/fa";
import {
  fetchAllDoctors,
  fetchAvailableSlots,
  createAppointment,
} from "../api/appointmentApi";

const BookAppointmentForm = ({ onSuccess }) => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState(""); // Причина визита
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchAllDoctors();
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctorId(data[0].doctorId);
        }
      } catch (err) {
        setError("Не удалось загрузить список докторов: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (selectedDoctorId && selectedDate) {
        try {
          setLoading(true);
          const data = await fetchAvailableSlots(
            selectedDoctorId,
            selectedDate
          );
          setAvailableSlots(data.availableTimes || []);
          setSelectedTime("");
        } catch (err) {
          setError("Не удалось загрузить свободные слоты: " + err.message);
          setAvailableSlots([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    loadAvailableSlots();
  }, [selectedDoctorId, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      setError("Пожалуйста, заполните все поля для записи.");
      return;
    }

    const appointmentDateTime = `${selectedDate}T${selectedTime}`;

    const requestDto = {
      doctorId: selectedDoctorId,
      appointmentDateTime: appointmentDateTime,
      reason: reason,
    };

    try {
      setLoading(true);
      const response = await createAppointment(requestDto);
      setSuccessMessage(
        `Вы успешно записаны на прием к доктору ${response.doctorFirstName} ${
          response.doctorLastName
        } на ${response.appointmentDateTime.replace("T", " ")}`
      );
      setSelectedTime("");
      setReason("");
      fetchAvailableSlots(selectedDoctorId, selectedDate);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Теперь err.message будет содержать сообщение из бэкенда
      setError("Ошибка при записи на прием: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-form">
      {error && (
        <Alert variant="danger" className="border-0 rounded-0 bg-red-50 text-danger">
          {error}
        </Alert>
      )}
      
      {successMessage && (
        <Alert variant="success" className="border-0 rounded-0 bg-green-50 text-success">
          {successMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="p-4">
        <Form.Group className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaUserMd className="text-danger me-2" />
            <Form.Label className="mb-0 text-secondary">Выберите врача</Form.Label>
          </div>
          <Form.Select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            disabled={loading}
            className="border-0 border-bottom rounded-0 py-3 px-0"
          >
            <option value="">Выберите доктора...</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.firstName} {doctor.lastName} ({doctor.specialization})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-4">
          <Col md={6}>
            <div className="d-flex align-items-center mb-2">
              <FaCalendarAlt className="text-danger me-2" />
              <Form.Label className="mb-0 text-secondary">Дата приема</Form.Label>
            </div>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              disabled={loading}
              className="border-0 border-bottom rounded-0 py-3 px-0"
            />
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center mb-2">
              <FaClock className="text-danger me-2" />
              <Form.Label className="mb-0 text-secondary">Время</Form.Label>
            </div>
            <Form.Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={loading || availableSlots.length === 0}
              className="border-0 border-bottom rounded-0 py-3 px-0"
            >
              <option value="">
                {availableSlots.length > 0
                  ? "Выберите время..."
                  : "Нет свободных слотов"}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* <Form.Group className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <FaCommentMedical className="text-danger me-2" />
            <Form.Label className="mb-0 text-secondary">Причина визита</Form.Label>
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            placeholder="Опишите причину вашего визита (не обязательно)"
            className="border-0 border-bottom rounded-0 px-0"
          />
        </Form.Group> */}

        <Button
          variant="danger"
          type="submit"
          className="w-100 py-3 rounded-1 fw-bold text-white"
          disabled={loading}
        >
          {loading ? "Записываем..." : "Подтвердить запись"}
        </Button>
      </Form>
    </div>
  );
};

export default BookAppointmentForm;
