import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";
import OfferCard from "./../../components/OfferCard/OfferCard.jsx";
import MockData from "../../mocks/data.json";

const CategoryPage = () => {
  const { categoryKey } = useParams();
  console.log(categoryKey);
  // Récupérer la catégorie
  const category = MockData.categories_list.find(
    (cat) => cat.key === categoryKey
  );

  // Récupérer les offres de cette catégorie (limitées à 4)
  const offers = MockData.offers
    .filter((offer) => offer.category === categoryKey)
    .slice(0, 4);
  console.log(categoryKey, category);
  if (!category) return <p>Catégorie introuvable</p>;

  return (
    <div className="category-page">
      <header className="category-page__header">
        <h1 className="category-page__title">{category.name}</h1>
        <p className="category-page__description">
          {/* Description générique, à adapter selon les besoins */}
          Découvrez nos services de {category.name}. Choisissez le meilleur
          prestataire pour vous.
        </p>
      </header>

      <section className="category-page__offers">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <OfferCard key={offer.id_offer} offer={offer} />
          ))
        ) : (
          <p>Aucune offre disponible pour le moment.</p>
        )}
      </section>

      {offers.length > 0 && (
        <div className="category-page__see-all">
          <Link
            to={`/categorie/${categoryKey}/offres`}
            className="btn btn-primary"
          >
            Voir toutes les offres
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
