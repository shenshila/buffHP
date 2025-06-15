import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { register } from '../api/authApi';
import "../css/RegisterForm.css";

const DOCTOR_SPECIALIZATIONS = [
  "Терапевт",
  "Педиатр",
  "Кардиолог",
  "Дерматолог",
  "Эндокринолог",
  "Гастроэнтеролог",
  "Хирург",
  "Ортопед",
  "Офтальмолог",
  "Отоларинголог (ЛОР)",
  "Невролог",
  "Психиатр",
  "Уролог",
  "Гинеколог",
  "Стоматолог",
  "Аллерголог-иммунолог",
  "Инфекционист",
  "Онколог",
  "Пульмонолог",
  "Ревматолог",
  "Нефролог",
  "Физиотерапевт",
  "Мануальный терапевт",
  "Остеопат",
  "Диетолог",
  "Сексолог",
  "Флеболог",
  "Проктолог",
  "Анестезиолог-реаниматолог",
  "Венеролог",
  "Гепатолог",
  "Гематолог",
  "Гериатр",
  "Иглорефлексотерапевт",
  "Косметолог",
  "Лаборант",
  "Нарколог",
  "Неонатолог",
  "Патологоанатом",
  "Радиолог",
  "Судмедэксперт",
  "Токсиколог",
  "Трансфузиолог",
  "Травматолог",
  "Трихолог",
  "Фтизиатр",
  "Эмбриолог",
  "Эпидемиолог",
  "Генетик"
];

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    middleName: '',
    role: 'ROLE_PATIENT',
    // Поля пациента
    // middleName: '',
    birthDate: '',
    gender: '',
    address: '',
    insuranceNumber: '',
    // Поля доктора
    specialization: '',
    phone: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Логика для специализации
    if (name === 'specialization' && formData.role === 'ROLE_DOCTOR') {
      if (value.length > 0) {
        const filteredSuggestions = DOCTOR_SPECIALIZATIONS.filter(spec =>
          spec.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      specialization: suggestion
    }));
    setSuggestions([]); // Очищаем подсказки после выбора
    setShowSuggestions(false); // Скрываем список
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают.');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        ...formData,
        birthDate: formData.role === 'ROLE_PATIENT' ? formData.birthDate : null,
        insuranceNumber: formData.role === 'ROLE_PATIENT' ? formData.insuranceNumber : null,
        specialization: formData.role === 'ROLE_DOCTOR' ? formData.specialization : null,
        phone: formData.role === 'ROLE_DOCTOR' ? formData.phone : null
      };

      if (formData.role === 'ROLE_PATIENT') {
        requestData.middleName = formData.middleName;
        requestData.birthDate = formData.birthDate;
        requestData.gender = formData.gender;
        requestData.address = formData.address;
        requestData.insuranceNumber = formData.insuranceNumber;
      } else if (formData.role === 'ROLE_DOCTOR') {
        requestData.specialization = formData.specialization;
      }

      await register(requestData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-3 text-center">
        <Alert variant="success">
          <h4>Регистрация успешна!</h4>
          <p>Теперь вы можете войти в систему.</p>
        </Alert>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Имя</Form.Label>
            <Form.Control
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Фамилия</Form.Label>
            <Form.Control
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {formData.role === 'ROLE_PATIENT' && (
        <Form.Group className="mb-3">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Телефон</Form.Label>
        <Form.Control
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required // Телефон, вероятно, обязателен для всех
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Пароль</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Повторите пароль</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          isInvalid={formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword} // Визуальная индикация несовпадения
        />
        <Form.Control.Feedback type="invalid">
          Пароли не совпадают!
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Роль</Form.Label>
        <Form.Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="ROLE_PATIENT">Пациент</option>
          <option value="ROLE_DOCTOR">Доктор</option>
        </Form.Select>
      </Form.Group>

      {/* Поля для пациента */}
      {formData.role === 'ROLE_PATIENT' && (
        <>
          {/* <Form.Group className="mb-3">
            <Form.Label>Отчество</Form.Label>
            <Form.Control
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </Form.Group> */}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Дата рождения</Form.Label>
                <Form.Control
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Пол</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите пол</option>
                  <option value="MALE">Мужской</option>
                  <option value="FEMALE">Женский</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Адрес</Form.Label>
            <Form.Control
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Страховой номер</Form.Label>
            <Form.Control
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </>
      )}

      {/* Поля для доктора */}
{formData.role === 'ROLE_DOCTOR' && (
  <>
    <Form.Group className="mb-3 position-relative"> {/* Добавляем position-relative для позиционирования подсказок */}
      <Form.Label>Специализация</Form.Label>
      <Form.Control
        name="specialization"
        value={formData.specialization}
        onChange={handleChange}
        required
        onFocus={() => { // Показываем подсказки при фокусе, если что-то уже введено
          if (formData.specialization.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Скрываем подсказки при потере фокуса, с задержкой
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list"> {/* Будет стилизован в CSS */}
          {suggestions.map((s, index) => (
            <li key={index} onMouseDown={() => handleSelectSuggestion(s)}> {/* Используем onMouseDown, чтобы избежать потери фокуса */}
              {s}
            </li>
          ))}
        </ul>
      )}
    </Form.Group>
  </>
)}

      <Button
        variant="danger"
        type="submit"
        className="w-100 mt-3"
        disabled={loading || (formData.password !== formData.confirmPassword)}
      >
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
    </Form>
  );
}