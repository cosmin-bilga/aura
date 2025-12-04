import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import "./Register.scss";

const strictEmailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// URL des APIs de login
const PROVIDER_LOGIN_API_URL = "/api/provider_connect/index.php";
const CUSTOMER_LOGIN_API_URL = "/api/customer_connect/index.php";
const ADMIN_LOGIN_API_URL = "/api/admin_connect/index.php";

const Login = () => {
  const [role, setRole] = useState("provider"); // provider | customer | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    // Choix de l’URL en fonction du rôle sélectionné
    let loginUrl = "";
    if (role === "provider") {
      loginUrl = PROVIDER_LOGIN_API_URL;
    } else if (role === "customer") {
      loginUrl = CUSTOMER_LOGIN_API_URL;
    } else if (role === "admin") {
      loginUrl = ADMIN_LOGIN_API_URL;
    }

    try {
      const formBody = new URLSearchParams();
      formBody.append("email", email);
      formBody.append("password", password);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: formBody.toString(),
      });

      const rawText = await response.text();
      console.log(
        `Réponse API login (${role}) :`,
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.warn("Réponse non-JSON (probable erreur PHP):", rawText);
      }

      // Succès attendu : 202 + { token: "...", message: "User logged in" } ou "Admin logged in"
      if (response.status === 202 && data && data.token) {
        const authData = {
          token: data.token,
          user: {
            email,
            role, // "provider" | "customer" | "admin"
          },
        };

        // On stocke dans le contexte
        login(authData);

        // Redirection selon le rôle
        if (role === "provider") {
          navigate("/prestataire/dashboard");
        } else if (role === "customer") {
          navigate("/profil"); // adapte si tu as un autre chemin pour le client
        } else if (role === "admin") {
          navigate("/admin/dashboard"); // adapte selon ta route admin
        }

        setLoading(false);
        return;
      }

      // Erreurs métier renvoyées en JSON (ex : Login not found, Wrong password)
      if (data && data.message) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage(
          "Erreur serveur côté API. Vois avec le back-end."
        );
      }

      setLoading(false);
    } catch (error) {
      console.error("Erreur réseau lors de la connexion :", error);
      setErrorMessage(
        "Erreur réseau ou serveur. Merci de réessayer plus tard."
      );
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
            Accédez à votre espace client, prestataire ou administrateur avec vos identifiants.
          </p>
        </div>
      </section>

      <section className="register-section">
        <div className="register-card">
          <div className="register-card__section-title">Connexion</div>

          {/* Choix du rôle */}
          <div className="register-card__grid">
            <label className="register-field">
              <span className="register-field__label">
                Me connecter en tant que :
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="customer">Client</option>
                <option value="provider">Prestataire</option>
                <option value="admin">Administrateur</option>
              </select>
            </label>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
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
            Créez votre compte pour réserver des services ou proposer vos prestations.
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
