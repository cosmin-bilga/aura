import "./SocialBar.scss";

import instagramIcon from "../../assets/icons/instagram.svg";
import facebookIcon from "../../assets/icons/facebook.svg";
import mailIcon from "../../assets/icons/mail.svg";

export default function SocialBar() {
  return (
    <div className="aura-social">
      <a href="https://www.instagram.com/" className="aura-social__item" aria-label="Instagram">
        <img src={instagramIcon} alt="Instagram" />
      </a>

      <a href="https://fr-fr.facebook.com/" className="aura-social__item" aria-label="Facebook">
        <img src={facebookIcon} alt="Facebook" />
      </a>

      <a
        href="https://outlook.live.com/mail/0/"
        className="aura-social__item aura-social__item--desktop"
        aria-label="Nous écrire par mail"
      >
        <img src={mailIcon} alt="Mail" />
      </a>
    </div>
  );
}
