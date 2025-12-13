import logoAura from "../../assets/logo_aura_white.png";

export const NAV_ICONS = {
  profil: "𖨆",
  historique: "🕮",
  commentaires: "🗫",
  "offres-favoris": "❤",
  "toutes-les-offres": "🎗",
  "tous-les-prestataires": "$",
  "tous-les-clients": "♛",
  "mes-offres": "🎗",
  "mes-rdv": "⏲",
};

export const getNavLinks = (role) => {
  if (role === "admin") {
    return [
      { label: "Toutes les offres", page: "toutes-les-offres" },
      { label: "Tous les prestataires", page: "tous-les-prestataires" },
      { label: "Tous les clients", page: "tous-les-clients" },
    ];
  }
  if (role === "provider") {
    return [
      { label: "Profil", page: "profil" },
      { label: "Mes offres", page: "mes-offres" },
      { label: "Mes rendez-vous", page: "mes-rdv" },
    ];
  }

  return [
    { label: "Profil", page: "profil" },
    { label: "Historique", page: "historique" },
    { label: "Commentaires", page: "commentaires" },
    { label: "Offres favoris", page: "offres-favoris" },
  ];
};

export default function DashSidebar({
  user,
  role,
  expanded,
  pinned,
  onTogglePin,
  onHoverChange,
}) {
  const navLinks = getNavLinks(role);

  const initials = `${(user?.firstname || "A")[0]}${(user?.name || "U")[0]}`
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      className={`dash-sidebar ${expanded ? "dash-sidebar--open" : ""}`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <a className="dash-sidebar__brand" href="/">
        <img src={logoAura} alt="Aura" className="dash-sidebar__logo" />
      </a>

      <nav className="dash-sidebar__nav">
        {navLinks.map((link) => (
          <a
            key={link.page}
            href={`#${link.page}`}
            className="dash-sidebar__link"
            data-label={link.label}
            data-icon={NAV_ICONS[link.page] || "·"}
            data-icon-hover={NAV_ICONS[link.page] || "·"}
          >
            <span
              className="dash-sidebar__icon"
              aria-hidden="true"
              data-icon={NAV_ICONS[link.page] || "·"}
              data-icon-hover={NAV_ICONS[link.page] || "·"}
            />
            <span className="dash-sidebar__label" aria-hidden="true">
              {link.label}
            </span>
          </a>
        ))}
      </nav>

      <div className="dash-sidebar__user">
        <div className="dash-sidebar__avatar">{initials}</div>
        <div className="dash-sidebar__user-name">
          {user?.firstname} {user?.name}
        </div>
        <button
          type="button"
          className={`dash-sidebar__pin ${pinned ? "dash-sidebar__pin--active" : ""}`}
          onClick={onTogglePin}
          aria-label={pinned ? "Réduire la barre" : "Élargir la barre"}
        >
          {pinned ? "≡" : "☰"}
        </button>
      </div>
    </aside>
  );
}
