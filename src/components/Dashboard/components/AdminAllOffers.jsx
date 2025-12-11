import React, { useEffect, useState } from "react";
import CardOffers from "../../CardOffers/CardOffers";

export default function AllOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/offers/index.php")
      .then((res) => res.json())
      .then((data) => {
        setOffers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des offres...</div>;

  // Fonction pour afficher le nom du prestataire (simple id ici)
  const getProviderLabel = (offer) => offer.id_provider || "";

  return (
    <div>
      <h2>Toutes les offres</h2>
      <CardOffers
        paginatedOffers={offers}
        filteredOffersCount={offers.length}
        loadingOffers={false}
        errorOffers={null}
        isCustomer={false}
        isFavorite={() => false}
        onAddFavorite={() => {}}
        onRemoveFavorite={() => {}}
        favLoading={false}
        getProviderLabel={getProviderLabel}
        selectedOffer={null}
        onSelectOffer={() => {}}
        onCloseDetail={() => {}}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        isSelectable={false}
      />
    </div>
  );
}
