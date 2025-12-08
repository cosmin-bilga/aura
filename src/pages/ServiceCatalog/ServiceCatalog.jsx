import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/useAuth"; 
import "./ServiceCatalog.scss";

const OFFERS_API_URL = "/api/offers/index.php";
const FAV_OFFERS_API_URL = "/api/fav_offers/index.php";
const FAV_OFFER_API_URL = "/api/fav_offer/index.php";

const ServiceCatalog = () => {
  const { auth } = useAuth(); // auth = { token, user: { role, id_customer?, id? } }

  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState(null);

  const [favorites, setFavorites] = useState([]); // [id_offer,...]
  const [favLoading, setFavLoading] = useState(false);

  // Filtres / recherche / tri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [sortBy, setSortBy] = useState("relevance"); // relevance | price_asc | price_desc | newest

  // Autocomplétion
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Tri (menu déroulant)
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10; // environ 2 lignes de 5 cartes sur grand écran

  // --------- Utilitaires auth client ---------
  const isCustomer =
    auth &&
    auth.user &&
    (auth.user.role === "customer" || auth.user.role === "client");

  const customerId = useMemo(() => {
    if (!auth || !auth.user) return null;
    return auth.user.id_customer || auth.user.id || null;
  }, [auth]);

  // --------- Chargement initial des offres ---------
  const fetchOffers = async () => {
    setLoadingOffers(true);
    setErrorOffers(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", "200");

      const response = await fetch(`${OFFERS_API_URL}?${params.toString()}`, {
        method: "GET",
      });

      const rawText = await response.text();
      console.log("Réponse API offers :", response.status, rawText);

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON (offers) :", rawText);
      }

      if (!response.ok) {
        setErrorOffers(
          (data && data.message) || "Erreur lors du chargement des services."
        );
        setLoadingOffers(false);
        return;
      }

      if (!Array.isArray(data)) {
        setErrorOffers("Format de données inattendu pour les offres.");
        setLoadingOffers(false);
        return;
      }

      setOffers(data);
      setLoadingOffers(false);
    } catch (err) {
      console.error("Erreur réseau (offers) :", err);
      setErrorOffers(
        "Erreur réseau ou serveur lors du chargement des services."
      );
      setLoadingOffers(false);
    }
  };

  // --------- Chargement des favoris client ---------
  const fetchFavorites = async () => {
    if (!isCustomer || !auth.token || !customerId) {
      setFavorites([]);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("id_customer", String(customerId));

      const response = await fetch(
        `${FAV_OFFERS_API_URL}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": auth.token,
          },
        }
      );

      const rawText = await response.text();
      console.log("Réponse API fav_offers :", response.status, rawText);

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON (fav_offers) :", rawText);
      }

      if (!response.ok || !Array.isArray(data)) {
        console.warn("Erreur ou format inattendu fav_offers :", data);
        return;
      }

      const favIds = data.map((f) => Number(f.id_offer));
      setFavorites(favIds);
    } catch (err) {
      console.error("Erreur réseau fav_offers :", err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [auth]);

  // Quand on change les filtres / tri / recherche → on revient à la page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDistance, sortBy]);

  // --------- Dérivés : catégories / distances ---------
  const categories = useMemo(() => {
    const set = new Set();
    offers.forEach((o) => {
      if (o.category) set.add(o.category);
    });
    return Array.from(set);
  }, [offers]);

  const distances = useMemo(() => {
    const set = new Set();
    offers.forEach((o) => {
      if (o.perimeter_of_displacement) set.add(o.perimeter_of_displacement);
    });
    return Array.from(set);
  }, [offers]);

  // --------- Autocomplétion (basée sur catégories + description) ---------
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

  // --------- Filtrage + tri côté front ---------
  const filteredAndSortedOffers = useMemo(() => {
    let list = [...offers];

    // Recherche texte : sur catégorie + description
    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      list = list.filter((o) => {
        const cat = (o.category || "").toLowerCase();
        const desc = (o.description || "").toLowerCase();
        return cat.includes(lower) || desc.includes(lower);
      });
    }

    // Filtre catégorie
    if (selectedCategory) {
      list = list.filter((o) => o.category === selectedCategory);
    }

    // Filtre distance / périmètre
    if (selectedDistance) {
      list = list.filter(
        (o) => o.perimeter_of_displacement === selectedDistance
      );
    }

    // Tri
    list.sort((a, b) => {
      if (sortBy === "price_asc") {
        const pa = parseFloat(a.price || "0");
        const pb = parseFloat(b.price || "0");
        return pa - pb;
      }
      if (sortBy === "price_desc") {
        const pa = parseFloat(a.price || "0");
        const pb = parseFloat(b.price || "0");
        return pb - pa;
      }
      if (sortBy === "newest") {
        const da = new Date(a.created_at || 0).getTime();
        const db = new Date(b.created_at || 0).getTime();
        return db - da;
      }

      // relevance: ordre d'origine
      return 0;
    });

    return list;
  }, [offers, searchTerm, selectedCategory, selectedDistance, sortBy]);

  // --------- Pagination ---------
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedOffers.length / PAGE_SIZE)
  );

  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedOffers.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedOffers, currentPage]);

  // --------- Favoris ---------
  const isFavorite = (idOffer) => favorites.includes(Number(idOffer));

  const handleAddFavorite = async (idOffer) => {
    if (!isCustomer) {
      alert("Connectez-vous en tant que client pour ajouter un favori.");
      return;
    }
    if (!auth.token || !customerId) {
      alert("Impossible de déterminer votre compte client.");
      return;
    }

    setFavLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("id_customer", String(customerId));
      formBody.append("id_offer", String(idOffer));

      const response = await fetch(FAV_OFFER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-API-KEY": auth.token,
        },
        body: formBody.toString(),
      });

      const rawText = await response.text();
      console.log("Réponse fav_offer POST :", response.status, rawText);

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON fav_offer POST :", rawText);
      }

      if (!response.ok) {
        alert((data && data.message) || "Erreur lors de l’ajout aux favoris.");
        setFavLoading(false);
        return;
      }

      setFavorites((prev) => [...new Set([...prev, Number(idOffer)])]);
      setFavLoading(false);
    } catch (err) {
      console.error("Erreur réseau fav_offer POST :", err);
      alert("Erreur réseau ou serveur lors de l’ajout en favori.");
      setFavLoading(false);
    }
  };

  const handleRemoveFavorite = async (idOffer) => {
    if (!isCustomer) {
      alert("Connectez-vous en tant que client pour gérer vos favoris.");
      return;
    }
    if (!auth.token || !customerId) {
      alert("Impossible de déterminer votre compte client.");
      return;
    }

    setFavLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append("id_customer", String(customerId));
      formBody.append("id_offer", String(idOffer));

      const response = await fetch(FAV_OFFER_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-API-KEY": auth.token,
        },
        body: formBody.toString(),
      });

      const rawText = await response.text();
      console.log("Réponse fav_offer DELETE :", response.status, rawText);

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON fav_offer DELETE :", rawText);
      }

      if (!response.ok) {
        alert(
          (data && data.message) || "Erreur lors de la suppression du favori."
        );
        setFavLoading(false);
        return;
      }

      setFavorites((prev) => prev.filter((id) => id !== Number(idOffer)));
      setFavLoading(false);
    } catch (err) {
      console.error("Erreur réseau fav_offer DELETE :", err);
      alert("Erreur réseau ou serveur lors de la suppression du favori.");
      setFavLoading(false);
    }
  };

  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleCardClick = (offer) => {
    setSelectedOffer(offer);
  };

  const closeDetail = () => {
    setSelectedOffer(null);
  };

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

  // --------- Rendu ---------
  return (
    <main className="service-catalog">
      {/* HERO */}
      <section className="service-catalog__hero">
        <div className="service-catalog__hero-inner">
          <h1 className="service-catalog__title">Besoin d’un coup de main ?</h1>
          <p className="service-catalog__subtitle">
            Parcourez les services disponibles autour de vous et trouvez le
            prestataire idéal pour vos tâches du quotidien&nbsp;: ménage, garde
            d’enfants, massage, beauté...
          </p>

          {/* BARRE DE RECHERCHE + FILTRES + TRI */}
          <div className="service-catalog__search">
            <div className="service-catalog__search-row">
              {/* Recherche */}
              <div className="service-catalog__search-field">
                <input
                  type="text"
                  className="service-catalog__search-input"
                  placeholder="Ex : Ménage, garde d’enfants, massage relaxant..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 150)
                  }
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

              {/* Contrôles à droite dans la même barre */}
              <div className="service-catalog__search-controls">
                {/* Catégorie */}
                <div className="service-catalog__chip">
                  <span className="service-catalog__chip-label">
                    Catégorie
                  </span>
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
                  <span className="service-catalog__chip-label">
                    Périmètre
                  </span>
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

                {/* Tri */}
                <div className="service-catalog__sort">
                  <button
                    type="button"
                    className="service-catalog__sort-toggle"
                    onClick={() => setShowSortMenu((prev) => !prev)}
                  >
                    <span className="service-catalog__sort-label">
                      Trier : {sortLabel}
                    </span>
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
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedDistance("");
                    setSortBy("relevance");
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENU : LISTE + DÉTAIL */}
      <section className="service-catalog__content">
        <div className="service-catalog__left">
          <div className="service-catalog__list">
            {errorOffers && (
              <div className="service-catalog__error">{errorOffers}</div>
            )}

            {loadingOffers && paginatedOffers.length === 0 && (
              <div className="service-catalog__loading">
                Chargement des services...
              </div>
            )}

            {!loadingOffers &&
              filteredAndSortedOffers.length === 0 &&
              !errorOffers && (
                <div className="service-catalog__empty">
                  Aucun service ne correspond à vos critères pour le moment.
                </div>
              )}

            {paginatedOffers.map((offer) => (
              <article
                key={offer.id_offer}
                className="service-card"
                onClick={() => handleCardClick(offer)}
              >
                <div className="service-card__top">
                  <div className="service-card__avatar">
                    <div className="service-card__avatar-circle">
                      {(offer.category || "S")[0].toUpperCase()}
                    </div>
                  </div>

                  <div className="service-card__header">
                    <div className="service-card__title-row">
                      <h2 className="service-card__title">
                        {offer.category || "Service"}
                      </h2>
                      <span className="service-card__price">
                        {offer.price ? `${offer.price} €` : "Sur devis"}
                      </span>
                    </div>

                    <div className="service-card__meta">
                      {offer.duration && (
                        <span className="service-card__meta-item">
                          Durée : {offer.duration}
                        </span>
                      )}
                      {offer.disponibility && (
                        <span className="service-card__meta-item">
                          {offer.disponibility}
                        </span>
                      )}
                      {offer.perimeter_of_displacement && (
                        <span className="service-card__meta-item">
                          Jusqu’à {offer.perimeter_of_displacement}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="service-card__description">{offer.description}</p>

                <div className="service-card__tags">
                  {offer.category && (
                    <span className="service-card__tag">{offer.category}</span>
                  )}
                  {offer.perimeter_of_displacement && (
                    <span className="service-card__tag">
                      Rayon : {offer.perimeter_of_displacement}
                    </span>
                  )}
                </div>

                <div
                  className="service-card__bottom"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isCustomer ? (
                    <div className="service-card__actions">
                      {isFavorite(offer.id_offer) ? (
                        <button
                          type="button"
                          className="service-card__btn service-card__btn--ghost"
                          onClick={() => handleRemoveFavorite(offer.id_offer)}
                          disabled={favLoading}
                        >
                          Retirer des favoris
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="service-card__btn"
                          onClick={() => handleAddFavorite(offer.id_offer)}
                          disabled={favLoading}
                        >
                          Ajouter aux favoris
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="service-card__hint">
                      Connectez-vous en tant que client pour ajouter aux
                      favoris.
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="service-catalog__pagination">
              <button
                type="button"
                className={`service-catalog__page-btn ${
                  currentPage === 1 ? "service-catalog__page-btn--disabled" : ""
                }`}
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                ◀
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={`service-catalog__page-btn ${
                      page === currentPage
                        ? "service-catalog__page-btn--active"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                className={`service-catalog__page-btn ${
                  currentPage === totalPages
                    ? "service-catalog__page-btn--disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </div>

        {selectedOffer && (
          <aside className="service-detail">
            <button
              type="button"
              className="service-detail__close"
              onClick={closeDetail}
            >
              ✕
            </button>

            <div className="service-detail__header">
              <div className="service-detail__avatar">
                {(selectedOffer.category || "S")[0].toUpperCase()}
              </div>
              <div className="service-detail__titles">
                <span className="service-detail__provider-name">
                  Prestataire Aura
                </span>
                <span className="service-detail__offer-title">
                  {selectedOffer.category || "Service"}
                </span>
              </div>
            </div>

            <div className="service-detail__section">
              <h3>À propos du service</h3>
              <p>{selectedOffer.description}</p>
            </div>

            <div className="service-detail__section service-detail__grid">
              <div className="service-detail__info">
                <strong>Durée</strong>
                <span>{selectedOffer.duration || "Non précisé"}</span>
              </div>
              <div className="service-detail__info">
                <strong>Disponibilité</strong>
                <span>{selectedOffer.disponibility || "Non précisé"}</span>
              </div>
              <div className="service-detail__info">
                <strong>Zone de déplacement</strong>
                <span>
                  {selectedOffer.perimeter_of_displacement || "Non précisé"}
                </span>
              </div>
              <div className="service-detail__info">
                <strong>Tarif</strong>
                <span>
                  {selectedOffer.price
                    ? `${selectedOffer.price} €`
                    : "Sur devis"}
                </span>
              </div>
            </div>

            <button type="button" className="service-detail__cta">
              Demander ce service
            </button>
          </aside>
        )}
      </section>
    </main>
  );
};

export default ServiceCatalog;
