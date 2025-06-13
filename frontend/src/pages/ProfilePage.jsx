import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Table,
  Modal,
  Form,
} from "react-bootstrap";
import { getPatientProfile } from "../api/patientApi";
import { createPrescription, verifyPrescription } from "../api/prescriptionApi";
import {
  fetchMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  confirmMedicalRecord
} from "../api/medicalRecordsApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/ProfilePage.css";

export default function PatientProfile({ authState }) {
  console.log("AuthState in ProfilePage:", authState);
  const isDoctor =
    authState?.userRole === "DOCTOR" || authState?.userRole === "ROLE_DOCTOR";
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const [confirmationStatus, setConfirmationStatus] = useState(null); 
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showViewRecordModal, setShowViewRecordModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [recordForm, setRecordForm] = useState({
    diagnosis: "",
    treatment: "",
    symptoms: "",
    recordDate: new Date().toISOString().split("T")[0],
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medication: "",
    dosage: "",
    instructions: "",
    validityDays: 30,
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientProfile(id);
        // Загружаем медицинские записи отдельно
        const records = await fetchMedicalRecordsByPatientId(id);
        setPatient({ ...data, medicalRecords: records });
      } catch (err) {
        setError("Не удалось загрузить данные пациента");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleCreatePrescription = async () => {
    try {
      const response = await createPrescription({
        patientId: id,
        ...prescriptionForm,
      });

      const prescriptionWithDoctor = {
        ...response,
        doctor: response.doctor || {
          lastName: "Вы",
          firstName: "",
          specialization: "",
        },
      };

      const updatedPatient = { ...patient };
      updatedPatient.prescriptions = [
        ...patient.prescriptions,
        prescriptionWithDoctor,
      ];
      setPatient(updatedPatient);

      setShowPrescriptionModal(false);
      setPrescriptionForm({
        medication: "",
        dosage: "",
        instructions: "",
        validityDays: 30,
      });
    } catch (err) {
      setError("Ошибка при создании рецепта: " + err.message);
    }
  };

  const handleViewPrescription = async (prescription) => {
    setCurrentPrescription(prescription);

    if (prescription.verificationUrl) {
      const code = prescription.verificationUrl.split("/").pop();
      const result = await verifyPrescription(code);
      setVerificationResult(result);
    }

    setShowViewModal(true);
  };

  // Обработчики для медицинских записей
  const handleCreateRecord = async () => {
    try {
      const newRecord = await createMedicalRecord({
        patientId: id,
        ...recordForm,
      });

      const updatedPatient = { ...patient };
      updatedPatient.medicalRecords = [...patient.medicalRecords, newRecord];
      setPatient(updatedPatient);

      setShowRecordModal(false);
      setRecordForm({
        diagnosis: "",
        treatment: "",
        symptoms: recordForm.symptoms,
        recordDate: new Date().toISOString().split("T")[0],
        source: "ДОКТОР",
      });
    } catch (err) {
      setError("Ошибка при создании записи: " + err.message);
    }
  };

  const handleUpdateRecord = async () => {
    try {
      if (!currentRecord?.medicalRecordId) {
        throw new Error("ID записи не определен");
      }

      // const updatedRecord = await updateMedicalRecord(currentRecord.medicalRecordId, {
      //   patientId: id, // Добавьте patientId
      //   ...recordForm
      // });
      const updatedRecord = await updateMedicalRecord(
        currentRecord.medicalRecordId,
        {
          patientId: id,
          diagnosis: recordForm.diagnosis,
          treatment: recordForm.treatment,
          symptoms: recordForm.symptoms,
          recordDate: recordForm.recordDate,
          source: currentRecord.source || "ДОКТОР",
        }
      );

      const updatedPatient = { ...patient };
      updatedPatient.medicalRecords = updatedPatient.medicalRecords.map(
        (record) =>
          record.medicalRecordId === currentRecord.medicalRecordId
            ? updatedRecord
            : record
      );
      setPatient(updatedPatient);

      setShowRecordModal(false);
      setCurrentRecord(null);
    } catch (err) {
      console.error("Update error:", err);
      setError("Ошибка при обновлении записи: " + err.message);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      try {
        await deleteMedicalRecord(recordId);

        const updatedPatient = { ...patient };
        updatedPatient.medicalRecords = patient.medicalRecords.filter(
          (record) => record.medicalRecordId !== recordId
        );
        setPatient(updatedPatient);
      } catch (err) {
        setError("Ошибка при удалении записи: " + err.message);
      }
    }
  };

  const handleEditRecord = (record) => {
    if (!record.medicalRecordId) {
      console.error("Record ID is missing:", record);
      setError("Не удалось определить ID записи");
      return;
    }

    setCurrentRecord(record);
    setRecordForm({
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      symptoms: record.symptoms || "",
      recordDate: record.recordDate,
    });
    setShowRecordModal(true);
  };

  const handleViewRecord = (record) => {
    setCurrentRecord(record);
    setShowViewRecordModal(true);
  };

  const handleNewRecord = () => {
    setCurrentRecord(null);
    setRecordForm({
      diagnosis: "",
      treatment: "",
      symptoms: "",
      recordDate: new Date().toISOString().split("T")[0],
    });
    setShowRecordModal(true);
  };

  const handleConfirmRecord = async (recordId) => {
  try {
    const confirmedRecordData = await confirmMedicalRecord(recordId);

    const updatedPatient = { ...patient };
    updatedPatient.medicalRecords = patient.medicalRecords.map(record =>
      record.medicalRecordId === recordId ? confirmedRecordData : record
    );
    setPatient(updatedPatient);

    setConfirmationStatus({ success: true, message: 'Запись успешно подтверждена' });
    setTimeout(() => setConfirmationStatus(null), 3000);
  } catch (err) {
    setConfirmationStatus({ success: false, message: 'Ошибка подтверждения: ' + err.message });
  }
};

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );

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
                  <strong>ФИО:</strong> {patient.lastName} {patient.firstName}{" "}
                  {patient.middleName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Дата рождения:</strong> {patient.dateOfBirth}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Пол:</strong>{" "}
                  {patient.gender === "MALE" ? "Мужской" : "Женский"}
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
                      {patient.appointments.map((appointment) => (
                        <tr key={appointment.appointmentId}>
                          <td>
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleString()}
                          </td>
                          <td>
                            {appointment.doctor.lastName}{" "}
                            {appointment.doctor.firstName}
                          </td>
                          <td>{appointment.doctor.specialization}</td>
                          <td>
                            <Badge
                              bg={
                                appointment.appointmentStatus === "COMPLETED"
                                  ? "success"
                                  : appointment.appointmentStatus === "CANCELED"
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {appointment.appointmentStatus === "COMPLETED"
                                ? "Завершен"
                                : appointment.appointmentStatus === "CANCELED"
                                ? "Отменен"
                                : "Запланирован"}
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
                <Alert variant="info">Нет данных о приемах</Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* Медицинские записи */}
        <Tab eventKey="records" title="Записи">
          <Card className="border-danger">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-file-medical me-2 text-danger"></i>
                  Медицинские записи
                </h5>
                {isDoctor && (
                  <Button variant="danger" size="sm" onClick={handleNewRecord}>
                    <i className="bi bi-plus-circle me-1"></i> Новая запись
                  </Button>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {patient.medicalRecords.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Дата</th>
                        <th>Диагноз</th>
                        <th>Лечение</th>
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.medicalRecords.map((record) => (
                        <tr key={record.medicalRecordId}>
                          <td>{record.recordDate}</td>
                          <td>
                            <Badge bg="danger">{record.diagnosis}</Badge>
                            {record.confirmedBy && (
                              <Badge bg="success" className="ms-2">
                                Подтверждено
                              </Badge>
                            )}
                            {record.source === "AI" && !record.confirmedBy && (
                              <Badge bg="warning" className="ms-2">
                                Требует подтверждения
                              </Badge>
                            )}
                          </td>
                          <td>
                            {record.treatment.substring(0, 50)}
                            {record.treatment.length > 50 ? "..." : ""}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleViewRecord(record)}
                              >
                                Просмотр
                              </Button>
                              {isDoctor && (
                                <>
                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleEditRecord(record)}
                                    disabled={
                                      record.source === "ИИ" &&
                                      !record.confirmedBy
                                    }
                                  >
                                    Изменить
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteRecord(record.medicalRecordId)
                                    }
                                  >
                                    Удалить
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info">Нет медицинских записей</Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="prescriptions" title="Рецепты">
          <Card className="border-danger">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-prescription me-2 text-danger"></i>
                  Выписанные рецепты
                </h5>
                {isDoctor && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setShowPrescriptionModal(true)}
                  >
                    <i className="bi bi-plus-circle me-1"></i> Новый рецепт
                  </Button>
                )}
              </div>
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
                        <th>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.prescriptions.map((prescription) => (
                        <tr key={prescription.id || Math.random()}>
                          <td>{prescription.issueDate}</td>
                          <td className="fw-bold">{prescription.medication}</td>
                          <td>{prescription.dosage}</td>
                          <td>
                            {prescription.doctor.lastName}{" "}
                            {prescription.doctor.firstName}
                          </td>
                          <td
                            className={
                              new Date(prescription.expiryDate) < new Date()
                                ? "text-danger"
                                : ""
                            }
                          >
                            {prescription.expiryDate}
                            {new Date(prescription.expiryDate) < new Date() && (
                              <Badge bg="danger" className="ms-2">
                                Просрочен
                              </Badge>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleViewPrescription(prescription)
                              }
                            >
                              Просмотр
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info">Нет выписанных рецептов</Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Модальное окно создания/редактирования медицинской записи */}
      <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentRecord
              ? "Редактирование записи"
              : "Новая медицинская запись"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Дата записи</Form.Label>
              <Form.Control
                type="date"
                value={recordForm.recordDate}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, recordDate: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Диагноз</Form.Label>
              <Form.Control
                type="text"
                value={recordForm.diagnosis}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, diagnosis: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Лечение</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={recordForm.treatment}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, treatment: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Симптомы</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="symptoms"
                value={recordForm.symptoms}
                onChange={(e) =>
                  setRecordForm({ ...recordForm, symptoms: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRecordModal(false)}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={currentRecord ? handleUpdateRecord : handleCreateRecord}
          >
            {currentRecord ? "Сохранить изменения" : "Создать запись"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно просмотра медицинской записи */}
      <Modal
        show={showViewRecordModal}
        onHide={() => setShowViewRecordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Медицинская запись от {currentRecord?.recordDate}
            {currentRecord?.confirmedBy && (
              <Badge bg="success" className="ms-2">
                Подтверждено
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRecord && (
            <div>
              {confirmationStatus && (
                <Alert
                  variant={confirmationStatus.success ? "success" : "danger"}
                >
                  {confirmationStatus.message}
                </Alert>
              )}

              <div className="mb-3">
                <h5>Источник:</h5>
                <Badge bg={currentRecord.source === "ИИ" ? "info" : "primary"}>
                  {currentRecord.source === "ИИ"
                    ? "Сгенерировано ИИ"
                    : "Создано врачом"}
                </Badge>
              </div>

              <div className="mb-3">
                <h5>Диагноз:</h5>
                <Badge bg="danger">{currentRecord.diagnosis}</Badge>
              </div>

              <div className="mb-3">
                <h5>Лечение:</h5>
                <p>{currentRecord.treatment}</p>
              </div>

              {currentRecord.symptoms && (
                <div className="mb-3">
                  <h5>Симптомы:</h5>
                  <p>{currentRecord.symptoms}</p>
                </div>
              )}

              {/* Добавляем информацию о подтвердившем враче, если есть */}
              {currentRecord.confirmedBy && (
                <div className="mb-3">
                  <h5>Подтверждено:</h5>
                  <p>
                    {currentRecord.confirmedBy.lastName}{" "}
                    {currentRecord.confirmedBy.firstName}
                  </p>
                </div>
              )}

              {/* Добавляем кнопку подтверждения для записей ИИ, если пользователь - врач */}
              {isDoctor &&
                currentRecord.source === "ИИ" &&
                !currentRecord.confirmedBy && (
                  <div className="mt-4">
                    <Button
                      variant="success"
                      onClick={() =>
                        handleConfirmRecord(currentRecord.medicalRecordId)
                      }
                    >
                      <i className="bi bi-check-circle me-1"></i> Подтвердить
                      диагноз
                    </Button>
                  </div>
                )}

              {currentRecord.attachments &&
                currentRecord.attachments.length > 0 && (
                  <div className="mt-3">
                    <h5>Вложения:</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {currentRecord.attachments.map((attachment, index) => (
                        <Button
                          key={attachment.id || index}
                          variant="outline-primary"
                          size="sm"
                          onClick={() => window.open(attachment.url, "_blank")}
                        >
                          <i className="bi bi-paperclip me-1"></i> Файл{" "}
                          {index + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowViewRecordModal(false)}
          >
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно создания рецепта */}
      <Modal
        show={showPrescriptionModal}
        onHide={() => setShowPrescriptionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Новый рецепт</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Лекарство</Form.Label>
              <Form.Control
                type="text"
                value={prescriptionForm.medication}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    medication: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Дозировка</Form.Label>
              <Form.Control
                type="text"
                value={prescriptionForm.dosage}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    dosage: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Инструкции</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={prescriptionForm.instructions}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    instructions: e.target.value,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Срок действия (дней)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={prescriptionForm.validityDays}
                onChange={(e) =>
                  setPrescriptionForm({
                    ...prescriptionForm,
                    validityDays: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPrescriptionModal(false)}
          >
            Отмена
          </Button>
          <Button variant="danger" onClick={handleCreatePrescription}>
            Создать рецепт
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно просмотра рецепта */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Рецепт №{currentPrescription?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPrescription && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Пациент:</h5>
                  <p>
                    {patient.lastName} {patient.firstName} {patient.middleName}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Врач:</h5>
                  <p>
                    {currentPrescription.doctor.lastName}{" "}
                    {currentPrescription.doctor.firstName}
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <h5>Лекарство:</h5>
                  <p>
                    <strong>{currentPrescription.medication}</strong> -{" "}
                    {currentPrescription.dosage}
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Срок действия:</h5>
                  <p>
                    {currentPrescription.issueDate} -{" "}
                    {currentPrescription.expiryDate}
                    {new Date(currentPrescription.expiryDate) < new Date() && (
                      <Badge bg="danger" className="ms-2">
                        Просрочен
                      </Badge>
                    )}
                  </p>
                </Col>
              </Row>

              <h5>Инструкции:</h5>
              <p>{currentPrescription.instructions}</p>

              {verificationResult && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h5>Результат проверки:</h5>
                  <p
                    className={
                      verificationResult.valid ? "text-success" : "text-danger"
                    }
                  >
                    <strong>{verificationResult.statusMessage}</strong>
                  </p>
                  {currentPrescription.qrCodeBase64 && (
                    <div className="text-center mt-3">
                      <img
                        src={`data:image/png;base64,${currentPrescription.qrCodeBase64}`}
                        alt="QR код рецепта"
                        style={{ maxWidth: "200px" }}
                      />
                      <p className="text-muted mt-2">
                        Отсканируйте QR-код для проверки рецепта
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Кнопки действий */}
      <div className="d-flex justify-content-end gap-3 mt-4">
        <Button variant="outline-danger">
          <i className="bi bi-calendar-plus me-2"></i>
          Записать на прием
        </Button>
      </div>
    </Container>
  );
}
