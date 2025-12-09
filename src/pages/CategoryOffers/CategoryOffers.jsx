<<<<<<< HEAD
import React, { useState, useEffect, useMemo } from "react";
import OfferCard from "../../components/OfferCard/OfferCard.jsx";
import Filters from "../../components/Filters/Filters";
import "./CategoryOffers.css";
=======
// C:\wamp64\www\aura_test\src\pages\CategoryOffers\CategoryOffers.jsx

import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import FilterBar from "../../components/FilterBar/FilterBar";
import CardOffers from "../../components/CardOffers/CardOffers";
import { filterAndSortOffers } from "../ServiceCatalog/ServiceCatalog";
import "./CategoryOffers.scss";

const OFFERS_API_URL = "/api/offers/index.php";
const FAV_OFFERS_API_URL = "/api/fav_offers/index.php";
const FAV_OFFER_API_URL = "/api/fav_offer/index.php";
const PROVIDERS_API_URL = "/api/providers/index.php";
>>>>>>> origin/dev

const OFFERS_API_URL = "/api/offers/index.php";

const CategoryOffers = () => {
<<<<<<< HEAD
 
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    provider: "",
    duration: "",
    disponibility: "",
    perimeter: "",
    maxPrice: "",
  });
=======
  const { categoryKey } = useParams();
  const { auth } = useAuth();
>>>>>>> origin/dev

  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const [providers, setProviders] = useState([]);

  // Filtres (même logique que ServiceCatalog)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [selectedDisponibility, setSelectedDisponibility] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");

  // Pagination + détail
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;
  const [selectedOffer, setSelectedOffer] = useState(null);

<<<<<<< HEAD
  
  const fetchOffers = async () => {
    setLoading(true);
    setError(null);

    try {
     
      const params = new URLSearchParams();
      params.append("limit", "100"); 

      const response = await fetch(`${OFFERS_API_URL}?${params.toString()}`, {
        method: "GET",
      });

      const rawText = await response.text();
      console.log("Réponse API offers:", response.status, rawText);

      
      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON:", rawText);
        throw new Error("Format de réponse invalide");
      }

    
      if (!response.ok) {
        throw new Error(data?.message || "Erreur lors du chargement des offres");
      }

      
      if (!Array.isArray(data)) {
        throw new Error("Format de données inattendu");
      }

     
      setOffers(data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement des offres:", err);
      setError(err.message || "Erreur réseau ou serveur");
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchOffers();
  }, []);


  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const providerMatch =
        !filters.provider || offer.id_provider === Number(filters.provider);

      const durationMatch =
        !filters.duration || offer.duration === filters.duration;

      const dispoMatch =
        !filters.disponibility || offer.disponibility === filters.disponibility;

      const perimeterMatch =
        !filters.perimeter ||
        offer.perimeter_of_displacement === filters.perimeter;

      const priceMatch =
        !filters.maxPrice || parseFloat(offer.price) <= Number(filters.maxPrice);

      return (
        providerMatch &&
        durationMatch &&
        dispoMatch &&
        perimeterMatch &&
        priceMatch
      );
    });
  }, [offers, filters]);
  const indexLast = currentPage * offersPerPage;
  const indexFirst = indexLast - offersPerPage;
  const currentOffers = filteredOffers.slice(indexFirst, indexLast);
=======
  // Auth
  const isCustomer =
    auth &&
    auth.user &&
    (auth.user.role === "customer" || auth.user.role === "client");

  const customerId = useMemo(() => {
    if (!auth || !auth.user) return null;
    return auth.user.id_customer || auth.user.id || null;
  }, [auth]);

  // Map id_provider → provider
  const providerMap = useMemo(() => {
    const map = {};
    providers.forEach((p) => {
      if (p.id_provider != null) {
        map[Number(p.id_provider)] = p;
      }
    });
    return map;
  }, [providers]);

  const getProviderLabel = (offer) => {
    const p = providerMap[Number(offer.id_provider)];
    if (!p) return "Prestataire Aura";
    return `${p.firstname} ${p.name}`;
  };

  // Chargement des offres (toutes, on filtrera ensuite par catégorie)
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
      console.log(
        "Réponse API CategoryOffers offers :",
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON CategoryOffers offers :", rawText);
      }

      if (!response.ok) {
        setErrorOffers(
          (data && data.message) ||
            "Erreur lors du chargement des services de cette catégorie."
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
      console.error("Erreur réseau CategoryOffers offers :", err);
      setErrorOffers(
        "Erreur réseau ou serveur lors du chargement des services."
      );
      setLoadingOffers(false);
    }
  };

  // Chargement des prestataires
  const fetchProviders = async () => {
    try {
      const response = await fetch(PROVIDERS_API_URL, { method: "GET" });
      const rawText = await response.text();
      console.log(
        "Réponse API providers (CategoryOffers):",
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON providers (CategoryOffers):", rawText);
      }

      if (!response.ok || !Array.isArray(data)) {
        console.warn(
          "Erreur ou format inattendu providers (CategoryOffers):",
          data
        );
        return;
      }

      setProviders(data);
    } catch (err) {
      console.error("Erreur réseau providers (CategoryOffers) :", err);
    }
  };

  // Chargement des favoris
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
      console.log(
        "Réponse API fav_offers (CategoryOffers):",
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON fav_offers (CategoryOffers):", rawText);
      }

      if (!response.ok || !Array.isArray(data)) {
        console.warn(
          "Erreur ou format inattendu fav_offers (CategoryOffers):",
          data
        );
        return;
      }

      const favIds = data.map((f) => Number(f.id_offer));
      setFavorites(favIds);
    } catch (err) {
      console.error("Erreur réseau fav_offers (CategoryOffers) :", err);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchProviders();
  }, [categoryKey]);

  useEffect(() => {
    fetchFavorites();
  }, [auth]);

  // Offres limitées à la catégorie de l’URL
  const offersByCategory = useMemo(() => {
    if (!categoryKey) return [];
    return offers.filter((offer) => offer.category === categoryKey);
  }, [offers, categoryKey]);

  // Reset pagination quand filtres ou catégorie changent
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    selectedDistance,
    selectedDisponibility,
    sortBy,
    maxPriceFilter,
    categoryKey,
  ]);

  // Dérivés : catégories / distances / disponibilités sur CE sous-ensemble
  const categories = useMemo(() => {
    const set = new Set();
    offersByCategory.forEach((o) => {
      if (o.category) set.add(o.category);
    });
    return Array.from(set);
  }, [offersByCategory]);

  const distances = useMemo(() => {
    const set = new Set();
    offersByCategory.forEach((o) => {
      if (o.perimeter_of_displacement) set.add(o.perimeter_of_displacement);
    });
    return Array.from(set);
  }, [offersByCategory]);

  const disponibilities = useMemo(() => {
    const set = new Set();
    offersByCategory.forEach((o) => {
      if (o.disponibility) set.add(o.disponibility);
    });
    return Array.from(set);
  }, [offersByCategory]);

  // Filtrage + tri (logique commune, appliquée UNIQUEMENT sur offersByCategory)
  const filteredAndSortedOffers = useMemo(
    () =>
      filterAndSortOffers(offersByCategory, {
        searchTerm,
        selectedCategory,
        selectedDistance,
        sortBy,
        disponibility: selectedDisponibility,
        maxPrice: maxPriceFilter,
      }),
    [
      offersByCategory,
      searchTerm,
      selectedCategory,
      selectedDistance,
      sortBy,
      selectedDisponibility,
      maxPriceFilter,
    ]
  );

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedOffers.length / PAGE_SIZE)
  );
>>>>>>> origin/dev

  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedOffers.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedOffers, currentPage]);

  // Favoris helpers
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
      console.log(
        "Réponse fav_offer POST (CategoryOffers):",
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn(
          "Réponse non-JSON fav_offer POST (CategoryOffers):",
          rawText
        );
      }

      if (!response.ok) {
        alert((data && data.message) || "Erreur lors de l’ajout aux favoris.");
        setFavLoading(false);
        return;
      }

      setFavorites((prev) => [...new Set([...prev, Number(idOffer)])]);
      setFavLoading(false);
    } catch (err) {
      console.error("Erreur réseau fav_offer POST (CategoryOffers) :", err);
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
      console.log(
        "Réponse fav_offer DELETE (CategoryOffers):",
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn(
          "Réponse non-JSON fav_offer DELETE (CategoryOffers):",
          rawText
        );
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
      console.error("Erreur réseau fav_offer DELETE (CategoryOffers) :", err);
      alert("Erreur réseau ou serveur lors de la suppression du favori.");
      setFavLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedOffer(null);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDistance("");
    setSelectedDisponibility("");
    setSortBy("relevance");
    setMaxPriceFilter("");
  };

  // Titre lisible à partir du slug
  const formatCategoryTitle = (key) => {
    if (!key) return "Catégorie";
    return key
      .replace(/[_-]/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const categoryTitle = formatCategoryTitle(categoryKey || "");

  return (
    <main className="categoryOffers">
      <header className="categoryOffers__header">
        <h1 className="categoryOffers__title">
          Offres de {categoryTitle.toLowerCase()}
        </h1>
        <p className="categoryOffers__subtitle">
          Parcourez tous les services de {categoryTitle.toLowerCase()}{" "}
          disponibles dans cette catégorie.
        </p>
      </header>

      {/* Barre de recherche + filtres + tri (même composant que ServiceCatalog) */}
      <FilterBar
        offers={offersByCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
        selectedDisponibility={selectedDisponibility}
        setSelectedDisponibility={setSelectedDisponibility}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxPriceFilter={maxPriceFilter}
        setMaxPriceFilter={setMaxPriceFilter}
        categories={categories}
        distances={distances}
        disponibilities={disponibilities}
        onReset={handleResetFilters}
      />

<<<<<<< HEAD
      {/* Indicateur de chargement */}
      {loading && <p className="categoryOffers__loading">Chargement des offres...</p>}

      {/* Message d'erreur */}
      {error && <p className="categoryOffers__error">Erreur : {error}</p>}

      {/* Liste des cartes */}
      <div className="categoryOffers__list">
        {!loading && !error && currentOffers.length > 0 ? (
          currentOffers.map((offer) => (
            <OfferCard key={offer.id_offer} offer={offer} />
          ))
        ) : (
          !loading && !error && <p>Aucune offre trouvée.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="categoryOffers__pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
=======
      {/* Cards + panneau détail + pagination (CardOffers) */}
      <CardOffers
        paginatedOffers={paginatedOffers}
        filteredOffersCount={filteredAndSortedOffers.length}
        loadingOffers={loadingOffers}
        errorOffers={errorOffers}
        isCustomer={isCustomer}
        isFavorite={isFavorite}
        onAddFavorite={handleAddFavorite}
        onRemoveFavorite={handleRemoveFavorite}
        favLoading={favLoading}
        getProviderLabel={getProviderLabel}
        selectedOffer={selectedOffer}
        onSelectOffer={setSelectedOffer}
        onCloseDetail={closeDetail}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
>>>>>>> origin/dev
  );
};

export default CategoryOffers;
