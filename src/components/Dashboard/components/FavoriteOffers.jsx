import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/UseAuth";

const boxStyle = {
  padding: "1.5rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "1.5rem",
  background: "#fafafa",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "1rem",
};
const thtdStyle = {
  border: "1px solid #ddd",
  padding: "0.75rem",
  textAlign: "left",
};
const thStyle = {
  ...thtdStyle,
  background: "#f0f0f0",
  fontWeight: "bold",
};

const FavoriteOffers = ({ user }) => {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id_customer || !token) {
      setOffers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    // Step 1: Fetch all favorite offer links for the user
    fetch(
      `/api/fav_offers/index.php?id_customer=${encodeURIComponent(
        user.id_customer
      )}`,
      {
        headers: {
          "X-API-KEY": token,
        },
      }
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des offres favorites");
        return res.json();
      })
      .then(async (favLinks) => {
        if (!Array.isArray(favLinks) || favLinks.length === 0) {
          setOffers([]);
          setLoading(false);
          return;
        }
        // Step 2: For each favorite offer, fetch its offer details
        const allOffers = await Promise.all(
          favLinks.map((fav) =>
            fetch(
              `/api/offer/index.php?id_offer=${encodeURIComponent(
                fav.id_offer
              )}`
            )
              .then((res) => (res.ok ? res.json() : null))
              .catch(() => null)
              .then((offer) =>
                offer ? { ...offer, id_offer: fav.id_offer } : null
              )
          )
        );
        setOffers(allOffers.filter(Boolean));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, token]);

  return (
    <>
      <h2>Mes offres favorites</h2>
      <div style={boxStyle}>
        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && offers.length === 0 && (
          <p>Aucune offre favorite.</p>
        )}
        {!loading && !error && offers.length > 0 && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Titre</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Prix</th>
                <th style={thStyle}>ID Offre</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id_offer}>
                  <td style={thtdStyle}>{offer.title || "-"}</td>
                  <td style={thtdStyle}>{offer.description || "-"}</td>
                  <td style={thtdStyle}>{offer.price || "-"}</td>
                  <td style={thtdStyle}>{offer.id_offer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default FavoriteOffers;
