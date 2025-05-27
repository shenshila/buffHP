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
  Badge
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
  FaSearch
} from "react-icons/fa";

export default function HomePage({ authState }) {
    return <div>
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">
                Современная система управления медицинскими данными
              </h1>
              <p className="lead mb-4">
                Эффективное решение для врачей и пациентов. Удобный доступ к медицинским записям, 
                онлайн-консультации и электронные рецепты.
              </p>
              <div className="d-flex gap-3">
                {!authState.isAuthenticated && (
                  <>
                    <Button variant="danger" size="lg" as={Link} to="/auth?tab=register">
                      Начать сейчас
                    </Button>
                    <Button variant="outline-danger" size="lg" as={Link} to="/about">
                      Узнать больше
                    </Button>
                  </>
                )}
                {authState.isAuthenticated && (
                  <Button variant="danger" size="lg" as={Link} to={authState.userRole === "DOCTOR" ? "/patients" : "/chat"}>
                    {authState.userRole === "DOCTOR" ? "Мои пациенты" : "Медпомощь"}
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <img 
                // src="https://via.placeholder.com/600x400" 
                src="/1.jpg"
                // src="/pexels-tara-winstead-7722914.jpg"
                alt="Медицинская система" 
                className="img-fluid rounded shadow"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Наши возможности</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper bg-danger bg-opacity-10 text-danger rounded-circle p-3 mb-3 mx-auto">
                    <FaUserMd size={24} />
                  </div>
                  <h4>Для врачей</h4>
                  <ul className="text-start mt-3">
                    <li>Управление пациентами</li>
                    <li>Электронные медицинские карты</li>
                    <li>Выписка рецептов</li>
                    <li>Расписание приёмов</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper bg-danger bg-opacity-10 text-danger rounded-circle p-3 mb-3 mx-auto">
                    <FaUserInjured size={24} />
                  </div>
                  <h4>Для пациентов</h4>
                  <ul className="text-start mt-3">
                    <li>Доступ к своей медкарте</li>
                    <li>Чат с врачом</li>
                    <li>История посещений</li>
                    <li>Электронные рецепты</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper bg-danger bg-opacity-10 text-danger rounded-circle p-3 mb-3 mx-auto">
                    <FaClinicMedical size={24} />
                  </div>
                  <h4>Для клиники</h4>
                  <ul className="text-start mt-3">
                    <li>Цифровизация документов</li>
                    <li>Аналитика и отчёты</li>
                    <li>Интеграция с оборудованием</li>
                    <li>Безопасное хранение данных</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Как это работает</h2>
          <Row className="g-4">
            <Col md={3} className="text-center">
              <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                1
              </div>
              <h5>Регистрация</h5>
              <p>Создайте аккаунт как врач или пациент</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                2
              </div>
              <h5>Заполнение данных</h5>
              <p>Внесите необходимую информацию в профиль</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                3
              </div>
              <h5>Использование</h5>
              <p>Полный доступ ко всем функциям системы</p>
            </Col>
            <Col md={3} className="text-center">
              <div className="step-number bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                4
              </div>
              <h5>Взаимодействие</h5>
              <p>Врачи и пациенты могут эффективно работать вместе</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5 fw-bold">Отзывы</h2>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src="https://via.placeholder.com/50" 
                      alt="Доктор" 
                      className="rounded-circle me-3"
                    />
                    <div>
                      <h6 className="mb-0">Мелехов Андрей</h6>
                      <small className="text-muted">Главный врач</small>
                    </div>
                  </div>
                  <p className="mb-0">
                    "Система значительно упростила мою работу с пациентами. 
                    Теперь все данные доступны в одном месте, а электронные 
                    рецепты экономят массу времени."
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src="https://via.placeholder.com/50" 
                      alt="Пациент" 
                      className="rounded-circle me-3"
                    />
                    <div>
                      <h6 className="mb-0">Владислав Ермаков</h6>
                      <small className="text-muted">Пациент</small>
                    </div>
                  </div>
                  <p className="mb-0">
                    "Очень удобно иметь доступ ко всем своим медицинским 
                    данным и рецептам в одном месте. А онлайн-консультации 
                    с врачом - это просто спасение!"
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="bg-danger text-white py-5">
        <Container className="text-center">
          <h2 className="mb-4">Готовы начать?</h2>
          <p className="lead mb-4">
            Присоединяйтесь к тысячам врачей и пациентов, которые уже используют нашу систему
          </p>
          <Button variant="light" size="lg" className="px-4" as={Link} to={authState.isAuthenticated ? "/profile" : "/auth?tab=register"}>
            {authState.isAuthenticated ? "Мой профиль" : "Начать сейчас"}
          </Button>
        </Container>
      </section>
  </div>;
  }