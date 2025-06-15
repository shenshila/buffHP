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
  FaUser,
  FaCalendarAlt,
  FaFileMedical,
  FaPrescription,
  FaEdit,
  FaHistory,
  FaPlus,
  FaNotesMedical,
  FaClipboardCheck,
  FaPaperclip,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn, MdDateRange } from "react-icons/md";
import BookAppointmentForm from "./BookAppointmentForm";
import * as appointmentApi from "../api/appointmentApi";
import "../css/PatientProfile.css";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const PatientProfile = ({ profile, refreshProfile }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState(null);

  const handleShowPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handleClosePrescription = () => {
    setShowPrescriptionModal(false);
    setSelectedPrescription(null);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Вы уверены, что хотите отменить этот прием?")) {
      setCancellingAppointmentId(appointmentId);
      setCancelError(null);
      try {
        await appointmentApi.cancelAppointment(appointmentId);
        // alert("Прием успешно отменен!");
        if (refreshProfile) {
          await refreshProfile();
        }
      } catch (err) {
        console.error("Ошибка при отмене приема:", err);
        setCancelError(err.message || "Не удалось отменить прием.");
      } finally {
        setCancellingAppointmentId(null);
      }
    }
  };

  const handleDownloadPrintPrescription = async () => {
    if (!selectedPrescription) return;

    // Создаем элемент, который будем печатать/конвертировать в PDF
    const printContent = document.createElement("div");
    printContent.style.padding = "20px";
    printContent.style.fontFamily = "Arial, sans-serif";
    printContent.innerHTML = `
      <h2 style="color: #dc3545; text-align: center;">Медицинский рецепт</h2>
      <hr style="border-color: #dc3545;">
      <p><strong>Пациент:</strong> ${profile.firstName} ${profile.lastName} ${
      profile.middleName || ""
    }</p>
      <p><strong>Дата рождения:</strong> ${
        formatDate(profile.birthDate).split(",")[0]
      }</p>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Телефон:</strong> ${profile.phoneNumber || "не указан"}</p>
      <hr>
      <p><strong>Лекарство:</strong> <span style="font-size: 1.2em; font-weight: bold;">${
        selectedPrescription.medication
      }</span></p>
      <p><strong>Дозировка:</strong> ${selectedPrescription.dosage}</p>
      <p><strong>Инструкции:</strong> ${selectedPrescription.instructions}</p>
      <p><strong>Действует до:</strong> ${
        formatDate(selectedPrescription.expiryDate).split(",")[0]
      }</p>
      <hr>
      <p><strong>Выписан доктором:</strong> ${
        selectedPrescription.doctorName.firstName
      } ${selectedPrescription.doctorName.lastName}</p>
      <p><strong>Специализация доктора:</strong> ${
        selectedPrescription.doctorName.specialization
      }</p>
      <p style="margin-top: 30px; text-align: right; font-style: italic;">Дата выписки: ${
        formatDate(selectedPrescription.prescriptionDate || new Date()).split(
          ","
        )[0]
      }</p>
    `;

    // Добавляем содержимое на страницу временно для html2canvas
    document.body.appendChild(printContent);

    try {
      const canvas = await html2canvas(printContent, { scale: 2 }); // scale: 2 для лучшего качества
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // 'p' - портрет, 'mm' - миллиметры, 'a4' - размер
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `Рецепт_${selectedPrescription.medication}_${profile.lastName}.pdf`
      );

      // Можно также предложить распечатать
      // const printWindow = window.open('', '_blank');
      // printWindow.document.write('<html><head><title>Рецепт</title></head><body>');
      // printWindow.document.write(printContent.innerHTML);
      // printWindow.document.write('</body></html>');
      // printWindow.document.close();
      // printWindow.print();
    } catch (error) {
      console.error("Ошибка при генерации PDF/печати:", error);
      alert(
        "Не удалось сгенерировать PDF или распечатать рецепт. Пожалуйста, попробуйте еще раз."
      );
    } finally {
      // Удаляем временное содержимое
      document.body.removeChild(printContent);
    }
  };

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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="patient-profile-container"
    >
      <Card className="border-0 mb-4">
        <Card.Header>
          <h4 className="mb-0 d-flex align-items-center">
            <FaUser className="me-2" /> Личный кабинет пациента
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
                      <FaUser className="me-2" /> Профиль
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="appointments"
                      className="d-flex align-items-center"
                    >
                      <FaCalendarAlt className="me-2" /> Приемы
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="records"
                      className="d-flex align-items-center"
                    >
                      <FaFileMedical className="me-2" /> Медицинские записи
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="prescriptions"
                      className="d-flex align-items-center"
                    >
                      <FaPrescription className="me-2" /> Рецепты
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
                <Button
                  variant="outline-danger"
                  className="w-100 mb-2"
                  onClick={() => setShowAppointmentModal(true)}
                >
                  <FaEdit className="me-2" /> Записаться на прием
                </Button>
                <Button variant="outline-secondary" className="w-100">
                  <FaHistory className="me-2" /> История посещений
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9}>
            <Tab.Content>
              {/* Профиль */}
              <Tab.Pane eventKey="profile">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaUser className="me-2 text-danger" />
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
                              <FaUser className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">ФИО</small>
                              <p className="mb-0 fw-bold">
                                {profile.firstName} {profile.lastName}{" "}
                                {profile.middleName}
                              </p>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <MdDateRange className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">
                                Дата рождения
                              </small>
                              <p className="mb-0 fw-bold">
                                {formatDate(profile.birthDate)}
                              </p>
                            </div>
                          </ListGroup.Item>
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <FaUser className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">Пол</small>
                              <p className="mb-0 fw-bold">
                                {profile.gender === "MALE"
                                  ? "Мужской"
                                  : "Женский"}
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
                          <ListGroup.Item className="d-flex align-items-center">
                            <div className="icon-container me-3">
                              <MdLocationOn className="text-muted" />
                            </div>
                            <div>
                              <small className="text-muted">Адрес</small>
                              <p className="mb-0 fw-bold">
                                {profile.address || "не указан"}
                              </p>
                            </div>
                          </ListGroup.Item>
                        </ListGroup>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="border-0 shadow-sm mt-4">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <FaFileMedical className="me-2 text-danger" />
                      Страховая информация
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col sm={4} className="text-muted">
                            Страховой номер:
                          </Col>
                          <Col sm={8} className="fw-bold">
                            {profile.insuranceNumber}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col sm={4} className="text-muted">
                            Страховая компания:
                          </Col>
                          <Col sm={8} className="fw-bold">
                            {profile.insuranceCompany || "не указана"}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col sm={4} className="text-muted">
                            Действует до:
                          </Col>
                          <Col sm={8} className="fw-bold">
                            {profile.insuranceExpiry
                              ? formatDate(profile.insuranceExpiry)
                              : "не указано"}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Приемы */}
              <Tab.Pane eventKey="appointments">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaCalendarAlt className="me-2 text-danger" />
                      История приемов
                    </h5>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowAppointmentModal(true)}
                    >
                      Записаться на прием
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {cancelError && (
                      <Alert variant="danger" className="mb-3">
                        {cancelError}
                      </Alert>
                    )}
                    {profile.appointments?.length > 0 ? (
                      <div className="timeline">
                        {[...profile.appointments]
                          .sort(
                            (a, b) =>
                              new Date(b.appointmentDate) -
                              new Date(a.appointmentDate)
                          )
                          .map((app) => (
                            <div
                              key={app.appointmentId}
                              className="timeline-item"
                            >
                              <div className="timeline-badge">
                                {app.appointmentStatus === "COMPLETED" ? (
                                  <span className="bg-success">
                                    <FaCalendarAlt />
                                  </span>
                                ) : app.appointmentStatus === "CANCELED" ? (
                                  <span className="bg-danger">
                                    <FaCalendarAlt />
                                  </span>
                                ) : (
                                  <span className="bg-warning">
                                    <FaCalendarAlt />
                                  </span>
                                )}
                              </div>
                              <div className="timeline-panel">
                                <div className="timeline-heading">
                                  <h5 className="timeline-title">
                                    Прием у {app.doctor.firstName}{" "}
                                    {app.doctor.lastName}
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
                                      bg={
                                        app.appointmentStatus === "COMPLETED"
                                          ? "success"
                                          : app.appointmentStatus === "CANCELED"
                                          ? "danger"
                                          : "warning"
                                      }
                                      className="me-2"
                                    >
                                      {app.appointmentStatus === "COMPLETED"
                                        ? "Завершен"
                                        : app.appointmentStatus === "CANCELED"
                                        ? "Отменен"
                                        : "Запланирован"}
                                    </Badge>
                                    Специализация: {app.doctor.specialization}
                                  </p>
                                  {
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      className="mt-2 me-2"
                                    >
                                      Подробнее
                                    </Button>
                                  }
                                  {/* Кнопка отмены приема */}
                                  {app.appointmentStatus === "SCHEDULED" && (
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      className="mt-2"
                                      onClick={() =>
                                        handleCancelAppointment(
                                          app.appointmentId
                                        )
                                      }
                                      disabled={
                                        cancellingAppointmentId ===
                                        app.appointmentId
                                      }
                                    >
                                      {cancellingAppointmentId ===
                                      app.appointmentId
                                        ? "Отмена..."
                                        : "Отменить прием"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <Alert variant="info">
                        У вас нет записей на приемы. Запишитесь к врачу!
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Медицинские записи */}
              <Tab.Pane eventKey="records">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaFileMedical className="me-2 text-danger" />
                      Медицинские записи
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {profile.medicalRecords?.length > 0 ? (
                      <div className="medical-records-container">
                        {/* [...profile.prescriptions].reverse().map((presc) */}
                        {[...profile.medicalRecords]
                          .reverse()
                          .map((record, index) => (
                            <Card
                              key={record.id}
                              className="mb-3 border-0 shadow-sm"
                            >
                              <Card.Header className="bg-light">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="d-flex align-items-center">
                                    <div className="record-date-badge me-3">
                                      <div className="day">
                                        {new Date(record.recordDate).getDate()}
                                      </div>
                                      <div className="month">
                                        {new Date(
                                          record.recordDate
                                        ).toLocaleString("ru-RU", {
                                          month: "short",
                                        })}
                                      </div>
                                    </div>
                                    <div>
                                      <h6 className="mb-0 fw-bold">
                                        {record.diagnosis}
                                      </h6>
                                      <small className="text-muted">
                                        {new Date(
                                          record.recordDate
                                        ).toLocaleString("ru-RU", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </small>
                                    </div>
                                  </div>
                                  <Badge pill bg="danger">
                                    {record.source}
                                  </Badge>
                                  {/* <Badge pill bg="danger">Сгенерировано ИИ. <br /> Требуется подтверждение</Badge> */}
                                </div>
                              </Card.Header>
                              <Card.Body>
                                <div className="record-details">
                                  <div className="detail-section">
                                    <h6 className="detail-title">
                                      <FaNotesMedical className="me-2 text-danger" />
                                      Лечение
                                    </h6>
                                    <p className="detail-content">
                                      {record.treatment}
                                    </p>
                                  </div>

                                  {record.recommendations && (
                                    <div className="detail-section mt-3">
                                      <h6 className="detail-title">
                                        <FaClipboardCheck className="me-2 text-danger" />
                                        Рекомендации
                                      </h6>
                                      <p className="detail-content">
                                        {record.recommendations}
                                      </p>
                                    </div>
                                  )}

                                  {record.attachments && (
                                    <div className="detail-section mt-3">
                                      <h6 className="detail-title">
                                        <FaPaperclip className="me-2 text-danger" />
                                        Вложения
                                      </h6>
                                      <div className="mt-2">
                                        <Button
                                          variant="outline-danger"
                                          size="sm"
                                        >
                                          <FaDownload className="me-1" />{" "}
                                          Скачать
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <Alert variant="info" className="text-center py-4">
                        <FaFileMedical size={32} className="mb-3 text-info" />
                        <h5>Нет медицинских записей</h5>
                        <p className="mb-0">
                          Ваши медицинские записи будут отображаться здесь
                        </p>
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Рецепты */}
              <Tab.Pane eventKey="prescriptions">
                <Card className="border-0 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <FaPrescription className="me-2 text-danger" />
                      Рецепты
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    {profile.prescriptions?.length > 0 ? (
                      <Row>
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
                                <strong>
                                  Рецепт #{presc.id.substring(0, 8)}
                                </strong>
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
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleShowPrescription(presc)
                                    }
                                  >
                                    Подробнее
                                  </Button>
                                </div>
                              </Card.Body>
                              <Card.Footer className="text-muted">
                                <small>
                                  Врач: {presc.doctorName.firstName}{" "}
                                  {presc.doctorName.lastName}
                                </small>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Alert variant="info">Нет выписанных рецептов</Alert>
                    )}
                  </Card.Body>

                  {/* Модальное окно для просмотра рецепта */}
                  <Modal
                    show={showPrescriptionModal}
                    onHide={handleClosePrescription}
                    centered
                    size="lg"
                  >
                    <Modal.Header closeButton className="border-bottom-0">
                      <Modal.Title>
                        <FaPrescription className="me-2 text-danger" />
                        Рецепт #{selectedPrescription?.id.substring(0, 8)}
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {selectedPrescription && (
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">
                              {selectedPrescription.medication}
                            </h5>
                            <Badge
                              bg={
                                new Date(selectedPrescription.expiryDate) <
                                new Date()
                                  ? "danger"
                                  : "success"
                              }
                              className="ms-2"
                            >
                              {new Date(selectedPrescription.expiryDate) <
                              new Date()
                                ? "Просрочен"
                                : "Активен"}
                            </Badge>
                          </div>

                          <ListGroup variant="flush" className="mb-3">
                            <ListGroup.Item className="d-flex justify-content-between">
                              <span className="text-muted">Дозировка:</span>
                              <span className="fw-bold">
                                {selectedPrescription.dosage}
                              </span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                              <span className="text-muted">Дата выписки:</span>
                              <span className="fw-bold">
                                {formatDate(selectedPrescription.issueDate)}
                              </span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                              <span className="text-muted">Действует до:</span>
                              <span className="fw-bold">
                                {formatDate(selectedPrescription.expiryDate)}
                              </span>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex justify-content-between">
                              <span className="text-muted">Врач:</span>
                              <span className="fw-bold">
                                {selectedPrescription.doctorName.firstName}{" "}
                                {selectedPrescription.doctorName.lastName}
                              </span>
                            </ListGroup.Item>
                          </ListGroup>

                          {selectedPrescription.qrCodeBase64 && (
                            <div className="text-center my-4">
                              <h6 className="mb-3">QR-код для верификации:</h6>
                              <img
                                src={`data:image/png;base64,${selectedPrescription.qrCodeBase64}`}
                                alt="QR Code"
                                style={{
                                  maxWidth: "200px",
                                  height: "auto",
                                  border: "1px solid #ddd",
                                  padding: "5px",
                                }}
                                className="img-fluid rounded" 
                              />
                              {selectedPrescription.verificationUrl && (
                                <p className="mt-2 text-muted">
                                  <small>
                                    Сканируйте для проверки подлинности
                                  </small>
                                </p>
                              )}
                            </div>
                          )}

                          <h6 className="mb-2">Инструкции по применению:</h6>
                          <Card className="mb-3">
                            <Card.Body>
                              <p className="mb-0">
                                {selectedPrescription.instructions}
                              </p>
                            </Card.Body>
                          </Card>

                          {selectedPrescription.additionalNotes && (
                            <>
                              <h6 className="mb-2">
                                Дополнительные примечания:
                              </h6>
                              <Card>
                                <Card.Body>
                                  <p className="mb-0">
                                    {selectedPrescription.additionalNotes}
                                  </p>
                                </Card.Body>
                              </Card>
                            </>
                          )}
                        </div>
                      )}
                    </Modal.Body>
                    <Modal.Footer className="border-top-0">
                      <Button
                        variant="outline-secondary"
                        onClick={handleClosePrescription}
                      >
                        Закрыть
                      </Button>
                      <Button
                        variant="danger"
                        onClick={handleDownloadPrintPrescription}
                      >
                        <FaDownload className="me-2" /> Скачать / Распечатать
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <Modal
        show={showAppointmentModal}
        onHide={() => setShowAppointmentModal(false)}
        size="lg"
        centered
        contentClassName="border-0"
      >
        <Modal.Header closeButton className="border-0 bg-light">
          <Modal.Title className="fw-bold text-danger">
            Новая запись к врачу
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <BookAppointmentForm
            onSuccess={() => {
              setShowAppointmentModal(false);
              refreshProfile();
            }}
          />
        </Modal.Body>
      </Modal>
    </motion.div>
  );
};

export default PatientProfile;
