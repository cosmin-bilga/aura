import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import MockData from "../../mocks/data.json";
// import "./Login/Login.css";

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [mockRole, setMockRole] = useState("customer");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !strictEmailRegex.test(value)) {
      setEmailError("Format email invalide (ex : nom@domaine.fr)");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    alert("Connexion en cours...");
    setErrorMessage(null);

    if (emailError) {
      setErrorMessage("Veuillez corriger le format de l'email.");
      setLoading(false);
      return;
    }

    const targetAuthData =
      mockRole === "customer"
        ? MockData.auth.client_success
        : MockData.auth.provider_success;

    const targetEmail = targetAuthData.user.email;
    const testPassword = "1234";

    setTimeout(() => {
      if (email === targetEmail && password === testPassword) {
        login(targetAuthData);

        if (mockRole === "provider") {
          navigate("/prestataire/dashboard");
        } else {
          navigate("/profil");
        }
      } else {
        setErrorMessage(
          `Login échoué. Utilisez l'email affiché / ${testPassword}.`
        );
      }

      setLoading(false);
    }, 1000);
  };

  const globalErrors = [];
  if (emailError) globalErrors.push(emailError);
  if (errorMessage) globalErrors.push(errorMessage);

  return (
    <main className="register-page">
      <section className="register-hero">
        <div className="register-hero__content">
          <h1 className="register-hero__title">Connexion à mon compte Aura</h1>
          <p className="register-hero__subtitle">
            Accédez à votre espace client ou prestataire avec vos identifiants.
          </p>
        </div>
      </section>

      <section className="register-section">
        <div className="register-card">
          <div className="register-card__section-title">Connexion</div>

          <div className="register-card__grid">
            <label className="register-field">
              <span className="register-field__label">
                Simuler la connexion en tant que :
              </span>
              <select
                value={mockRole}
                onChange={(e) =>
                  setMockRole(
                    e.target.value === "customer" ? "customer" : "provider"
                  )
                }
                disabled={loading}
              >
                <option value="customer">
                  Client ({MockData.auth.client_success.user.email} / 1234)
                </option>
                <option value="provider">
                  Prestataire ({MockData.auth.provider_success.user.email} /
                  1234)
                </option>
              </select>
            </label>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            {/* EMAIL */}
            <label className="register-field">
              <span className="register-field__label">Email</span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                required
                disabled={loading}
              />
            </label>

            <label className="register-field">
              <span className="register-field__label">Mot de passe</span>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </label>

            {globalErrors.length > 0 && (
              <div className="register-form__errors">
                <p>Merci de vérifier les points suivants :</p>
                <ul>
                  {globalErrors.map((err, index) => (
                    <li key={`${err}-${index}`}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="register-form__actions">
              <button
                type="submit"
                className="register-btn register-btn--primary"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>
          </form>
        </div>

        <div className="register-card register-card--secondary">
          <div className="register-card__section-title">Nouveau sur Aura ?</div>
          <p className="register-hero__subtitle">
            Créez votre compte selon votre rôle pour accéder rapidement à la
            plateforme.
          </p>

          <div className="register-links">
            <Link
              to="/inscription"
              className="register-btn register-btn--primary register-links__btn"
            >
              M’inscrire
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
