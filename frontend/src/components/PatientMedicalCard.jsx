// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { 
//   Container, Card, ListGroup, Spinner, Alert, 
//   Tab, Tabs, Badge, Row, Col, Table, Modal
// } from 'react-bootstrap';
// import { getPatientProfile } from '../api/patientApi';
// import { verifyPrescription } from '../api/prescriptionApi';

// export default function PatientMedicalCard({ authState }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [patient, setPatient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('records');
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [currentPrescription, setCurrentPrescription] = useState(null);
//   const [verificationResult, setVerificationResult] = useState(null);

//   useEffect(() => {
//     const fetchPatient = async () => {
//       try {
//         const data = await getPatientProfile(id);
//         setPatient(data);
//       } catch (err) {
//         setError('Не удалось загрузить данные пациента');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatient();
//   }, [id]);

//   const handleViewPrescription = async (prescription) => {
//     setCurrentPrescription(prescription);
    
//     if (prescription.verificationUrl) {
//       const code = prescription.verificationUrl.split('/').pop();
//       const result = await verifyPrescription(code);
//       setVerificationResult(result);
//     }
    
//     setShowViewModal(true);
//   };

//   if (loading) return (
//     <div className="text-center py-5">
//       <Spinner animation="border" variant="danger" />
//     </div>
//   );

//   if (error) return <Alert variant="danger" className="mt-3">{error}</Alert>;

//   return (
//     <Container className="py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2 className="mb-0 text-danger">Моя медицинская карта</h2>
//       </div>

//       {/* Основная информация о пациенте */}
//       <Card className="mb-4 border-danger">
//         <Card.Header className="bg-danger text-white">
//           <h4 className="mb-0">
//             <i className="bi bi-person-vcard me-2"></i>
//             Основная информация
//           </h4>
//         </Card.Header>
//         <Card.Body>
//           <Row>
//             <Col md={6}>
//               <ListGroup variant="flush">
//                 <ListGroup.Item>
//                   <strong>ФИО:</strong> {patient.lastName} {patient.firstName} {patient.middleName}
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <strong>Дата рождения:</strong> {patient.dateOfBirth}
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <strong>Пол:</strong> {patient.gender === 'MALE' ? 'Мужской' : 'Женский'}
//                 </ListGroup.Item>
//               </ListGroup>
//             </Col>
//             <Col md={6}>
//               <ListGroup variant="flush">
//                 <ListGroup.Item>
//                   <strong>Телефон:</strong> {patient.phone}
//                 </ListGroup.Item>
//                 <ListGroup.Item>
//                   <strong>Страховой номер:</strong> {patient.insuranceNumber}
//                 </ListGroup.Item>
//               </ListGroup>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Табы с медицинской информацией */}
//       <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
//         <Tab eventKey="records" title="Медицинские записи">
//           <Card className="border-danger">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">
//                 <i className="bi bi-file-medical me-2 text-danger"></i>
//                 История обращений
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               {patient.medicalRecords.length > 0 ? (
//                 patient.medicalRecords.map(record => (
//                   <Card key={record.id} className="mb-3 shadow-sm">
//                     <Card.Header>
//                       <div className="d-flex justify-content-between">
//                         <span className="fw-bold">{record.recordDate}</span>
//                         <Badge bg="danger">{record.diagnosis}</Badge>
//                       </div>
//                     </Card.Header>
//                     <Card.Body>
//                       <h6>Лечение:</h6>
//                       <p>{record.treatment}</p>
//                     </Card.Body>
//                   </Card>
//                 ))
//               ) : (
//                 <Alert variant="info">Нет медицинских записей</Alert>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>

//         <Tab eventKey="prescriptions" title="Мои рецепты">
//           <Card className="border-danger">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">
//                 <i className="bi bi-prescription me-2 text-danger"></i>
//                 Рецепты
//               </h5>
//             </Card.Header>
//             <Card.Body>
//               {patient.prescriptions.length > 0 ? (
//                 <div className="table-responsive">
//                   <Table striped hover>
//                     <thead>
//                       <tr>
//                         <th>Дата выписки</th>
//                         <th>Лекарство</th>
//                         <th>Дозировка</th>
//                         <th>Врач</th>
//                         <th>Действует до</th>
//                         <th></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {patient.prescriptions.map(prescription => (
//                         <tr key={prescription.id}>
//                           <td>{prescription.issueDate}</td>
//                           <td className="fw-bold">{prescription.medication}</td>
//                           <td>{prescription.dosage}</td>
//                           <td>{prescription.doctor.lastName} {prescription.doctor.firstName}</td>
//                           <td className={new Date(prescription.expiryDate) < new Date() ? 'text-danger' : ''}>
//                             {prescription.expiryDate}
//                             {new Date(prescription.expiryDate) < new Date() && (
//                               <Badge bg="danger" className="ms-2">Просрочен</Badge>
//                             )}
//                           </td>
//                           <td>
//                             <Button 
//                               variant="outline-danger" 
//                               size="sm"
//                               onClick={() => handleViewPrescription(prescription)}
//                             >
//                               Подробнее
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               ) : (
//                 <Alert variant="info">Нет выписанных рецептов</Alert>
//               )}
//             </Card.Body>
//           </Card>
//         </Tab>
//       </Tabs>

//       {/* Модальное окно просмотра рецепта */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Рецепт №{currentPrescription?.id}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {currentPrescription && (
//             <div>
//               <Row className="mb-3">
//                 <Col md={6}>
//                   <h5>Лекарство:</h5>
//                   <p><strong>{currentPrescription.medication}</strong></p>
//                 </Col>
//                 <Col md={6}>
//                   <h5>Дозировка:</h5>
//                   <p>{currentPrescription.dosage}</p>
//                 </Col>
//               </Row>
              
//               <h5>Инструкции:</h5>
//               <p>{currentPrescription.instructions}</p>
              
//               {verificationResult && (
//                 <div className="mt-4 p-3 bg-light rounded">
//                   <p className={verificationResult.valid ? 'text-success' : 'text-danger'}>
//                     <strong>{verificationResult.statusMessage}</strong>
//                   </p>
//                   {currentPrescription.qrCodeBase64 && (
//                     <div className="text-center mt-3">
//                       <img 
//                         src={`data:image/png;base64,${currentPrescription.qrCodeBase64}`} 
//                         alt="QR код рецепта" 
//                         style={{ maxWidth: '200px' }}
//                       />
//                       <p className="text-muted mt-2">Отсканируйте QR-код для проверки рецепта</p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowViewModal(false)}>
//             Закрыть
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }