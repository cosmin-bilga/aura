// C:\wamp64\www\aura_test\src\components\ServiceDropdown\ServiceDropdown.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MockData from "../../mocks/data.json";
import "./ServiceDropdown.scss";

const ServiceDropdown = ({ className = "" }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : true
  );

  const categories = MockData.categories_list || [];
  const isFooter = className.includes("aura-footer__dropdown");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTriggerClick = () => {
    // En footer OU en mobile : on ouvre/ferme au clic
    if (isFooter || isMobile) {
      setOpen((prev) => !prev);
    }
  };

  const handleMouseEnter = () => {
    // Hover uniquement pour le header en desktop
    if (!isMobile && !isFooter) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isFooter) {
      setOpen(false);
    }
  };

  const handleItemClick = () => {
    setOpen(false);
  };

  // Classe des liens :
  // - Footer + mobile => aura-footer__link (comme Accueil / Connexion)
  // - Sinon => dropdown-link (style du header)
  const linkClass =
    isFooter && isMobile ? "aura-footer__link" : "dropdown-link";

  return (
    <div
      className={`aura-header__nav-dropdown ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className="dropdown-trigger"
        onClick={handleTriggerClick}
      >
        <span className="dropdown-trigger__label">Services</span>
        {isFooter && (
          <span className="dropdown-trigger__arrow">{open ? "▲" : ""}</span>
        )}
      </button>

      {open && (
        <div className="dropdown-content">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/categorie/${cat.key}`}
              className={linkClass}
              onClick={handleItemClick}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceDropdown;
