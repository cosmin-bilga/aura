import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/useAuth';

export default function DashContent({ user, role }) {
  const { token } = useAuth();

  const decodeHTMLEntities = (text) => {
    if (!text) return "";
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };
  const [providerData, setProviderData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOffer, setNewOffer] = useState({
    category: 'Ménage',
    description: '',
    duration: 60,
    price: 0,
    price: 0,
    perimeter_of_displacement: '10km',
    disponibility: 'flexible'
  });
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);

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

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    try {
      if (!newOffer.description || newOffer.description.length < 10) {
        throw new Error("La description doit faire au moins 10 caractères.");
      }
      if (newOffer.price <= 0) {
        throw new Error("Le prix doit être positif.");
      }

      const formData = new FormData();
      formData.append('id_provider', user.id_provider);
      formData.append('category', newOffer.category);
      formData.append('description', newOffer.description);
      formData.append('duration', newOffer.duration);
      formData.append('price', newOffer.price);
      formData.append('perimeter_of_displacement', newOffer.perimeter_of_displacement);
      formData.append('disponibility', newOffer.disponibility || 'flexible');

      const response = await fetch('/api/offer/', {
        method: 'POST',
        headers: {
          'X-API-KEY': token,
          
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la création de l'offre");
      }

      setCreateSuccess("Offre créée avec succès !");
      setShowCreateForm(false);
      setNewOffer({
        category: 'Ménage',
        description: '',
        duration: 60,
        price: 0,
        perimeter_of_displacement: '10km',
        disponibility: 'flexible'
      });

      
      const offersResponse = await fetch(`/api/offers/?id_provider=${user.id_provider}`, {
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
      setCreateError(err.message);
    }
  };

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

      <div style={{ marginBottom: '2rem' }}>
        {role === 'provider' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              marginTop: '1rem',
              padding: '10px 20px',
              backgroundColor: showCreateForm ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showCreateForm ? 'Annuler' : 'Créer une nouvelle offre'}
          </button>
        )}

        {createSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{createSuccess}</p>}
        {createError && <p style={{ color: 'red', marginTop: '10px' }}>{createError}</p>}

        {showCreateForm && role === 'provider' && (
          <form onSubmit={handleCreateOffer} style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Catégorie:</label>
              <select
                value={newOffer.category}
                onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="Ménage">Ménage</option>
                <option value="Garde_denfant">Garde d'enfant</option>
                <option value="Beauté">Beauté</option>
                <option value="Massage">Massage</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
              <textarea
                value={newOffer.description}
                onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                style={{ width: '100%', padding: '8px', minHeight: '100px' }}
                placeholder="Décrivez votre offre (min 10 caractères)"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Durée (minutes):</label>
              <input
                type="number"
                value={newOffer.duration}
                onChange={(e) => setNewOffer({ ...newOffer, duration: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '8px' }}
                min="30"
                max="999"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Prix (€):</label>
              <input
                type="number"
                value={newOffer.price}
                onChange={(e) => setNewOffer({ ...newOffer, price: parseFloat(e.target.value) })}
                style={{ width: '100%', padding: '8px' }}
                min="0"
                step="0.01"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Périmètre de déplacement:</label>
              <select
                value={newOffer.perimeter_of_displacement}
                onChange={(e) => setNewOffer({ ...newOffer, perimeter_of_displacement: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="5km">5 km</option>
                <option value="10km">10 km</option>
                <option value="15km">15 km</option>
                <option value="20km">20 km</option>
                <option value="30km">30 km</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Enregistrer l'offre
            </button>
          </form>
        )}
      </div>

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
              <h3>{decodeHTMLEntities(offer.category)}</h3>
              <p>{decodeHTMLEntities(offer.description)}</p>
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