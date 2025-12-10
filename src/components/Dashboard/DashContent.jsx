import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';

export default function DashContent({ user, role }) {
  const { token } = useAuth(); 
  const [providerData, setProviderData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviderData = async () => {
      if (role !== 'provider') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        
        const id_provider = user.id_provider;

        if (!token || !id_provider) {
          throw new Error('Non authentifié');
        }

       
        const response = await fetch(`/api/provider/?id_provider=${id_provider}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        setProviderData(data);

     
        const offersResponse = await fetch(`/api/offers/?id_provider=${id_provider}`, {
          method: 'GET',
          headers: {
            'X-API-KEY': token,
            'Content-Type': 'application/json'
          }
        });

        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          setOffers(Array.isArray(offersData) ? offersData : []);
        }

      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [role, user, token]);

  if (loading) {
    return (
      <main className="dash-content" style={{ padding: '2rem' }}>
        <p>Chargement des données...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dash-content" style={{ padding: '2rem' }}>
        <p style={{ color: 'red' }}>Erreur: {error}</p>
      </main>
    );
  }

  return (
    <main
      className="dash-content"
      style={{
        flex: 1,
        padding: "2rem",
        overflowY: "auto",
        backgroundColor: "#fff",
      }}
    >
      <h1>Bienvenue, {providerData?.firstname || user.firstname} !</h1>

      {providerData && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h2>Vos informations</h2>
          <p><strong>Email:</strong> {providerData.email}</p>
          <p><strong>Téléphone:</strong> {providerData.phone_number}</p>
          <p><strong>SIREN:</strong> {providerData.SIREN}</p>
          <p><strong>Statut:</strong> {providerData.status}</p>
        </div>
      )}

      <h2>Vos offres ({offers.length})</h2>
      <div
        className="offers-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.id_offer}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
              }}
            >
              <h3>{offer.category}</h3>
              <p>{offer.description}</p>
              <p>Durée: {offer.duration}</p>
              <p>Prix: {offer.price}€</p>
            </div>
          ))
        ) : (
          <p>Aucune offre pour le moment</p>
        )}
      </div>
    </main>
  );
}
