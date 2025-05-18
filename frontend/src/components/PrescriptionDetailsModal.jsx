import { Modal, Button, Image } from 'react-bootstrap';

export default function PrescriptionDetailsModal({ prescription, show, onHide }) {
  if (!prescription) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Рецепт: {prescription.medication}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-6">
            <h5>Информация о рецепте</h5>
            <p><strong>Лекарство:</strong> {prescription.medication}</p>
            <p><strong>Дозировка:</strong> {prescription.dosage}</p>
            <p><strong>Инструкции:</strong> {prescription.instructions}</p>
            <p><strong>Выписан:</strong> {new Date(prescription.issueDate).toLocaleDateString()}</p>
            <p><strong>Действителен до:</strong> {new Date(prescription.expiryDate).toLocaleDateString()}</p>
            <p><strong>Врач:</strong> {prescription.doctor.firstName} {prescription.doctor.lastName}</p>
          </div>
          <div className="col-md-6 text-center">
            <h5>QR-код для проверки</h5>
            {prescription.qrCodeBase64 && (
              <Image 
                src={`data:image/png;base64,${prescription.qrCodeBase64}`} 
                alt="QR код рецепта" 
                fluid 
                className="mb-3"
              />
            )}
            <p className="text-muted">
              <small>Используйте этот код для проверки рецепта в аптеке</small>
            </p>
            <Button 
              variant="outline-primary" 
              onClick={() => window.open(prescription.verificationUrl, '_blank')}
            >
              Проверить рецепт
            </Button>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
}