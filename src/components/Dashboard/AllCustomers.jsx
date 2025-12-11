import React, { useEffect, useState } from "react";

export default function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/index.php")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des clients...</div>;

  return (
    <div>
      <h2>Tous les clients</h2>
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
          {customers.map((customer) => (
            <tr key={customer.id_customer}>
              <td>{customer.id_customer}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
