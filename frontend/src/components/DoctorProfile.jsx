import { useState } from "react";
import {
  Tab,
  Nav,
  Row,
  Col,
  Card,
  Badge,
  Button,
  ListGroup,
  Alert,
  Modal,
} from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaPills,
  FaEdit,
  FaSearch, 
  FaFileMedicalAlt,
  FaPlus,
  FaDiagnoses,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";
import PrescriptionForm from "./PrescriptionForm"; 
import "../css/PatientProfile.css";

const DoctorProfile = ({ profile, refreshProfile }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] =
    useState(null);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const handleShowPrescriptionModal = (patientId) => {
    setSelectedPatientForPrescription(patientId);
    setShowPrescriptionModal(true);
  };

  const handleClosePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedPatientForPrescription(null);
    if (refreshProfile) {
      refreshProfile();
    }
  };

  const getAppointmentStatusVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "CANCELED":
        return "danger";
      case "SCHEDULED":
      default:
        return "warning";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="doctor-profile-container"
    >
      <Card className="border-0 mb-4">
        <Card.Header>
          <h4 className="mb-0 d-flex align-items-center">
            <FaUserMd className="me-2" /> Личный кабинет доктора
          </h4>
        </Card.Header>
      </Card>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col md={3}>
            <Card className="border-0 shadow-sm mb-3">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="profile"
                      className="d-flex align-items-center"
                    >
                      <FaUserMd className="me-2" /> Профиль
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="appointments"
                      className="d-flex align-items-center"
                    >
                      <FaCalendarCheck className="me-2" /> Мои приемы
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="prescriptions"
                      className="d-flex align-items-center"
                    >
                      <FaPills className="me-2" /> Мои рецепты
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="analytics"
                      className="d-flex align-items-center"
                      as={Link}
                      to="/doctor/analytics"
                    >
                      <FaDiagnoses className="me-2" /> Аналитика
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <h6 className="mb-0">Быстрые действия</h6>
              </Card.Header>
              <Card.Body>
                <Link to="/patients" className="btn btn-outline-danger w-100 mb-2">
                  <FaSearch className="me-2" /> Найти пациента
                </Link>
                {/* Кнопка для выписки рецепта - возможно, откроет модалку с поиском пациента */}
                <Button variant="outline-primary" className="w-100 mb-2" onClick={() => handleShowPrescriptionModal(null)}>
                  <FaPlus className="me-2" /> Выписать рецепт
                </Button>
                <Link to="/doctor/medical-records-management" className="btn btn-outline-secondary w-100">
                  <FaFileMedicalAlt className="me-2" /> Управление медзаписями
                </Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              {/* Профиль доктора */}
              <Tab.Pane eventKey="profile">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaUserMd className="me-2 text-danger" />
                      Личная информация
                    </h5>
                    <Button variant="outline-danger" size="sm">
                      Редактировать
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <FaUserMd className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">ФИО</small>
                              <p className="mb-0 fw-bold">
                                {profile.firstName} {profile.lastName}
                              </p>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <FaDiagnoses className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">
                                Специализация
                              </small>
                              <p className="mb-0 fw-bold">
                                {profile.specialization}
                              </p>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                      <Col md={6}>
                        <ListGroup variant="flush">
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <MdEmail className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">Email</small>
                              <p className="mb-0 fw-bold">{profile.email}</p>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <MdPhone className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">Телефон</small>
                              <p className="mb-0 fw-bold">
                                {profile.phoneNumber || "не указан"}
                              </p>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Приемы доктора */}
              <Tab.Pane eventKey="appointments">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaCalendarCheck className="me-2 text-danger" />
                      Мои приемы
                    </h5>
                    {/* Кнопка для создания нового приема или просмотра расписания */}
                    <Link to="/doctor/appointments" className="btn btn-danger btn-sm">
                        Расписание
                    </Link>
                  </Card.Header>
                  <Card.Body>
                    {profile.appointments?.length > 0 ? (
                      <div className="timeline">
                        {profile.appointments.map((app) => (
                          <div
                            key={app.appointmentId}
                            className="timeline-item"
                          >
                            <div className="timeline-badge">
                              <span
                                className={`bg-${getAppointmentStatusVariant(
                                  app.appointmentStatus
                                )}`}
                              >
                                <FaCalendarCheck />
                              </span>
                            </div>
                            <div className="timeline-panel">
                              <div className="timeline-heading">
                                <h5 className="timeline-title">
                                  Прием с {app.patient.firstName}{" "}
                                  {app.patient.lastName}
                                </h5>
                                <p className="text-muted">
                                  <small>
                                    {formatDate(app.appointmentDate)}
                                  </small>
                                </p>
                              </div>
                              <div className="timeline-body">
                                <p>
                                  <Badge
                                    bg={getAppointmentStatusVariant(
                                      app.appointmentStatus
                                    )}
                                    className="me-2"
                                  >
                                    {app.appointmentStatus === "COMPLETED"
                                      ? "Завершен"
                                      : app.appointmentStatus === "CANCELED"
                                      ? "Отменен"
                                      : "Запланирован"}
                                  </Badge>
                                </p>
                                <Link
                                  to={`/patients/${app.patient.id}`}
                                  className="btn btn-outline-danger btn-sm"
                                >
                                  Посмотреть медкарту
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        У вас нет предстоящих или завершенных приемов.
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Рецепты доктора */}
              <Tab.Pane eventKey="prescriptions">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaPills className="me-2 text-danger" />
                      Выписанные рецепты
                    </h5>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleShowPrescriptionModal(null)} // null, чтобы форма могла сама найти пациента или запросить его
                    >
                      Выписать новый рецепт
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {profile.prescriptions?.length > 0 ? (
                      <Row>
                        {/* Реверсируем массив для отображения новых рецептов сверху */}
                        {[...profile.prescriptions].reverse().map((presc) => (
                          <Col md={6} key={presc.id} className="mb-3">
                            <Card className="h-100">
                              <Card.Header
                                className={`d-flex justify-content-between align-items-center ${
                                  new Date(presc.expiryDate) < new Date()
                                    ? "bg-danger text-white"
                                    : "bg-success text-white"
                                }`}
                              >
                                <strong>Рецепт #{presc.id.substring(0, 8)}</strong>
                                {new Date(presc.expiryDate) < new Date() ? (
                                  <Badge bg="light" text="danger">
                                    Просрочен
                                  </Badge>
                                ) : (
                                  <Badge bg="light" text="success">
                                    Активен
                                  </Badge>
                                )}
                              </Card.Header>
                              <Card.Body>
                                <h6 className="card-title">
                                  {presc.medication}
                                </h6>
                                <p className="card-text">
                                  <small className="text-muted">
                                    Дозировка: {presc.dosage}
                                  </small>
                                </p>
                                <p className="card-text">
                                  {presc.instructions}
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    Действует до: {formatDate(presc.expiryDate)}
                                  </small>
                                  {/* Если нужна детальная модалка рецепта */}
                                  {/* <Button variant="outline-danger" size="sm">Подробнее</Button> */}
                                </div>
                              </Card.Body>
                              <Card.Footer className="text-muted">
                                <small>
                                  Пациент: {presc.patientName.firstName}{" "}
                                  {presc.patientName.lastName}
                                </small>
                                <Link
                                  to={`/patients/${presc.patientName.id}`}
                                  className="ms-2 btn btn-outline-danger btn-sm"
                                >
                                  Медкарта
                                </Link>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Alert variant="info">Нет выписанных рецептов.</Alert>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Модальное окно для выписки рецепта */}
      <Modal show={showPrescriptionModal} onHide={handleClosePrescriptionModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Выписать рецепт</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Здесь будет компонент формы для выписки рецепта */}
          {/* Предполагается, что PrescriptionForm принимает doctorId и patientId */}
          <PrescriptionForm
            doctorId={profile.doctorId} // Передаем ID текущего доктора
            patientId={selectedPatientForPrescription} // Если пациент уже выбран (например, из контекста)
            onSuccess={handleClosePrescriptionModal}
            onCancel={handleClosePrescriptionModal}
          />
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default DoctorProfile;