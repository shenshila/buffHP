import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { findPatientById } from '../api/patientApi';

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await findPatientById(id);
        setPatient(data);
      } catch (err) {
        setError('Не удалось загрузить данные пациента');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <Button 
        variant="secondary" 
        onClick={() => navigate(-1)}
        className="mb-3"
      >
        ← Назад
      </Button>

      <Card>
        <Card.Header className="bg-primary text-white">
          <h3>Профиль пациента</h3>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>ФИО:</strong> {patient.lastName} {patient.firstName} {patient.middleName}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Дата рождения:</strong> {patient.birthDate}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Пол:</strong> {patient.gender === 'MALE' ? 'Мужской' : 'Женский'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Телефон:</strong> {patient.phone || 'не указан'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Страховой номер:</strong> {patient.insuranceNumber}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
}