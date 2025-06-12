import { useEffect, useState, useCallback } from "react"; 
import { Container, Card, Spinner, Tab, Tabs } from "react-bootstrap";
import userApi from "../api/userApi";
import DoctorProfile from "../components/DoctorProfile";
import PatientProfile from "../components/PatientProfile";

const UserProfile = ({ authState }) => {
  // Получаем authState как prop
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); 

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getCurrentUserProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(err.message || 'Не удалось загрузить профиль пользователя');
      setProfile(null); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
      {authState.userRole === "DOCTOR" ? (
        <DoctorProfile profile={profile} refreshProfile={fetchProfile} />
      ) : (
        <PatientProfile profile={profile} refreshProfile={fetchProfile} />
      )}
    </Container>
  );
};

export default UserProfile;