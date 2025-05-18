import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, NavDropdown, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const getRoleFromToken = (decoded) => {
  // Проверяем разные варианты хранения ролей
  if (decoded.roles && decoded.roles.length > 0) {
    return decoded.roles[0].replace('ROLE_', '');
  }
  if (decoded.authorities && decoded.authorities.length > 0) {
    return decoded.authorities[0].replace('ROLE_', '');
  }
  if (decoded.role) {
    return decoded.role.replace('ROLE_', '');
  }
  return null;
};

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
    isLoading: true
  });
  const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      let decoded; // Объявляем decoded здесь

      if (token) {
        try {
          decoded = jwtDecode(token);
          console.log('Decoded token:', decoded); // Для отладки
          const role = getRoleFromToken(decoded);
          
          setAuthState({
            isAuthenticated: true,
            userRole: role,
            isLoading: false
          });

          const isDoctorFromToken = decoded.roles?.includes('ROLE_DOCTOR');
          setIsDoctor(isDoctorFromToken);

        } catch (err) {
          console.error('Token decode error:', err);
          localStorage.removeItem('token');
          setAuthState({
            isAuthenticated: false,
            userRole: null,
            isLoading: false
          });
          setIsDoctor(false);
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setIsDoctor(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (token) => {
  localStorage.setItem('token', token);
  const decoded = jwtDecode(token);
  console.log('Decoded token on login:', decoded);
  const role = getRoleFromToken(decoded);
  
  console.log('Role after extraction:', role); // Добавьте эту строку
  
  const isDoctor = decoded.roles?.includes('ROLE_DOCTOR');
  setIsDoctor(isDoctor);

  setAuthState({
    isAuthenticated: true,
    userRole: role,
    isLoading: false
  });
  navigate('/');
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      userRole: null,
      isLoading: false
    });
    navigate('/');
  };

  console.log('AuthState in ProfilePage:', authState);
  console.log('User role:', authState?.userRole);
  console.log('Is doctor:', authState?.userRole === 'DOCTOR' || authState?.userRole === 'ROLE_DOCTOR');

  if (authState.isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <>
      <Navbar expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <i className="bi bi-heart-pulse text-danger me-2"></i>
            buff<span className="text-danger">HP</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Главная</Nav.Link>
              {authState.isAuthenticated && (authState.userRole === 'ADMIN' || authState.userRole === 'DOCTOR') && (
                <Nav.Link as={Link} to="/patients">Пациенты</Nav.Link>
              )}
              <Nav.Link as={Link} to="/about">О клинике</Nav.Link>
            </Nav>
            <Nav>
              {authState.isAuthenticated ? (
                <NavDropdown
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {authState.userRole === 'DOCTOR' ? 'Доктор' : 
                       authState.userRole === 'ADMIN' ? 'Админ' : 'Пациент'}
                    </span>
                  }
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Мой профиль
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Выйти
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Button
                    variant="outline-danger"
                    as={Link}
                    to="/auth?tab=login"
                    className="me-2"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Вход
                  </Button>
                  <Button
                    variant="danger"
                    as={Link}
                    to="/auth?tab=register"
                  >
                    <i className="bi bi-person-plus me-1"></i>
                    Регистрация
                  </Button>
                </>
              )}
              <Button variant="danger" className="ms-2">
                <i className="bi bi-telephone me-1"></i> Запись
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-4 mb-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          {/* Исправленный маршрут с передачей authState */}
          <Route 
            path="/patients/:id" 
            element={<ProfilePage authState={authState} />} 
          />
        </Routes>
      </Container>

      <footer className="bg-light border-2 py-3 mt-4">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">© {new Date().getFullYear()} buffHP Медицинский центр</p>
            <div>
              <a href="#" className="text-dark me-3"><i className="bi bi-telephone"></i> 8 (800) 123-45-67</a>
              <a href="#" className="text-dark"><i className="bi bi-geo-alt"></i> г. Саратов</a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default App;