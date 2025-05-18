import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, InputGroup, Row, Col, Alert } from 'react-bootstrap';
import { searchPatients, filterPatients } from '../api/patientApi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await searchPatients(searchTerm);
      setPatients(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        navigate('/auth?tab=login');
      }
    }
  };

  const handleFilter = async () => {
    setError(null);
    try {
      const data = await filterPatients(
        genderFilter,
        startDate?.toISOString().split('T')[0],
        endDate?.toISOString().split('T')[0]
      );
      setPatients(data);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Unauthorized')) {
        navigate('/auth?tab=login');
      }
    }
  };

  const resetFilters = () => {
    setGenderFilter('');
    setStartDate(null);
    setEndDate(null);
    setPatients([]);
    setError(null);
  };

  return (
    <>
      <h2 className="mb-4">Поиск пациентов</h2>
      
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Введите имя, фамилию или страховой номер"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="danger" type="submit">
            <i className="bi bi-search"></i> Найти
          </Button>
        </InputGroup>
      </Form>

      <div className="filter-section mb-4 p-3 border rounded">
        <h5>Фильтры</h5>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Пол</Form.Label>
              <Form.Select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="">Все</option>
                <option value="MALE">Мужской</option>
                <option value="FEMALE">Женский</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Дата рождения от</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                placeholderText="Выберите дату"
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Дата рождения до</Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                placeholderText="Выберите дату"
                showYearDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="outline-danger"
              onClick={handleFilter}
              className="me-2"
            >
              Применить
            </Button>
            <Button
              variant="outline-secondary"
              onClick={resetFilters}
            >
              Сбросить
            </Button>
          </Col>
        </Row>
      </div>

      <Table striped hover responsive>
        <thead className="bg-danger text-white">
          <tr className="text-white">
            <th>ФИО</th>
            <th>Дата рождения</th>
            <th>Пол</th>
            <th>Страховой номер</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {patients.length > 0 ? (
            patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.lastName} {patient.firstName}</td>
                <td>{patient.birthDate}</td>
                <td>{patient.gender === 'MALE' ? 'Мужской' : 'Женский'}</td>
                <td>{patient.insuranceNumber}</td>
                <td>
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    onClick={() => navigate(`/patients/${patient.id}`)}
                  >
                  Профиль
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted py-4">
                Пациенты не найдены. Измените параметры поиска.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}