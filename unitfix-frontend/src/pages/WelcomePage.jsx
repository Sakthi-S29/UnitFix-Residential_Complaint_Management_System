import '../styles/Welcome.css';
import TenantLogin from '../components/TenantSignup';
import ApartmentRegister from '../components/ApartmentRegister';
import FeatureShowcase from '../components/FeatureShowcase';
import Header from '../components/Header';
import TenantSignup from '../components/TenantSignup';
const WelcomePage = () => {
  return (
    <>
      <Header />
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    <div className="welcome-wrapper">
      <header className="welcome-header">
        <h1>Welcome to <span className="brand">UnitFix</span></h1>
        <p>Your all-in-one apartment complaint management solution</p>
      </header>

      <section className="action-cards">
        <TenantSignup />
        <ApartmentRegister />
      </section>

      <section className="features-section">
        <FeatureShowcase />
</section>

    </div>
    </div>
    </>
  );
};

export default WelcomePage;
