import React from 'react';

const ApartmentDropdown = ({ apartments, selectedApartment, setSelectedApartment }) => (
  <select
    value={selectedApartment}
    onChange={(e) => setSelectedApartment(e.target.value)}
    className="form-input"
  >
    <option value="">Select Apartment</option>
    {apartments.map((apt) => (
      <option key={apt.id} value={apt.name}>{apt.name}</option>
    ))}
  </select>
);

export default ApartmentDropdown;
