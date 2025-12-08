export default function BottomBar({ role, currentPage }) {
  const menu = {
    client: ["home", "wishlist", "history", "profile"],
    provider: ["home", "services", "planning", "profile"],
    admin: ["home", "users", "comments", "settings"],
  };

  return (
    <div className="bottom-bar">
      {menu[role].map((key) => (
        <a
          key={key}
          href={`/dashboard/${role}/${key}`}
          className={key === currentPage ? "active" : ""}
        >
          {key[0].toUpperCase()}
        </a>
      ))}
    </div>
  );
}
