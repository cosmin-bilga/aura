import { useState } from "react";
import DashSidebar, { NAV_ICONS, getNavLinks } from "./DashSidebar";
import DashContent from "./DashContent";
import { useAuth } from "../../contexts/useAuth";
import logoAuraWhite from "../../assets/logo_aura_white.png";
import logoAura from "../../assets/logo_aura.png";
import "./Dashboard.scss";

export default function DashLayout() {
  const auth = useAuth();
  const user = auth?.user;
  if (!user) return null;
  const role = user.role;

  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const isSidebarOpen = sidebarPinned || sidebarHover;
  const navLinks = getNavLinks(role);
  const midIndex = Math.ceil(navLinks.length / 2);

  return (
    <>
      <div
        className={`dash-layout ${
          isSidebarOpen ? "dash-layout--expanded" : ""
        } ${sidebarPinned ? "dash-layout--pinned" : ""}`}
      >
        <DashSidebar
          user={user}
          role={role}
          expanded={isSidebarOpen}
          pinned={sidebarPinned}
          onTogglePin={() => setSidebarPinned((p) => !p)}
          onHoverChange={setSidebarHover}
        />
        <DashContent user={user} role={role} />
      </div>

      {/* Navigation fixe mobile */}
      <nav className="dash-bottom-nav">
        {navLinks.slice(0, midIndex).map((link) => (
          <a
            key={link.page}
            href={`#${link.page}`}
            className="dash-bottom-nav__item"
          >
            <span className="dash-bottom-nav__icon">
              {NAV_ICONS[link.page] || ""}
            </span>
          </a>
        ))}
        <div className="dash-bottom-nav__fab">
          <a href="/" className="dash-bottom-nav__fab-inner">
            <img src={logoAura} alt="Aura" />
          </a>
        </div>
        {navLinks.slice(midIndex).map((link) => (
          <a
            key={link.page}
            href={`#${link.page}`}
            className="dash-bottom-nav__item"
          >
            <span className="dash-bottom-nav__icon">
              {NAV_ICONS[link.page] || ""}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}
