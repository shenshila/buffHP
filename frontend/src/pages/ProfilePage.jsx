import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Container, 
  Card, 
  ListGroup, 
  Button, 
  Spinner, 
  Alert, 
  Tab, 
  Tabs,
  Badge,
  Row,
  Col,
  Table
} from 'react-bootstrap';
import { getPatientProfile } from '../api/patientApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/PatientProfile.css'; // Создадим этот файл для кастомных стилей

export default function PatientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientProfile(id);
        setPatient(data);
      } catch (err) {
        setError('Не удалось загрузить данные пациента');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="danger" />
    </div>
  );

  if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

  return (
    <Container className="py-4">
      {/* Кнопка назад и заголовок */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button 
          variant="outline-danger" 
          onClick={() => navigate(-1)}
          className="d-flex align-items-center"
        >
          <i className="bi bi-arrow-left me-2"></i> Назад
        </Button>
        <h2 className="mb-0 text-danger">Медицинская карта</h2>
      </div>

      {/* Основная информация о пациенте */}
      <Card className="mb-4 border-danger">
        <Card.Header className="bg-danger text-white">
          <h4 className="mb-0">
            <i className="bi bi-person-vcard me-2"></i>
            Основная информация
          </h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>ФИО:</strong> {patient.lastName} {patient.firstName} {patient.middleName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Дата рождения:</strong> {patient.dateOfBirth}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Пол:</strong> {patient.gender === 'MALE' ? 'Мужской' : 'Женский'}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Телефон:</strong> {patient.phone}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Страховой номер:</strong> {patient.insuranceNumber}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>ID пациента:</strong> {patient.id}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Табы с дополнительной информацией */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey="appointments" title="Приемы">
          <Card className="border-danger">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2 text-danger"></i>
                История приемов
              </h5>
            </Card.Header>
            <Card.Body>
              {patient.appointments.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Врач</th>
                        <th>Специализация</th>
                        <th>Статус</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.appointments.map(appointment => (
                        <tr key={appointment.appointmentId}>
                          <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                          <td>{appointment.doctor.lastName} {appointment.doctor.firstName}</td>
                          <td>{appointment.doctor.specialization}</td>
                          <td>
                            <Badge 
                              bg={appointment.appointmentStatus === 'COMPLETED' ? 'success' : 
                                 appointment.appointmentStatus === 'CANCELED' ? 'danger' : 'warning'}
                            >
                              {appointment.appointmentStatus === 'COMPLETED' ? 'Завершен' : 
                               appointment.appointmentStatus === 'CANCELED' ? 'Отменен' : 'Запланирован'}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-danger" size="sm">
                              Подробнее
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info">
                  Нет данных о приемах
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="records" title="Записи">
          <Card className="border-danger">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-file-medical me-2 text-danger"></i>
                Медицинские записи
              </h5>
            </Card.Header>
            <Card.Body>
              {patient.medicalRecords.length > 0 ? (
                patient.medicalRecords.map(record => (
                  <Card key={record.id} className="mb-3 shadow-sm">
                    <Card.Header>
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{record.recordDate}</span>
                        <Badge bg="danger">{record.diagnosis}</Badge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <h6>Лечение:</h6>
                      <p>{record.treatment}</p>
                      {record.attachments && (
                        <div className="mt-2">
                          <Button variant="outline-danger" size="sm">
                            <i className="bi bi-paperclip me-1"></i> Вложения
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  Нет медицинских записей
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="prescriptions" title="Рецепты">
          <Card className="border-danger">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-prescription me-2 text-danger"></i>
                Выписанные рецепты
              </h5>
            </Card.Header>
            <Card.Body>
              {patient.prescriptions.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Дата выписки</th>
                        <th>Лекарство</th>
                        <th>Дозировка</th>
                        <th>Врач</th>
                        <th>Действует до</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.prescriptions.map(prescription => (
                        <tr key={prescription.id || Math.random()}>
                          <td>{prescription.issueDate}</td>
                          <td className="fw-bold">{prescription.medication}</td>
                          <td>{prescription.dosage}</td>
                          <td>{prescription.doctor.lastName} {prescription.doctor.firstName}</td>
                          <td className={new Date(prescription.expiryDate) < new Date() ? 'text-danger' : ''}>
                            {prescription.expiryDate}
                            {new Date(prescription.expiryDate) < new Date() && (
                              <Badge bg="danger" className="ms-2">Просрочен</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info">
                  Нет выписанных рецептов
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Кнопки действий */}
      <div className="d-flex justify-content-end gap-3 mt-4">
        <Button variant="outline-danger">
          <i className="bi bi-calendar-plus me-2"></i>
          Записать на прием
        </Button>
        <Button variant="danger">
          <i className="bi bi-file-earmark-medical me-2"></i>
          Добавить запись
        </Button>
      </div>
    </Container>
  );
}

// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
// import { findPatientById } from '../api/patientApi';

// export default function ProfilePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [patient, setPatient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPatient = async () => {
//       try {
//         const data = await findPatientById(id);
//         setPatient(data);
//       } catch (err) {
//         setError('Не удалось загрузить данные пациента');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatient();
//   }, [id]);

//   if (loading) return <Spinner animation="border" />;
//   if (error) return <Alert variant="danger">{error}</Alert>;

//   return (
//     <>
//       <Button 
//         variant="secondary" 
//         onClick={() => navigate(-1)}
//         className="mb-3"
//       >
//         ← Назад
//       </Button>

//       <Card>
//         <Card.Header className="bg-primary text-white">
//           <h3>Профиль пациента</h3>
//         </Card.Header>
//         <Card.Body>
//           <ListGroup variant="flush">
//             <ListGroup.Item>
//               <strong>ФИО:</strong> {patient.lastName} {patient.firstName} {patient.middleName}
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <strong>Дата рождения:</strong> {patient.birthDate}
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <strong>Пол:</strong> {patient.gender === 'MALE' ? 'Мужской' : 'Женский'}
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <strong>Телефон:</strong> {patient.phone || 'не указан'}
//             </ListGroup.Item>
//             <ListGroup.Item>
//               <strong>Страховой номер:</strong> {patient.insuranceNumber}
//             </ListGroup.Item>
//           </ListGroup>
//         </Card.Body>
//       </Card>
//     </>
//   );
// }