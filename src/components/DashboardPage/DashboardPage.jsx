// src/components/DashboardPage/DashboardPage.jsx
const DashboardPage = ({ role, page }) => {
  return (
    <div className="dashboard-page">
      <h2>
        {role.toUpperCase()} - {page.charAt(0).toUpperCase() + page.slice(1)}
      </h2>
      <p>
        Contenu de la page "{page}" pour le rôle "{role}"
      </p>
    </div>
  );
};

export default DashboardPage;
