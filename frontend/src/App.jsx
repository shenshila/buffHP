import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Мы добавим кастомные стили

function App() {
  return (
    <Router>
      {/* Навигационное меню в красном стиле */}
      <Navbar expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <i className="bi bi-heart-pulse text-danger me-2"></i>
            buff<span className='text-danger'>HP</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Главная</Nav.Link>
              <Nav.Link as={Link} to="/patients">Пациенты</Nav.Link>
              <Nav.Link as={Link} to="/about">О клинике</Nav.Link>
            </Nav>
            <Nav>
              <Button variant="danger" className="me-2">
                <i className="bi bi-telephone me-1"></i> Запись
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Основное содержимое */}
      <Container className="py-4 mb-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Container>

      {/* Футер */}
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
    </Router>
  );
}

export default App;