import React, { useEffect, useMemo, useState } from "react";
import CardOffers from "../CardOffers/CardOffers";
import { useAuth } from "../../contexts/UseAuth";

const FAV_OFFER_API_URL = "/api/fav_offer/index.php";
const FAV_OFFERS_API_URL = "/api/fav_offers/index.php";

export default function AllOffers() {
  const { user, token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  const customerId = useMemo(
    () => user?.id_customer || user?.id_client || user?.id || null,
    [user?.id_customer, user?.id_client, user?.id]
  );
  const isCustomer =
    Boolean(customerId) &&
    (user?.role === "customer" || user?.role === "client");

  useEffect(() => {
    fetch("/api/offers/index.php")
      .then((res) => res.json())
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!customerId || !token) {
      setFavorites([]);
      return;
    }

    fetch(
      `${FAV_OFFERS_API_URL}?id_customer=${encodeURIComponent(customerId)}`,
      { headers: { "X-API-KEY": token } }
    )
      .then((res) => (res.ok ? res.json() : []))
      .then((favLinks) => {
        if (Array.isArray(favLinks)) {
          setFavorites(favLinks.map((fav) => Number(fav.id_offer)).filter(Boolean));
        } else {
          setFavorites([]);
        }
      })
      .catch(() => setFavorites([]));
  }, [customerId, token]);

  const isFavorite = (idOffer) => favorites.includes(Number(idOffer));

  const handleAddFavorite = async (idOffer) => {
    if (!isCustomer || !token) return;
    setFavLoading(true);
    try {
      const body = new URLSearchParams();
      body.append("id_customer", String(customerId));
      body.append("id_offer", String(idOffer));

      const response = await fetch(FAV_OFFER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "X-API-KEY": token,
        },
        body: body.toString(),
      });

      if (!response.ok) {
        setFavLoading(false);
        return;
      }

      setFavorites((prev) => [...new Set([...prev, Number(idOffer)])]);
    } catch (err) {
      console.error("Erreur ajout favori :", err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleRemoveFavorite = async (idOffer) => {
    if (!isCustomer || !token) return;
    setFavLoading(true);
    try {
      const payload = {
        id_customer: Number(customerId),
        id_offer: Number(idOffer),
      };

      const response = await fetch(FAV_OFFER_API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": token,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setFavLoading(false);
        return;
      }

      setFavorites((prev) => prev.filter((id) => id !== Number(idOffer)));
    } catch (err) {
      console.error("Erreur suppression favori :", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div>Chargement des offres...</div>;

  const getProviderLabel = (offer) => offer.id_provider || "";

  return (
    <div>
      <h2>Toutes les offres</h2>
      <CardOffers
        paginatedOffers={offers}
        filteredOffersCount={offers.length}
        loadingOffers={false}
        errorOffers={null}
        isCustomer={isCustomer}
        isFavorite={isFavorite}
        onAddFavorite={handleAddFavorite}
        onRemoveFavorite={handleRemoveFavorite}
        favLoading={favLoading}
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
