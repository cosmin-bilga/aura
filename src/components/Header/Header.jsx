// src/components/layout/Header.jsx
import { useState } from "react";
import "./Header.scss";
import logoAura from "../../assets/logo_aura.png";
import whiteAura from "../../assets/logo_aura_white.png";
import peopleIcon from "../../assets/icons/people.svg";
import peopleIconHover from "../../assets/icons/people_h.svg";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Connexion", href: "/connexion" },
  { label: "Inscription", href: "/inscription" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="aura-header">
        {/* TOPBAR (desktop uniquement) */}
        <div className="aura-header__topbar">
          <div className="aura-header__topbar-inner">
            <div className="aura-header__topbar-left" />

            {/* Icône profil → lien vers /profil */}
            <a
              href="/profil"
              className="aura-header__topbar-profile"
              aria-label="Accéder à mon profil"
            >
              {/* Icône par défaut */}
              <img
                className="aura-header__topbar-profile-icon aura-header__topbar-profile-icon--default"
                src={peopleIcon}
                alt="Profil"
              />
              {/* Icône au hover (desktop) */}
              <img
                className="aura-header__topbar-profile-icon aura-header__topbar-profile-icon--hover"
                src={peopleIconHover}
                alt=""
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* BAR PRINCIPALE */}
        <div className="aura-header__bar">
          <div className="aura-header__side aura-header__side--left">
            <nav className="aura-header__nav aura-header__nav--left">
              {navLinks.slice(0, 2).map((link) => (
                <a key={link.label} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="aura-header__center">
            {/* Logo cliquable vers l’accueil */}
            <a href="/" aria-label="Revenir à l’accueil">
              <img
                src={logoAura}
                alt="Aura logo"
                className="aura-header__logo"
              />
            </a>
          </div>

          <div className="aura-header__side aura-header__side--right">
            <nav className="aura-header__nav aura-header__nav--right">
              {navLinks.slice(2).map((link) => (
                <a key={link.label} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
            </nav>

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
          </div>
        </div>
      </header>

      {/* OVERLAY MOBILE */}
      <div
        className={`aura-header__overlay ${
          isMenuOpen ? "aura-header__overlay--open" : ""
        }`}
      >
        <div className="aura-header__overlay-header">
          {/* Icône profil à gauche dans l’overlay */}
          <a
            href="/profil"
            className="aura-header__overlay-user"
            aria-label="Accéder à mon profil"
          >
            <img
              src={peopleIcon}
              alt="Profil"
              className="aura-header__overlay-user-icon"
            />
          </a>

          <div className="aura-header__overlay-logo">
            <img src={whiteAura} alt="Aura" />
          </div>

          <button
            type="button"
            className="aura-header__overlay-close"
            onClick={closeMenu}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        <nav className="aura-header__overlay-nav">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
