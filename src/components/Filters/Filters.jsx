import data from "../../mocks/data.json";
import "./Filters.css";

const Filters = ({ filters, setFilters }) => {
  return (
    <div className="categoryOffers__filters">
      {/* Prestataire */}
      <select
        value={filters.provider}
        onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
      >
        <option value="">Tous les prestataires</option>
        {data.service_providers.map((prov) => (
          <option key={prov.id_provider} value={prov.id_provider}>
            {prov.firstname} {prov.name}
          </option>
        ))}
      </select>

      {/* Durée */}
      <select
        value={filters.duration}
        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
      >
        <option value="">Toutes durées</option>
        {[...new Set(data.offers.map((o) => o.duration))].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Disponibilité */}
      <select
        value={filters.disponibility}
        onChange={(e) =>
          setFilters({ ...filters, disponibility: e.target.value })
        }
      >
        <option value="">Toutes disponibilités</option>
        {[...new Set(data.offers.map((o) => o.disponibility))].map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Périmètre */}
      <select
        value={filters.perimeter}
        onChange={(e) => setFilters({ ...filters, perimeter: e.target.value })}
      >
        <option value="">Tous périmètres</option>
        {[...new Set(data.offers.map((o) => o.perimeter_of_displacement))].map(
          (p) => (
            <option key={p} value={p}>
              {p}
            </option>
          )
        )}
      </select>

      {/* Prix max */}
      <input
        type="number"
        placeholder="Prix max"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
      />
    </div>
  );
};

export default Filters;
