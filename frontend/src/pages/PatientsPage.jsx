import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { searchPatients } from '../api/patientApi';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const data = await searchPatients(searchTerm);
    setPatients(data);
  };

  return (
    <>
      <h2 className="mb-4">Поиск пациентов</h2>
      
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

      <Table striped hover>
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Дата рождения</th>
            <th>Страховой номер</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.lastName} {patient.firstName}</td>
              <td>{patient.birthDate}</td>
              <td>{patient.insuranceNumber}</td>
              <td>
                <Button 
                  variant="danger"
                  size="sm"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  Профиль
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}