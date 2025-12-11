import logoAura from "../../assets/logo_aura.png";

export default function HeaderLogo() {
  return (
    <div className="aura-header__center">
      <a href="/" aria-label="Revenir à l’accueil">
        <img src={logoAura} alt="Aura logo" className="aura-header__logo" />
      </a>
    </div>
  );
}
