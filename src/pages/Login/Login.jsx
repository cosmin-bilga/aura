import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); 
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [emailError, setEmailError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (emailError) {
      setErrorMessage("Veuillez corriger le format de l'email.");
      setLoading(false);
      return;
    }

    try {
      
      const loginUrl =
        role === "customer"
          ? "/api/customer_connect/index.php"
          : "/api/provider_connect/index.php";

      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        body: formData,
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok || !loginData.token) {
        throw new Error(loginData.message || "Échec de la connexion");
      }

      const backendRole =
        (loginData.user && loginData.user.role) || loginData.role;
      const finalRole = backendRole || role || "customer";

      const token = loginData.token;
      const user = {
        ...loginData.user,
        role: finalRole, 
      };

      console.log("✅ Login successful:", { token, user });

     
      login({
        token: token,
        user: user,
      });

     
      navigate(`/dashboard/${finalRole}`);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
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
              <span className="register-field__label">Je suis :</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="customer">Client</option>
                <option value="provider">Prestataire</option>
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
                placeholder="votre@email.com"
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
                placeholder="Votre mot de passe"
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
