import React, { useState } from "react";
import data from "../../mocks/data.json";
import OfferCard from "../../components/OfferCard/OfferCard.jsx";
import Filters from "../../components/Filters/Filters";
import "./CategoryOffers.css";

const CategoryOffers = () => {
  const [filters, setFilters] = useState({
    provider: "",
    duration: "",
    disponibility: "",
    perimeter: "",
    maxPrice: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 6;

  // Filtrage
  const filteredOffers = data.offers.filter((offer) => {
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
      !filters.maxPrice || offer.price <= Number(filters.maxPrice);

    return (
      providerMatch &&
      durationMatch &&
      dispoMatch &&
      perimeterMatch &&
      priceMatch
    );
  });

  // Pagination
  const indexLast = currentPage * offersPerPage;
  const indexFirst = indexLast - offersPerPage;
  const currentOffers = filteredOffers.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  return (
    <div className="categoryOffers">
      <h2 className="categoryOffers__title">Toutes les offres</h2>

      {/* Composant Filtres */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Liste des cartes */}
      <div className="categoryOffers__list">
        {currentOffers.length > 0 ? (
          currentOffers.map((offer) => (
            <OfferCard key={offer.id_offer} offer={offer} />
          ))
        ) : (
          <p>Aucune offre trouvée.</p>
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
