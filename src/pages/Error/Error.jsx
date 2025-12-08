import { Link } from "react-router-dom";
import "./Error.scss";

const Error = () => {
  return (
    <main className="error-page">
      <div className="error-bg-shape" />

      <h1 className="error-title">404</h1>

      <p className="error-text">
        La page que vous cherchez semble s’être volatilisée.
      </p>

      <Link to="/" className="error-btn">
        Retour à l’accueil
      </Link>
    </main>
  );
};

export default Error;
