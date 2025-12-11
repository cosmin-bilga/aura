import { useState } from "react";
import DashSidebar from "./DashSidebar";
import DashContent from "./DashContent";
import { useAuth } from "../../contexts/UseAuth";
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
        <a href="#profil" className="dash-bottom-nav__item">
          <span className="dash-bottom-nav__icon">𖨆</span>
        </a>
        <a href="#historique" className="dash-bottom-nav__item">
          <span className="dash-bottom-nav__icon">🕮</span>
        </a>
        <div className="dash-bottom-nav__fab">
          <a href="/" className="dash-bottom-nav__fab-inner">
            <img src={logoAura} alt="Aura" />
          </a>
        </div>
        <a href="#commentaires" className="dash-bottom-nav__item">
          <span className="dash-bottom-nav__icon">🗫</span>
        </a>
        <a href="#offres-favoris" className="dash-bottom-nav__item">
          <span className="dash-bottom-nav__icon">❤︎</span>
        </a>
      </nav>
    </>
  );
}
