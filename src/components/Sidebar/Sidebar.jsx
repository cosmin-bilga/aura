export default function Sidebar({ role, currentPage }) {
  const menu = {
    client: [
      { icon: "🏠", key: "home" },
      { icon: "❤️", key: "wishlist" },
      { icon: "🧾", key: "history" },
      { icon: "👤", key: "profile" },
    ],
    provider: [
      { icon: "🏠", key: "home" },
      { icon: "🧰", key: "services" },
      { icon: "📅", key: "planning" },
      { icon: "👤", key: "profile" },
    ],
    admin: [
      { icon: "🏠", key: "home" },
      { icon: "👥", key: "users" },
      { icon: "⭐", key: "comments" },
      { icon: "⚙️", key: "settings" },
    ],
  };

  return (
    <nav className="sidebar">
      {menu[role].map((item) => (
        <a
          key={item.key}
          href={`/dashboard/${role}/${item.key}`}
          className={item.key === currentPage ? "active" : ""}
        >
          <span className="icon">{item.icon}</span>
          <span className="text">{item.key}</span>
        </a>
      ))}
    </nav>
  );
}
