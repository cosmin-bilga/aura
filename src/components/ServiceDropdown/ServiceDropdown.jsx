import { useState } from "react";
import { Link } from "react-router-dom";
import MockData from "../../mocks/data.json";
import "./ServiceDropdown.scss";

const ServiceDropdown = ({ className }) => {
  const [open, setOpen] = useState(false);
  const categories = MockData.categories_list;

  return (
    <div
      className={`aura-header__nav-dropdown ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="dropdown-trigger">Services ▼</div>

      {open && (
        <div className="dropdown-content">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/categorie/${cat.key}`}
              className="dropdown-link"
              onClick={() => setOpen(false)}
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
