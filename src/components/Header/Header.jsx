import { useState } from "react";
import "./Header.scss";
import logoAura from "../../assets/logo_aura.png";
import whiteAura from "../../assets/logo_aura_white.png";

const navLinksMain = [
  { label: "Sign in", href: "/signin" },
  { label: "Profile", href: "/profile" },
  { label: "Mes missions", href: "/missions" },
  { label: "Annonces", href: "/annonces" },
];

const navLinksExtended = [
  ...navLinksMain,
  { label: "Témoignages", href: "/temoignages" },
  { label: "Besoin d’aide ?", href: "/aide" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="aura-header">
        {/* BARRE VERTE AVEC BG IMAGE + OVERLAY */}
        <div className="aura-header__topbar">
          <div className="aura-header__topbar-inner">
            {/* espace à gauche pour le futur stick réseaux sociaux */}
            <div className="aura-header__topbar-left" />
<div className="aura-header__topbar-profile">
  <span className="aura-header__topbar-profile-icon">👤</span>
</div>

          </div>
        </div>

        {/* NAV + LOGO */}
        <div className="aura-header__bar">
          {/* Colonne gauche (desktop: liens "Sign in" + "Profile") */}
          <div className="aura-header__side aura-header__side--left">
            <nav className="aura-header__nav aura-header__nav--left">
              {navLinksMain.slice(0, 2).map((link) => (
                <a key={link.label} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Centre : logo Aura */}
          <div className="aura-header__center">
            <img
              src={logoAura}
              alt="Aura logo"
              className="aura-header__logo"
            />
          </div>

          {/* Colonne droite : burger (mobile) ou liens (desktop) */}
          <div className="aura-header__side aura-header__side--right">
            <nav className="aura-header__nav aura-header__nav--right">
              {navLinksMain.slice(2).map((link) => (
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

      {/* Menu plein écran mobile */}
      <div
        className={`aura-header__overlay ${
          isMenuOpen ? "aura-header__overlay--open" : ""
        }`}
      >
        <div className="aura-header__overlay-header">
          <div className="aura-header__overlay-user">
            <span className="aura-header__overlay-user-icon">👤</span>
          </div>
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
          {navLinksExtended.map((link) => (
            <a key={link.label} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
