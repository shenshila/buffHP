const DoctorProfile = ({ profile }) => {
  console.log('Doctor profile data:', profile);
  return (
    <div>
      <h4>Профиль врача</h4>
      <div className="row mt-4">
        <div className="col-md-6">
          <p><strong>ФИО:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Специализация:</strong> {profile.specialization}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Телефон:</strong> {profile.phoneNumber || 'не указан'}</p>
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

export default DoctorProfile;