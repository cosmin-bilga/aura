import peopleIcon from "../../assets/icons/people.svg";
import peopleIconHover from "../../assets/icons/people_h.svg";

export default function HeaderTopbar({ profileLink }) {
  return (
    <div className="aura-header__topbar">
      <div className="aura-header__topbar-inner">
        <div className="aura-header__topbar-left" />

        <a
          href={profileLink}
          className="aura-header__topbar-profile"
          aria-label="Espace utilisateur"
        >
          <img
            className="aura-header__topbar-profile-icon aura-header__topbar-profile-icon--default"
            src={peopleIcon}
            alt="Profil"
          />
          <img
            className="aura-header__topbar-profile-icon aura-header__topbar-profile-icon--hover"
            src={peopleIconHover}
            alt=""
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  );
}
