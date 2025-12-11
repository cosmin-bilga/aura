import { useEffect, useState } from "react";
import Profile from "./components/Profile";
import History from "./components/History";
import Comments from "./components/Comments";
import FavoriteOffers from "./components/FavoriteOffers";
import AllOffers from "./AllOffers";
import AllProviders from "./AllProviders";
import AllCustomers from "./AllCustomers";

export default function DashContent({ user }) {
  const [activePage, setActivePage] = useState("profil");

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

      {activePage === "profil" && <Profile user={user} />}
      {activePage === "historique" && <History user={user} />}
      {activePage === "commentaires" && <Comments user={user} />}
      {activePage === "offres-favoris" && <FavoriteOffers user={user} />}

      {/* Admin pages */}
      {activePage === "toutes-les-offres" && <AllOffers />}
      {activePage === "tous-les-prestataires" && <AllProviders />}
      {activePage === "tous-les-clients" && <AllCustomers />}
    </main>
  );
}