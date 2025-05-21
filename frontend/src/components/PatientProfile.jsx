const PatientProfile = ({ profile }) => {
  console.log('Patient profile data:', profile);
  return (
    <div>
      <h4>Профиль пациента</h4>
      <div className="row mt-4">
        <div className="col-md-6">
          <p><strong>ФИО:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Дата рождения:</strong> {new Date(profile.birthDate).toLocaleDateString()}</p>
          <p><strong>Пол:</strong> {profile.gender}</p>
          <p><strong>Страховой номер:</strong> {profile.insuranceNumber}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Телефон:</strong> {profile.phone || 'не указан'}</p>
          <p><strong>Адрес:</strong> {profile.address || 'не указан'}</p>
        </div>
        <div className="col-md-6">
          <div className="text-end">
            <button className="btn btn-outline-primary">Редактировать профиль</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;