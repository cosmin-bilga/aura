import { Helmet } from "react-helmet-async";

const OfferDetail = ({ offer }) => {
  return (
    <>
      <Helmet>
        <title>{offer?.title || "Détail de l'offre"} | Aura Services</title>
        <meta
          name="description"
          content={
            offer?.description ||
            "Découvrez tous les détails de cette offre Aura Services."
          }
        />
        <meta property="og:title" content={offer?.title} />
        <meta property="og:description" content={offer?.description} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div>
        <h1>{offer?.title || "Détail de l'offre"}</h1>
      </div>
    </>
  );
};

export default OfferDetail;
