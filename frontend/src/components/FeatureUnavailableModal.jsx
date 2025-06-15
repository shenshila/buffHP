import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa'; // Иконка для наглядности

const FeatureUnavailableModal = ({ show, handleClose, featureName = 'Этот функционал' }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">
          <FaTools className="me-2" /> {featureName} находится в разработке
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Мы активно работаем над тем, чтобы предоставить вам эту возможность. Пожалуйста, зайдите позже!</p>
        <p className="text-muted">Спасибо за ваше терпение.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeatureUnavailableModal;