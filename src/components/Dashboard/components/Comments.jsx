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

// Fetch all comments for all services of a user
const Comments = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id_customer) {
      setComments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    // Step 1: Fetch all services for the user
    fetch(
      `/api/services/index.php?id_customer=${encodeURIComponent(
        user.id_customer
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des services");
        return res.json();
      })
      .then(async (services) => {
        if (!Array.isArray(services) || services.length === 0) {
          setComments([]);
          setLoading(false);
          return;
        }
        // Step 2: For each service, fetch its comments
        const allComments = await Promise.all(
          services.map((service) =>
            fetch(
              `/api/comments/index.php?id_service=${encodeURIComponent(
                service.id_service
              )}`
            )
              .then((res) => (res.ok ? res.json() : []))
              .catch(() => [])
              .then((comments) =>
                Array.isArray(comments)
                  ? comments.map((c) => ({
                      ...c,
                      id_service: service.id_service,
                      service_date: service.service_date,
                    }))
                  : []
              )
          )
        );
        // Flatten the array of arrays
        setComments(allComments.flat());
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  return (
    <>
      <h2>Mes commentaires</h2>
      <div style={boxStyle}>
        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && comments.length === 0 && (
          <p>Aucun commentaire pour l'instant.</p>
        )}
        {!loading && !error && comments.length > 0 && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Date du service</th>
                <th style={thStyle}>Date du commentaire</th>
                <th style={thStyle}>Note</th>
                <th style={thStyle}>Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((item) => (
                <tr key={item.id_comment}>
                  <td style={thtdStyle}>{item.service_date || "-"}</td>
                  <td style={thtdStyle}>{item.comment_date || "-"}</td>
                  <td style={thtdStyle}>{item.notation || "-"}</td>
                  <td style={thtdStyle}>{item.comment || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Comments;
