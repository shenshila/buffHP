import { useState, useRef, useEffect } from 'react';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaPaperPlane, FaUserMd, FaUser, FaRobot, FaPlusCircle, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!message.trim()) return;
  
  setIsLoading(true);
  setError(null); // Сбрасываем ошибку перед новым запросом
  const userMessage = message;
  setMessage('');
  
  try {
    // Добавляем сообщение пользователя сразу
    setHistory(prev => [...prev, { type: 'user', text: userMessage }]);
    
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8080/api/chat/symptoms', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: userMessage })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Неизвестная ошибка сервера');
    }

    // const data = await res.json();
    const data = await res.text();

    
    // Добавляем ответ ИИ
    setHistory(prev => [
      ...prev, 
      { 
        type: 'ai', 
        text: data,
        isResponse: true
      },
      { 
        type: 'ai', 
        text: '✅ Ваши симптомы успешно проанализированы и сохранены в вашей медицинской карте для дальнейшего анализа врачом',
        isSystem: true
      }
    ]);
  } catch (err) {
    console.error('Error:', err);
    // Добавляем сообщение об ошибке только в историю, не дублируя через setError
    setHistory(prev => [
      ...prev,
      {
        type: 'ai',
        text: '⚠️ К сожалению, произошла ошибка при обработке ваших симптомов. Пожалуйста, попробуйте позже.',
        isError: true
      }
    ]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="chat-page"
    >
      <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
          <FaUserMd className="text-danger me-3" size={32} />
          <div>
            <h2 className="mb-0">Медицинский помощник</h2>
            <p className="text-muted mb-0">Опишите симптомы для анализа</p>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-danger text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaRobot className="me-2" /> Диалог
            </h5>
            <Button 
              variant="light" 
              size="sm"
              onClick={() => setHistory([])}
            >
              <FaPlusCircle className="me-1" /> Новый чат
            </Button>
          </Card.Header>
          <Card.Body 
            className="chat-messages p-4" 
            style={{ 
              height: '400px', 
              overflowY: 'auto',
              background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
            }}
          >
            {history.length === 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                <FaUserMd className="text-muted mb-3" size={48} />
                <h5 className="text-muted">Начните диалог с помощником</h5>
                <p className="text-muted">Опишите ваши симптомы, и ИИ-ассистент поможет их проанализировать</p>
              </div>
            ) : (
              history.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-3 d-flex ${item.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div 
                    className={`p-3 rounded ${item.type === 'user' 
                      ? 'bg-danger text-white' 
                      : item.isSystem 
                        ? 'bg-success text-white'
                        : item.isError
                          ? 'bg-warning text-dark'
                          : 'bg-light'}`}
                    style={{ 
                      maxWidth: '80%',
                      borderRadius: item.type === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0'
                    }}
                  >
                    <div className="d-flex align-items-center mb-2">
                      {item.type === 'user' ? (
                        <FaUser className="me-2" />
                      ) : item.isSystem ? (
                        <FaCheckCircle className="me-2" />
                      ) : (
                        <FaRobot className="me-2 text-danger" />
                      )}
                      <small className="fw-bold">
                        {item.type === 'user' 
                          ? 'Вы' 
                          : item.isSystem
                            ? 'Система'
                            : 'Медицинский помощник'}
                      </small>
                    </div>
                    <div className="message-text">
                      {item.text.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-2">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="p-3 rounded bg-light" style={{ borderRadius: '18px 18px 18px 0' }}>
                  <div className="d-flex align-items-center">
                    <FaRobot className="me-2 text-danger" />
                    <Spinner animation="border" size="sm" variant="danger" className="me-2" />
                    <small className="fw-bold">Анализируем симптомы...</small>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </Card.Body>
        </Card>

        <Form onSubmit={handleSubmit} className="position-relative">
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Опишите ваши симптомы (например: головная боль, температура 37.5, слабость)..."
              style={{ borderRadius: '12px', paddingRight: '50px' }}
              disabled={isLoading}
            />
            <Button 
              variant="danger" 
              type="submit" 
              disabled={isLoading || !message.trim()}
              className="position-absolute end-0 bottom-0 m-2 rounded-circle"
              style={{ width: '40px', height: '40px' }}
            >
              <FaPaperPlane />
            </Button>
          </Form.Group>
        </Form>

        <style>{`
          .chat-page {
            background-color: #f8f9fa;
            min-height: 100vh;
          }
          
          .chat-messages::-webkit-scrollbar {
            width: 6px;
          }
          
          .chat-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .chat-messages::-webkit-scrollbar-thumb {
            background: #dc3545;
            border-radius: 10px;
          }
          
          .message-text {
            white-space: pre-wrap;
            word-break: break-word;
          }
          
          .system-message {
            background-color: #28a745;
            color: white;
            border-left: 4px solid #218838;
          }
        `}</style>
      </Container>
    </motion.div>
  );
};

export default ChatPage;