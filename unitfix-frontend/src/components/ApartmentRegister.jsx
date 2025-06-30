import { Link } from 'react-router-dom';

const ApartmentRegister = () => {
  return (
    <div className="card">
      <h3>Register Apartment</h3>
<p className="card-desc">Onboard your apartment and start managing issues in one place.</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
  <Link to="/register-apartment" className="gradient-btn">
    Register Apartment
  </Link>
</div>

    </div>
  );
};

export default ApartmentRegister;
