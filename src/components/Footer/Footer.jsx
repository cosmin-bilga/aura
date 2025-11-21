import "./Footer.scss";
import logoAura from "../../assets/logo_aura.png";

const footerLinks = [
  { label: "Mes missions", href: "/missions" },
  { label: "Mes missions", href: "/missions" },
  { label: "Mes missions", href: "/missions" },
  { label: "Mes missions", href: "/missions" },
];

export default function Footer() {
  return (
    <footer className="aura-footer">
      <div className="aura-footer__content">
        <div className="aura-footer__block aura-footer__block--logo">
          <img src={logoAura} alt="Aura logo" className="aura-footer__logo" />
        </div>

        <div className="aura-footer__block aura-footer__block--center">
          <div className="aura-footer__socials">
            <a
              href="#instagram"
              aria-label="Instagram"
              className="aura-footer__social"
            >
              <span>IG</span>
            </a>
            <a
              href="#facebook"
              aria-label="Facebook"
              className="aura-footer__social"
            >
              <span>f</span>
            </a>
            <a
              href="#email"
              aria-label="Contact par mail"
              className="aura-footer__social"
            >
              <span>✉</span>
            </a>
          </div>

          <a href="/cgv-cgu" className="aura-footer__cta">
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
    </footer>
  );
}
