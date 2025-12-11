import { useEffect, useState } from "react";

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

const History = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id_customer) return;
    fetch(
      `/api/services/index.php?statut=effectue&id_customer=${user.id_customer}`
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement de l'historique");
        return res.json();
      })
      .then((data) => {
        setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  return (
    <>
      <h2>Historique</h2>
      <div style={boxStyle}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && history.length === 0 && (
          <p>Aucun historique pour le moment.</p>
        )}
        {!loading && !error && history.length > 0 && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Montant</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Référence</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id_service}>
                  <td style={thtdStyle}>{item.service_date || "-"}</td>
                  <td style={thtdStyle}>{item.amount || "-"}</td>
                  <td style={thtdStyle}>{item.statut || "-"}</td>
                  <td style={thtdStyle}>{item.payment_reference || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default History;
