import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/UseAuth";

const FavoriteOffers = ({ user }) => {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customerId = useMemo(
    () => user?.id_customer || user?.id_client || user?.id || null,
    [user?.id_customer, user?.id_client, user?.id]
  );

  useEffect(() => {
    if (!customerId || !token) {
      setOffers([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const favRes = await fetch(
          `/api/fav_offers/index.php?id_customer=${encodeURIComponent(
            customerId
          )}`,
          {
            headers: { "X-API-KEY": token },
          }
        );
        if (!favRes.ok) {
          const debugText = await favRes.text();
          throw new Error(
            `Impossible de charger vos favoris (${favRes.status}): ${debugText}`
          );
        }
        const favLinks = await favRes.json();
        if (!Array.isArray(favLinks) || favLinks.length === 0) {
          setOffers([]);
          setLoading(false);
          return;
        }

        const detailPromises = favLinks.map((fav) =>
          fetch(
            `/api/offer/index.php?id_offer=${encodeURIComponent(fav.id_offer)}`,
            { headers: { "X-API-KEY": token } }
          )
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null)
            .then((offer) =>
              offer ? { ...offer, id_offer: fav.id_offer } : null
            )
        );

        const detailed = (await Promise.all(detailPromises)).filter(Boolean);

        // deduplicate by id_offer
        const byId = new Map();
        detailed.forEach((o) => {
          if (o?.id_offer) byId.set(o.id_offer, o);
        });

        setOffers(Array.from(byId.values()));
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des favoris");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [customerId, token]);

  return (
    <section className="dash-section">
      <div className="dash-section__header">
        <div>
          <p className="dash-section__hint">Vos offres ajoutées en favoris</p>
          <h2>Mes offres favorites</h2>
        </div>
      </div>

      {error && <div className="dash-alert dash-alert--error">{error}</div>}
      {loading && <p>Chargement...</p>}

      {!loading && !error && offers.length === 0 && (
        <div className="dash-card">
          <p className="dash-section__hint">
            Vous n&apos;avez pas encore d&apos;offres en favoris.
          </p>
        </div>
      )}

      {!loading && !error && offers.length > 0 && (
        <div className="dash-services__grid dash-fav-grid">
          {offers.map((offer) => (
            <article key={offer.id_offer} className="dash-service-card">
              <div className="dash-service-card__header">
                <div className="dash-service-card__left">
                  <div className="dash-service-card__avatar">
                    {offer.title?.[0]?.toUpperCase() || "O"}
                  </div>
                  <div>
                    <h3 className="dash-service-card__title">
                      {offer.title || "Offre"}
                    </h3>
                    <p className="dash-service-card__subtitle">
                      {offer.description || "Pas de description"}
                    </p>
                  </div>
                </div>
                <span className="dash-badge">#{offer.id_offer}</span>
              </div>

              <div className="dash-service-card__meta">
                <span className="dash-price">
                  {offer.price ? `${offer.price} €` : "Prix non renseigné"}
                </span>
                {offer.status && (
                  <span className="dash-status">{offer.status}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FavoriteOffers;
