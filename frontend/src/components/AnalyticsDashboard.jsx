import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import {
    fetchDiseaseTrends,
    fetchTopDiagnoses,
    fetchGenderDistribution,
    fetchAgeDistribution,
    fetchDoctorAppointmentsActivity,
    fetchDoctorPrescriptionsActivity,
} from '../api/analyticsApi'; 
import DiseaseTrendsChart from './charts/DiseaseTrendsChart';
import DiagnosisDistributionChart from './charts/DiagnosisDistributionChart';
// import GenderDistributionChart from './charts/GenderDistributionChart';
// import AgeDistributionChart from './charts/AgeDistributionChart';
// import DoctorActivityChart from './charts/DoctorActivityChart';

const AnalyticsDashboard = () => {
    const [startDate, setStartDate] = useState('2023-01-01'); 
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]); 
    const [diseaseTrendsData, setDiseaseTrendsData] = useState([]);
    const [topDiagnosesData, setTopDiagnosesData] = useState([]);
    const [genderDistributionData, setGenderDistributionData] = useState([]);
    const [ageDistributionData, setAgeDistributionData] = useState([]);
    const [doctorAppointmentsData, setDoctorAppointmentsData] = useState([]);
    const [doctorPrescriptionsData, setDoctorPrescriptionsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                diseaseTrends,
                topDiagnoses,
                genderDistribution,
                ageDistribution,
                doctorAppointments,
                doctorPrescriptions,
            ] = await Promise.all([
                fetchDiseaseTrends(startDate, endDate),
                fetchTopDiagnoses(startDate, endDate),
                // fetchGenderDistribution(),
                // fetchAgeDistribution(),
                // fetchDoctorAppointmentsActivity(startDate, endDate),
                // fetchDoctorPrescriptionsActivity(startDate, endDate),
            ]);

            setDiseaseTrendsData(diseaseTrends);
            setTopDiagnosesData(topDiagnoses);
            setGenderDistributionData(genderDistribution);
            setAgeDistributionData(ageDistribution);
            setDoctorAppointmentsData(doctorAppointments);
            setDoctorPrescriptionsData(doctorPrescriptions);

        } catch (err) {
            setError('Ошибка при загрузке данных аналитики: ' + err.message);
            console.error('Ошибка в AnalyticsDashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]); // Перезагружаем данные при изменении дат

    const handleApplyFilters = (e) => {
        e.preventDefault();
        fetchData();
    };

    if (loading) return <Container className="mt-4"><p>Загрузка данных...</p></Container>;
    if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Панель Аналитики</h2>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Фильтры по дате</Card.Title>
                            <Form onSubmit={handleApplyFilters}>
                                <Row>
                                    <Col md={5}>
                                        <Form.Group controlId="startDate">
                                            <Form.Label>Начальная дата</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={5}>
                                        <Form.Group controlId="endDate">
                                            <Form.Label>Конечная дата</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2} className="d-flex align-items-end">
                                        <Button variant="primary" type="submit" className="w-100">
                                            Применить
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Динамика Заболеваемости</Card.Title>
                            <DiseaseTrendsChart data={diseaseTrendsData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Топ Диагнозов</Card.Title>
                            <DiagnosisDistributionChart data={topDiagnosesData} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AnalyticsDashboard;


// <Col lg={6} className="mb-4">
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Распределение по Полу</Card.Title>
//                             {/* <GenderDistributionChart data={genderDistributionData} /> */}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={6} className="mb-4">
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Возрастное Распределение</Card.Title>
//                             {/* <AgeDistributionChart data={ageDistributionData} /> */}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={6} className="mb-4">
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Активность Докторов (Приемы)</Card.Title>
//                             {/* <DoctorActivityChart data={doctorAppointmentsData} type="appointments" /> */}
//                         </Card.Body>
//                     </Card>
//                 </Col>
//                 <Col lg={6} className="mb-4">
//                     <Card>
//                         <Card.Body>
//                             <Card.Title>Активность Докторов (Рецепты)</Card.Title>
//                             {/* <DoctorActivityChart data={doctorPrescriptionsData} type="prescriptions" /> */}
//                         </Card.Body>
//                     </Card>
//                 </Col>