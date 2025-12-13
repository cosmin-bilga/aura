import React, { useEffect, useState } from "react";

export default function AllProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/providers/index.php")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des prestataires...</div>;

  return (
    <div>
      <h2>Tous les prestataires</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider.id_provider}>
              <td>{provider.id_provider}</td>
              <td>{provider.name}</td>
              <td>{provider.email}</td>
              <td>{provider.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
