import { useState } from "react";
import { useAuth } from "../../contexts/useAuth";
import HeaderTopbar from "../HeaderTopbar/HeaderTopbar";
import HeaderNav from "../HeaderNav/HeaderNav";
import HeaderOverlay from "../HeaderOverlay/HeaderOverlay";
import "./Header.scss";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Connexion", href: "/connexion" },
  { label: "Nos offres", href: "/offre" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const profileLink = isLoggedIn ? "/" : "/connexion";

  return (
    <>
      <HeaderTopbar profileLink={profileLink} />

      <header className="aura-header__bar">
        <HeaderNav
          navLinks={navLinks}
          isLoggedIn={isLoggedIn}
          logout={logout}
        />

        <button
          type="button"
          className={`aura-header__burger ${
            isMenuOpen ? "aura-header__burger--open" : ""
          }`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <HeaderOverlay
        isOpen={isMenuOpen}
        closeMenu={closeMenu}
        profileLink={profileLink}
        navLinks={navLinks}
        isLoggedIn={isLoggedIn}
        logout={logout}
      />
    </>
  );
}
