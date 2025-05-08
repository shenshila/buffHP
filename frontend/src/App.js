import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    patients: [],
    searchKeyword: '',
    insuranceNumber: '',
    currentPatient: null
  };

  // Поиск пациентов по ключевому слову
  searchPatients = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/patients/search?keyword=${this.state.searchKeyword}`);
      const data = await response.json();
      this.setState({ patients: data });
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  // Поиск пациента по номеру страховки
  findPatientByInsurance = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/patients/insurance/${this.state.insuranceNumber}`);
      const data = await response.json();
      this.setState({ currentPatient: data });
    } catch (error) {
      console.error('Error finding patient by insurance:', error);
      this.setState({ currentPatient: null });
    }
  };

  handleSearchChange = (e) => {
    this.setState({ searchKeyword: e.target.value });
  };

  handleInsuranceChange = (e) => {
    this.setState({ insuranceNumber: e.target.value });
  };

  render() {
    const { patients, searchKeyword, insuranceNumber, currentPatient } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Patient Management System</h1>
          
          {/* Поиск по имени/фамилии */}
          <div className="search-section">
            <h2>Search Patients</h2>
            <input
              type="text"
              value={searchKeyword}
              onChange={this.handleSearchChange}
              placeholder="Enter name or surname"
            />
            <button onClick={this.searchPatients}>Search</button>
            
            <div className="patients-list">
              {patients.map(patient => (
                <div key={patient.id} className="patient-card">
                  <p>Name: {patient.firstName} {patient.lastName}</p>
                  <p>Birth Date: {patient.birthDate}</p>
                  <p>Insurance: {patient.insuranceNumber}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Поиск по страховому номеру */}
          <div className="insurance-search">
            <h2>Find by Insurance Number</h2>
            <input
              type="text"
              value={insuranceNumber}
              onChange={this.handleInsuranceChange}
              placeholder="Enter insurance number"
            />
            <button onClick={this.findPatientByInsurance}>Find</button>
            
            {currentPatient && (
              <div className="patient-card">
                <h3>Patient Found</h3>
                <p>Name: {currentPatient.firstName} {currentPatient.lastName}</p>
                <p>Birth Date: {currentPatient.birthDate}</p>
                <p>Gender: {currentPatient.gender}</p>
                <p>Phone: {currentPatient.phoneNumber}</p>
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
