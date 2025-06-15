import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert, ListGroup, Badge } from 'react-bootstrap';
import { verifyPrescription } from '../api/prescriptionApi';
import { FaCheckCircle, FaTimesCircle, FaPrescription } from 'react-icons/fa';

const PrescriptionVerifyPage = () => {
  const { code } = useParams(); // Получаем код из URL (например, /verify/YOUR_CODE)
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await verifyPrescription(code);
        setVerificationResult(result);
      } catch (err) {
        console.error('Ошибка при верификации:', err);
        setError(err.message || 'Не удалось проверить рецепт. Возможно, код недействителен или произошла ошибка сервера.');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchVerification();
    } else {
      setError('Код верификации отсутствует в URL.');
      setLoading(false);
    }
  }, [code]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <FaTimesCircle className="me-2" /> Ошибка: {error}
          <p className="mt-2">Пожалуйста, убедитесь, что вы отсканировали корректный QR-код или перешли по правильной ссылке.</p>
        </Alert>
      </Container>
    );
  }

  if (!verificationResult) {
    return (
      <Container className="mt-5">
        <Alert variant="info">
          <FaPrescription className="me-2" /> Ожидание кода верификации...
        </Alert>
      </Container>
    );
  }

  // Если верификация прошла успешно
  const { prescription, valid, statusMessage } = verificationResult;

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Header as="h3" className={`py-3 ${valid ? 'bg-success text-white' : 'bg-danger text-white'}`}>
          {valid ? <FaCheckCircle className="me-2" /> : <FaTimesCircle className="me-2" />}
          Результат проверки рецепта
        </Card.Header>
        <Card.Body>
          <p className="lead fw-bold text-center mb-4">
            {statusMessage}
          </p>

          {prescription ? (
            <>
              <h4 className="mb-3 text-center">{prescription.medication}</h4>
              <div className="d-flex justify-content-center mb-4">
                <Badge
                  bg={
                    new Date(prescription.expiryDate) < new Date()
                      ? "danger"
                      : "success"
                  }
                  className="p-2 fs-6"
                >
                  {new Date(prescription.expiryDate) < new Date()
                    ? "Просрочен"
                    : "Активен"}
                </Badge>
              </div>

              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">ID Рецепта:</span>
                  <span className="fw-bold">{prescription.id}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Пациент:</span>
                  <span className="fw-bold">{prescription.patientName.firstName} {prescription.patientName.lastName}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Дозировка:</span>
                  <span className="fw-bold">{prescription.dosage}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Дата выписки:</span>
                  <span className="fw-bold">{formatDate(prescription.issueDate)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Действует до:</span>
                  <span className="fw-bold">{formatDate(prescription.expiryDate)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Врач:</span>
                  <span className="fw-bold">{prescription.doctorName.firstName} {prescription.doctorName.lastName}</span>
                </ListGroup.Item>
              </ListGroup>

              <h6>Инструкции по применению:</h6>
              <Card className="mb-3 bg-light">
                <Card.Body>
                  <p className="mb-0">{prescription.instructions}</p>
                </Card.Body>
              </Card>

              {prescription.additionalNotes && (
                <>
                  <h6>Дополнительные примечания:</h6>
                  <Card className="mb-3 bg-light">
                    <Card.Body>
                      <p className="mb-0">{prescription.additionalNotes}</p>
                    </Card.Body>
                  </Card>
                </>
              )}
            </>
          ) : (
            <p className="text-center text-muted">Детали рецепта недоступны.</p>
          )}
        </Card.Body>
        <Card.Footer className="text-muted text-center">
          Информация предоставлена MedCare
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default PrescriptionVerifyPage;