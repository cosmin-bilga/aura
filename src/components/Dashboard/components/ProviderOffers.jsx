import React, { useEffect, useState } from "react";
import CardOffers from "../../CardOffers/CardOffers";

export default function ProviderOffers({ user }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id_provider) return;
    fetch(`/api/offers/index.php?id_provider=${user.id_provider}`)
      .then((res) => res.json())
      .then((data) => {
        setOffers(data);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div>Chargement des offres...</div>;

  const getProviderLabel = () => user.name || "";

  return (
    <div>
      <h2>Mes offres</h2>
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
