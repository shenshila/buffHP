import { useState } from 'react';
import { Tabs, Tab, Container, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import '../css/AuthPage.css';

export default function AuthPage({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'login';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    navigate(`?tab=${tab}`, { replace: true });
  };

  const handleRegisterSuccess = () => {
    setSuccessMessage('Регистрация прошла успешно! Теперь вы можете войти.');
    setActiveTab('login');
    navigate('?tab=login', { replace: true });
  };

  return (
    <Container className="auth-container py-5">
      <div className="auth-card shadow-lg">
        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
            {successMessage}
          </Alert>
        )}
        
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="mb-3 auth-tabs"
        >
          <Tab eventKey="login" title="Вход">
            <LoginForm onLogin={onLogin} />
          </Tab>
          <Tab eventKey="register" title="Регистрация">
            <RegisterForm onSuccess={handleRegisterSuccess} />
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
}