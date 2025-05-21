import { useState } from 'react';
import { Container, Form, Button, Card, Spinner } from 'react-bootstrap';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/chat/symptoms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: message })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      
      setResponse(data);
      setHistory([...history, 
        { type: 'user', text: message },
        { type: 'ai', text: data }
      ]);
      setMessage('');
    } catch (err) {
      console.error('Error:', err);
      setResponse('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Медицинский чат-помощник</h2>
      <Card className="mb-3">
        <Card.Body style={{ height: '300px', overflowY: 'auto' }}>
          {history.length === 0 ? (
            <p className="text-muted">Опишите ваши симптомы...</p>
          ) : (
            history.map((item, index) => (
              <div 
                key={index} 
                className={`mb-3 p-3 rounded ${item.type === 'user' ? 'bg-light' : 'bg-primary text-white'}`}
                style={{ textAlign: item.type === 'user' ? 'right' : 'left' }}
              >
                {item.text}
              </div>
            ))
          )}
          {isLoading && <Spinner animation="border" variant="primary" />}
        </Card.Body>
      </Card>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Опишите ваши симптомы..."
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
        </Button>
      </Form>
    </Container>
  );
};

export default ChatPage;