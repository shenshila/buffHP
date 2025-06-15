import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Button,
  NavDropdown,
  Spinner,
  Carousel,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import {
  FaHeartbeat,
  FaUserMd,
  FaUserInjured,
  FaCalendarAlt,
  FaClinicMedical,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaNotesMedical,
  FaFilePrescription,
  FaSearch,
  FaUserShield,
} from "react-icons/fa";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import UserProfile from "./pages/UserProfilePage";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import BookAppointmentForm from './components/BookAppointmentForm';
import PrescriptionVerifyPage from './pages/PrescriptionVerifyPage';
import AdminDashboard from './components/AdminDashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const getRoleFromToken = (decoded) => {
    // Проверяем разные варианты хранения ролей
    if (decoded.roles && decoded.roles.length > 0) {
        // Предполагаем, что роли приходят в формате ["ROLE_ADMIN", "ROLE_DOCTOR"]
        // Если пользователь имеет несколько ролей, возьмем первую для userRole, но учтем все для ProtectedRoute
        return decoded.roles[0].replace("ROLE_", ""); // Например, вернет "ADMIN" или "DOCTOR"
    }
    if (decoded.authorities && decoded.authorities.length > 0) {
        return decoded.authorities[0].replace("ROLE_", "");
    }
    if (decoded.role) {
        return decoded.role.replace("ROLE_", "");
    }
    return null;
};

const getAllRolesFromToken = (decoded) => {
    const roles = new Set();
    if (decoded.roles && Array.isArray(decoded.roles)) {
        decoded.roles.forEach(role => roles.add(role.replace("ROLE_", "")));
    }
    if (decoded.authorities && Array.isArray(decoded.authorities)) {
        decoded.authorities.forEach(role => roles.add(role.replace("ROLE_", "")));
    }
    if (decoded.role) {
        roles.add(decoded.role.replace("ROLE_", ""));
    }
    return Array.from(roles);
};

function App() {
  const [authState, setAuthState] = useState({
        isAuthenticated: false,
        userRole: null, // Основная роль (например, первая в списке)
        userRoles: [], // Все роли пользователя
        userFullName: null,
        isLoading: true,
    });
  // const [isDoctor, setIsDoctor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      let decoded; // Объявляем decoded здесь

      if (token) {
        try {
          decoded = jwtDecode(token);
          console.log("Decoded token:", decoded); // Для отладки
          // const role = getRoleFromToken(decoded);
          const mainRole = getRoleFromToken(decoded);
          const allRoles = getAllRolesFromToken(decoded);

          setAuthState({
                        isAuthenticated: true,
                        userRole: mainRole,
                        userRoles: allRoles, // Устанавливаем все роли
                        userFullName: decoded.fullName || "",
                        isLoading: false,
                    });

          // const isDoctorFromToken = decoded.roles?.includes("ROLE_DOCTOR");
          // setIsDoctor(isDoctorFromToken);
        } catch (err) {
          console.error("Token decode error:", err);
                    localStorage.removeItem("token");
                    setAuthState({
                        isAuthenticated: false,
                        userRole: null,
                        userRoles: [],
                        isLoading: false,
                    });
          // console.error("Token decode error:", err);
          // localStorage.removeItem("token");
          // setAuthState({
          //   isAuthenticated: false,
          //   userRole: null,
          //   isLoading: false,
          // });
          // setIsDoctor(false);
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        // setAuthState((prev) => ({ ...prev, isLoading: false }));
        // setIsDoctor(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        console.log("Decoded token on login:", decoded);
        const mainRole = getRoleFromToken(decoded);
        const allRoles = getAllRolesFromToken(decoded);

        setAuthState({
            isAuthenticated: true,
            userRole: mainRole,
            userRoles: allRoles,
            userFullName: decoded.fullName || "",
            isLoading: false,
        });
        navigate("/");
    };

  const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthState({
            isAuthenticated: false,
            userRole: null,
            userRoles: [],
            userFullName: null,
            isLoading: false,
        });
        navigate("/");
    };

  console.log("AuthState in ProfilePage:", authState);
  console.log("User role:", authState?.userRole);
  // console.log(
  //   "Is doctor:",
  //   authState?.userRole === "DOCTOR" || authState?.userRole === "ROLE_DOCTOR"
  // );

  if (authState.isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <>
      {/* Улучшенный Navbar */}
      <Navbar expand="lg" className="py-3 shadow-sm bg-white sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
            <FaHeartbeat className="text-danger me-2" />
            <span className="text-dark">Med</span>
            <span className="text-danger">Care</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" />

          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="fw-medium mx-2">
                Главная
              </Nav.Link>
              {authState.isAuthenticated &&
                (authState.userRole === "ADMIN" ||
                  authState.userRole === "DOCTOR") && (
                  <Nav.Link as={Link} to="/patients" className="fw-medium mx-2">
                    <FaUserInjured className="me-1" /> Пациенты
                  </Nav.Link>
                )}
              {authState.isAuthenticated &&
                authState.userRole === "PATIENT" && (
                  <Nav.Link as={Link} to="/chat" className="fw-medium mx-2">
                    <FaNotesMedical className="me-1" /> Медпомощь
                  </Nav.Link>
                )}
                {authState.isAuthenticated &&
                                authState.userRoles.includes("ADMIN") && ( // Ссылка для админа
                                    <Nav.Link as={Link} to="/admin" className="fw-medium mx-2">
                                        <FaUserShield className="me-1" /> Админ
                                    </Nav.Link>
                                )}
              <Nav.Link as={Link} to="/about" className="fw-medium mx-2">
                <FaClinicMedical className="me-1" /> О клинике
              </Nav.Link>
            </Nav>

            <Nav>
              {authState.isAuthenticated ? (
                <>
                  <Button
                    variant="outline-danger"
                    as={Link}
                    to="/profile"
                    className="me-3"
                  >
                    <FaUserMd className="me-1" /> Личный кабинет
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    Выйти
                  </Button>
                </>
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
                  <Button variant="danger" as={Link} to="/auth?tab=register">
                    <i className="bi bi-person-plus me-1"></i>
                    Регистрация
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes */}
      <Container className="py-4 mb-4">
        <Routes>
          <Route path="/" element={<HomePage authState={authState} />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          <Route
            path="/patients/:id"
            element={<ProfilePage authState={authState} />}
          />
          <Route path="/chat" element={<ChatPage />} />
          <Route
            path="/profile"
            element={<UserProfile authState={authState} />}
          />
          <Route path="/doctor/analytics" element={<AnalyticsDashboard authState={authState}/>} />
          <Route path="/patient/book-appointment" element={<BookAppointmentForm authState={authState}/>} />
          <Route path="/verify/:code" element={<PrescriptionVerifyPage />} />
          <Route path="/admin" element={
                        <ProtectedRoute authState={authState} allowedRoles={["ROLE_ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
        </Routes>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h5 className="mb-3">
                <FaHeartbeat className="text-danger me-2" />
                <span>Med</span>
                <span className="text-danger">Care</span>
              </h5>
              <p>
                Современная система управления медицинскими данными для врачей и
                пациентов.
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <h5 className="mb-3">Контакты</h5>
              <p>
                <FaPhoneAlt className="me-2" /> 8 (800) 123-45-67
              </p>
              <p>
                <FaMapMarkerAlt className="me-2" /> г. Саратов, ул. Медицинская,
                1
              </p>
              <p>
                <FaClock className="me-2" /> Пн-Пт: 8:00 - 18:00
              </p>
            </Col>
            <Col md={4} className="mb-4">
              <h5 className="mb-3">Быстрые ссылки</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/" className="text-white p-0 mb-2">
                  Главная
                </Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-white p-0 mb-2">
                  О клинике
                </Nav.Link>
                <Nav.Link as={Link} to="/auth" className="text-white p-0 mb-2">
                  Вход/Регистрация
                </Nav.Link>
              </Nav>
            </Col>
          </Row>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0">
              © {new Date().getFullYear()} MedCare. Все права защищены.
            </p>
          </div>
        </Container>
      </footer>
    </>
  );
}

export default App;
