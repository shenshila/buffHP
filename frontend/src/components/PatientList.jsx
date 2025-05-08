import React from 'react';
import PatientCard from './PatientCard';

const PatientList = ({ patients }) => {
  return (
    <div className="patients-list">
      {patients.length > 0 ? (
        patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))
      ) : (
        <p>No patients found</p>
      )}
    </div>
  );
};

export default PatientList;