import React, { useState, useEffect, useMemo } from "react";
import OfferCard from "../../components/OfferCard/OfferCard.jsx";
import Filters from "../../components/Filters/Filters";
import "./CategoryOffers.css";

const OFFERS_API_URL = "/api/offers/index.php";

const CategoryOffers = () => {
 
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

  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 6;

  
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

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  return (
    <div className="categoryOffers">
      <h2 className="categoryOffers__title">Toutes les offres</h2>

      {/* Composant Filtres */}
      <Filters filters={filters} setFilters={setFilters} />

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
  );
};

export default CategoryOffers;
