import "./OfferCard.css";

const OfferCard = ({ offer }) => {
  return (
    <div className="offer-card">
      <h3 className="offer-card__title">{offer.description}</h3>
      <p className="offer-card__details">
        Durée : {offer.duration} | Prix : {offer.price}€ | Disponibilité :{" "}
        {offer.disponibility}
      </p>
      <p className="offer-card__provider">Prestataire : {offer.id_provider}</p>
    </div>
  );
};

export default OfferCard;
