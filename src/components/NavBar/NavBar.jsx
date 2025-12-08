// import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>
      <Link to="/services">Services</Link>
      <Link to="/connexion">Login</Link>
      <Link to="/offre">Nos offres</Link>
    </nav>
  );
};

// export default NavBar;
