import React from 'react';
import { ListGroup } from 'react-bootstrap';

const PatientCard = ({ patient }) => {
  return (
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
        <strong>Страховой номер:</strong> {patient.insuranceNumber}
      </ListGroup.Item>
      {patient.phoneNumber && (
        <ListGroup.Item>
          <strong>Телефон:</strong> {patient.phoneNumber}
        </ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default PatientCard;