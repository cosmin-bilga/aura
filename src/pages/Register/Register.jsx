import RegisterForm from "../../components/RegisterForm/RegisterForm";
import "./Register.scss";

const Register = () => (
  <main className="register-page">
    <section className="register-hero">
      <div className="register-hero__content">
        <h1 className="register-hero__title">Créer mon compte Aura</h1>
        <p className="register-hero__subtitle">
          En quelques étapes, créez un espace sécurisé pour réserver des
          services ou proposer vos prestations.
        </p>
      </div>
    </section>

    <section className="register-section">
      <div className="register-card">
        <RegisterForm />
      </div>
    </section>
  </main>
);

export default Register;
