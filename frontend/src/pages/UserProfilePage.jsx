import { useEffect, useState } from 'react';
import { Container, Card, Spinner, Tab, Tabs } from 'react-bootstrap';
import userApi from '../api/userApi';
import DoctorProfile from '../components/DoctorProfile';
import PatientProfile from '../components/PatientProfile';

const UserProfile = ({ authState }) => { // Получаем authState как prop
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userApi.getCurrentUserProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Личный кабинет</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="profile" title="Профиль">
          <Card className="mt-3">
            <Card.Body>
              {authState.userRole === 'DOCTOR' ? ( // Используем authState.userRole
                <DoctorProfile profile={profile} />
              ) : (
                <PatientProfile profile={profile} />
              )}
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="appointments" title="Мои записи">
          <Card className="mt-3">
            <Card.Body>
              {/* Компонент с записями */}
              <p>Список ваших записей</p>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserProfile;