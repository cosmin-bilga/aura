import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import FilterBar from "../../components/FilterBar/FilterBar";
import CardOffers from "../../components/CardOffers/CardOffers";
import { Helmet } from "react-helmet-async";
import "./ServiceCatalog.scss";

const OFFERS_API_URL = "/api/offers/index.php";
const FAV_OFFERS_API_URL = "/api/fav_offers/index.php";
const FAV_OFFER_API_URL = "/api/fav_offer/index.php";
const PROVIDERS_API_URL = "/api/providers/index.php";

export const formatAvailabilitySlot = (slot) => {
  if (!slot || !slot.start_date || !slot.end_date) return null;

  const startRaw = String(slot.start_date).replace(" ", "T");
  const endRaw = String(slot.end_date).replace(" ", "T");

  const startDate = new Date(startRaw);
  const endDate = new Date(endRaw);

  const hasValidDates =
    !Number.isNaN(startDate.getTime()) && !Number.isNaN(endDate.getTime());

  const startTime = slot.start_date.slice(11, 16);
  const endTime = slot.end_date.slice(11, 16);

  if (hasValidDates) {
    const dayLabel = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    }).format(startDate);

    if (startTime && endTime) {
      return `${dayLabel} ${startTime}-${endTime}`;
    }
    return dayLabel;
  }

  if (startTime && endTime) {
    const date = slot.start_date.slice(8, 10);
    const month = slot.start_date.slice(5, 7);
    return `${date}/${month} ${startTime}-${endTime}`;
  }

  return `${slot.start_date} - ${slot.end_date}`;
};

export const normalizeOffersAvailability = (offersList = []) =>
  offersList.map((offer) => {
    const raw = offer?.disponibility;
    const availabilitySlots = Array.isArray(raw)
      ? raw.filter((d) => d && d.start_date && d.end_date)
      : [];

    const slotLabels = availabilitySlots
      .map((slot) => formatAvailabilitySlot(slot))
      .filter(Boolean);

    let availabilityLabel = "";

    if (typeof raw === "string" && raw.trim() !== "") {
      const trimmed = raw.trim();
      availabilityLabel =
        trimmed.length > 40 ? `${trimmed.slice(0, 37)}...` : trimmed;
    } else if (slotLabels.length > 0) {
      const first = slotLabels[0];
      availabilityLabel =
        slotLabels.length > 1 ? `${first} (+${slotLabels.length - 1})` : first;
    }

    return {
      ...offer,
      availabilitySlots,
      availabilityLabel,
    };
  });

/**
 * Fonction commune de filtrage + tri des offres.
 */
export function filterAndSortOffers(offers, filters) {
  const {
    searchTerm = "",
    selectedCategory = "",
    selectedDistance = "",
    sortBy = "relevance",
    provider = "",
    duration = "",
    disponibility = "",
    perimeter = "",
    maxPrice = "",
  } = filters || {};

  let list = [...offers];

  if (searchTerm.trim() !== "") {
    const lower = searchTerm.toLowerCase();
    list = list.filter((o) => {
      const cat = (o.category || "").toLowerCase();
      const desc = (o.description || "").toLowerCase();
      return cat.includes(lower) || desc.includes(lower);
    });
  }

  if (selectedCategory) {
    list = list.filter((o) => o.category === selectedCategory);
  }

  if (selectedDistance) {
    list = list.filter((o) => o.perimeter_of_displacement === selectedDistance);
  }

  if (provider) {
    list = list.filter((o) => o.id_provider === Number(provider));
  }

  if (duration) {
    list = list.filter((o) => o.duration === duration);
  }

  if (disponibility) {
    list = list.filter((o) => {
      if (Array.isArray(o.availabilitySlots) && o.availabilitySlots.length) {
        return o.availabilitySlots.some((slot) => {
          const formatted = formatAvailabilitySlot(slot);
          return (
            slot.start_date === disponibility ||
            slot.end_date === disponibility ||
            formatted === disponibility
          );
        });
      }

      const label =
        (typeof o.availabilityLabel === "string" && o.availabilityLabel) ||
        (typeof o.disponibility === "string" && o.disponibility) ||
        "";
      return label === disponibility;
    });
  }

  if (perimeter) {
    list = list.filter((o) => o.perimeter_of_displacement === perimeter);
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    list = list.filter((o) => Number(o.price) <= max);
  }

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
    return 0;
  });

  return list;
}

const ServiceCatalog = () => {
  const { auth } = useAuth();

  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const [providers, setProviders] = useState([]);

  // Filtres / recherche / tri
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [selectedDisponibility, setSelectedDisponibility] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const [selectedOffer, setSelectedOffer] = useState(null);

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

  // Chargement des offres
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
        console.warn("Réponse NON JSON (offers) :", rawText);
        setErrorOffers(
          "La réponse du serveur n'est pas au format JSON. Vérifiez l'API."
        );
        setLoadingOffers(false);
        return;
      }

      if (!response.ok) {
        setErrorOffers(
          (data && data.message) || "Erreur lors du chargement des services."
        );
        setLoadingOffers(false);
        return;
      }

      if (!Array.isArray(data)) {
        console.error("Données inattendues pour les offres :", data);
        setErrorOffers("Format de données inattendu pour les offres.");
        setLoadingOffers(false);
        return;
      }

      setOffers(normalizeOffersAvailability(data));
      setLoadingOffers(false);
    } catch (err) {
      console.error("Erreur réseau (offers) :", err);
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
      console.log("Réponse API providers :", response.status, rawText);

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse NON JSON (providers) :", rawText);
        return;
      }

      if (!response.ok || !Array.isArray(data)) {
        console.warn("Erreur ou format inattendu providers :", data);
        return;
      }

      setProviders(data);
    } catch (err) {
      console.error("Erreur réseau (providers) :", err);
    }
  };

  // Favoris
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
        console.warn("Réponse NON JSON (fav_offers) :", rawText);
        return;
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
    fetchProviders();
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [auth]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedCategory,
    selectedDistance,
    selectedDisponibility,
    sortBy,
    maxPriceFilter,
  ]);

  // Dérivés : catégories / distances / disponibilités
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

  const disponibilities = useMemo(() => {
    const set = new Set();
    offers.forEach((o) => {
      const label =
        (typeof o.availabilityLabel === "string" && o.availabilityLabel) ||
        (typeof o.disponibility === "string" && o.disponibility);
      if (label) set.add(label);
    });
    return Array.from(set);
  }, [offers]);

  // Filtrage + tri
  const filteredAndSortedOffers = useMemo(
    () =>
      filterAndSortOffers(offers, {
        searchTerm,
        selectedCategory,
        selectedDistance,
        sortBy,
        disponibility: selectedDisponibility,
        maxPrice: maxPriceFilter,
      }),
    [
      offers,
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
      console.log("Réponse fav_offer POST :", response.status, rawText);

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse NON JSON fav_offer POST :", rawText);
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
        console.warn("Réponse NON JSON fav_offer DELETE :", rawText);
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

  return (
    <main className="service-catalog">
      <>
  <Helmet>
    <title>Catalogue des services à domicile | Aura</title>
    <meta
      name="description"
      content="Découvrez le catalogue des services Aura : ménage, garde d’enfants, massage, beauté et autres prestations à domicile, filtrables par prix, distance et disponibilité."
    />
    
   
  </Helmet>

  
</>

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
          <FilterBar
            offers={offers}
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
        </div>
      </section>

      {/* CARTES + DÉTAIL + PAGINATION */}
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
  );
};

export default ServiceCatalog;
