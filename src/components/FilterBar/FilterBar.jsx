import React, { useMemo, useState } from "react";
import "./FilterBar.scss";

const FilterBar = ({
  offers,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDistance,
  setSelectedDistance,
  selectedDisponibility,
  setSelectedDisponibility,
  sortBy,
  setSortBy,
  maxPriceFilter,
  setMaxPriceFilter,
  categories,
  distances,
  disponibilities,
  onReset,
}) => {
  // Autocomplétion
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Tri (menu déroulant)
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Suggestions calculées à partir des offres + searchTerm
  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 2) return [];

    const lower = searchTerm.toLowerCase();
    const set = new Set();

    offers.forEach((o) => {
      if (o.category && o.category.toLowerCase().includes(lower)) {
        set.add(o.category);
      }
      if (o.description && o.description.toLowerCase().includes(lower)) {
        set.add(
          o.description.slice(0, 40) + (o.description.length > 40 ? "..." : "")
        );
      }
    });

    return Array.from(set).slice(0, 8);
  }, [searchTerm, offers]);

  const sortLabel = useMemo(() => {
    switch (sortBy) {
      case "price_asc":
        return "Prix croissant";
      case "price_desc":
        return "Prix décroissant";
      case "newest":
        return "Plus récentes";
      default:
        return "Pertinence";
    }
  }, [sortBy]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    setShowSuggestions(false);
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (
        activeSuggestionIndex >= 0 &&
        activeSuggestionIndex < suggestions.length
      ) {
        e.preventDefault();
        const chosen = suggestions[activeSuggestionIndex];
        handleSuggestionClick(chosen);
      } else {
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleMaxPriceChange = (e) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/[^\d]/g, "");
    setMaxPriceFilter(sanitized);
  };

  const handleResetClick = () => {
    onReset && onReset();
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setShowSortMenu(false);
  };

  return (
    <div className="service-catalog__search">
      <div className="service-catalog__search-row">
        {/* Recherche */}
        <div className="service-catalog__search-field">
          <label
            className="service-catalog__field-label"
            htmlFor="catalog-search"
          >
            Recherche
          </label>
          <input
            id="catalog-search"
            type="text"
            className="service-catalog__search-input"
            placeholder="Ex : Ménage, garde d’enfants, massage relaxant..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleSearchKeyDown}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="service-catalog__suggestions">
              {suggestions.map((s, idx) => (
                <li
                  key={s + idx}
                  className={
                    idx === activeSuggestionIndex
                      ? "service-catalog__suggestion service-catalog__suggestion--active"
                      : "service-catalog__suggestion"
                  }
                  onMouseDown={() => handleSuggestionClick(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contrôles à droite */}
        <div className="service-catalog__search-controls">
          {/* Catégorie */}
          <div className="service-catalog__chip">
            <span className="service-catalog__chip-label">Catégorie</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="service-catalog__chip-select"
            >
              <option value="">Toutes</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Périmètre */}
          <div className="service-catalog__chip">
            <span className="service-catalog__chip-label">Périmètre</span>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
              className="service-catalog__chip-select"
            >
              <option value="">Tous</option>
              {distances.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Disponibilité */}
          <div className="service-catalog__chip">
            <span className="service-catalog__chip-label">Disponibilité</span>
            <select
              value={selectedDisponibility}
              onChange={(e) => setSelectedDisponibility(e.target.value)}
              className="service-catalog__chip-select"
            >
              <option value="">Toutes</option>
              {disponibilities.map((disp) => (
                <option key={disp} value={disp}>
                  {disp}
                </option>
              ))}
            </select>
          </div>

          {/* Prix max */}
          <div className="service-catalog__chip">
            <span className="service-catalog__chip-label">Prix max (€)</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="service-catalog__chip-input"
              placeholder="Ex : 80"
              value={maxPriceFilter}
              onChange={handleMaxPriceChange}
            />
          </div>

          {/* Tri */}
          <div className="service-catalog__sort">
            <span className="service-catalog__chip-label">Tri</span>
            <button
              type="button"
              className="service-catalog__sort-toggle"
              onClick={() => setShowSortMenu((prev) => !prev)}
            >
              <span className="service-catalog__sort-label">{sortLabel}</span>
              <span className="service-catalog__sort-icon">▾</span>
            </button>

            {showSortMenu && (
              <div className="service-catalog__sort-menu">
                <button
                  type="button"
                  className={`service-catalog__sort-option ${
                    sortBy === "relevance"
                      ? "service-catalog__sort-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setSortBy("relevance");
                    setShowSortMenu(false);
                  }}
                >
                  Pertinence
                </button>
                <button
                  type="button"
                  className={`service-catalog__sort-option ${
                    sortBy === "price_asc"
                      ? "service-catalog__sort-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setSortBy("price_asc");
                    setShowSortMenu(false);
                  }}
                >
                  Prix croissant
                </button>
                <button
                  type="button"
                  className={`service-catalog__sort-option ${
                    sortBy === "price_desc"
                      ? "service-catalog__sort-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setSortBy("price_desc");
                    setShowSortMenu(false);
                  }}
                >
                  Prix décroissant
                </button>
                <button
                  type="button"
                  className={`service-catalog__sort-option ${
                    sortBy === "newest"
                      ? "service-catalog__sort-option--active"
                      : ""
                  }`}
                  onClick={() => {
                    setSortBy("newest");
                    setShowSortMenu(false);
                  }}
                >
                  Plus récentes
                </button>
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            type="button"
            className="service-catalog__reset-icon"
            title="Réinitialiser les filtres"
            onClick={handleResetClick}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
