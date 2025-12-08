import { Link } from "react-router-dom";
import ServiceDropdown from "../ServiceDropdown/ServiceDropdown";
import HeaderLogo from "../HeaderLogo/HeaderLogo";

export default function HeaderNav({ navLinks, isLoggedIn, logout }) {
  const renderLink = (link) => (
    <Link key={link.label} to={link.href}>
      {link.label}
    </Link>
  );

  return (
    <>
      <div className="aura-header__side aura-header__side--left">
        <nav className="aura-header__nav aura-header__nav--left">
          {renderLink(navLinks[0])}
          <ServiceDropdown className="nav-item" />
        </nav>
      </div>
      <HeaderLogo />
      <div className="aura-header__side aura-header__side--right">
        <nav className="aura-header__nav aura-header__nav--right">
          {isLoggedIn ? (
            <>
              <a onClick={logout}>Déconnexion</a>
              {renderLink(navLinks[3])} {/* Nos Offres */}
            </>
          ) : (
            <>
              {renderLink(navLinks[2])} {/* Connexion */}
              {renderLink(navLinks[3])} {/* Nos Offres */}
            </>
          )}
        </nav>
      </div>
    </>
  );
}
