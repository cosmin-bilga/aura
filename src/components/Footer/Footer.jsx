import "./Footer.scss";
import logoAura from "../../assets/logo_aura.png";

import instagramIcon from "../../assets/icons/instagram.svg";
import facebookIcon from "../../assets/icons/facebook.svg";
import mailIcon from "../../assets/icons/mail.svg";

const footerLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Connexion", href: "/connexion" },
  { label: "Nos offres", href: "/offre" },
];

export default function Footer() {
  return (
    <footer className="aura-footer">
      <div className="aura-footer__content">

        <div className="aura-footer__block aura-footer__block--logo">

          <a href="/" aria-label="Revenir à l’accueil">
            <img src={logoAura} alt="Aura logo" className="aura-footer__logo" />
          </a>
        </div>

        <div className="aura-footer__block aura-footer__block--center">
          <div className="aura-footer__socials">
            <a
              href="https://www.instagram.com/"
              aria-label="Instagram"
              className="aura-footer__social"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a
              href="https://fr-fr.facebook.com/"
              aria-label="Facebook"
              className="aura-footer__social"
            >
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://outlook.live.com/mail/0/" aria-label="Mail" className="aura-footer__social">
              <img src={mailIcon} alt="Mail" />
            </a>
          </div>

          <a href="/Legal" className="aura-footer__cta">
            CGV et CGU
          </a>
        </div>

        <div className="aura-footer__block aura-footer__block--links">
          {footerLinks.map((link, index) => (
            <a
              key={`${link.label}-${index}`}
              href={link.href}
              className="aura-footer__link"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="aura-footer__bottombar">
        © 2025 Aura Tous droits réservés
      </div>
    </footer>
  );
}
