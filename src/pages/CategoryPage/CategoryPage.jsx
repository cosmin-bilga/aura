import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CardOffers from "../../components/CardOffers/CardOffers";

import Baby from "../../assets/Garde_denfant.png";
import MassageImg from "../../assets/Massag.png";
import MenageImg from "../../assets/Menage.png";
import BeauteImg from "../../assets/manucure.png";

import BalaiIcon from "../../assets/balai.svg";
import MassageIcon from "../../assets/massage.svg";
import BabyIcon from "../../assets/baby.svg";
import ManucureIcon from "../../assets/manucure.svg";

import "./CategoryPage.scss";

const OFFERS_API_URL = "/api/offers/index.php";

/**
 * Associe une image à un libellé de catégorie.
 */
const getHeroImageForLabel = (label) => {
  const lower = String(label || "").toLowerCase();

  if (lower.includes("garde") && lower.includes("enfant")) {
    return Baby;
  }

  if (lower.includes("massage")) {
    return MassageImg;
  }

  if (
    lower.includes("ménage") ||
    lower.includes("menage") ||
    lower.includes("aide ménagère")
  ) {
    return MenageImg;
  }

  if (
    lower.includes("beauté") ||
    lower.includes("beaute") ||
    lower.includes("esthétique") ||
    lower.includes("manucure")
  ) {
    return BeauteImg;
  }

  return MenageImg;
};

const getIntroIconForLabel = (label) => {
  const lower = String(label || "").toLowerCase();

  if (lower.includes("garde") && lower.includes("enfant")) {
    return BabyIcon;
  }

  if (lower.includes("massage")) {
    return MassageIcon;
  }

  if (
    lower.includes("ménage") ||
    lower.includes("menage") ||
    lower.includes("aide ménagère")
  ) {
    return BalaiIcon;
  }

  if (
    lower.includes("beauté") ||
    lower.includes("beaute") ||
    lower.includes("esthétique") ||
    lower.includes("manucure")
  ) {
    return ManucureIcon;
  }

  return BalaiIcon;
};

const CATEGORY_CONTENT = {
  "Garde d'enfants": {
    serviceName: "Garde d'enfants à domicile",
    heroTitle: "Garde d’enfants à domicile, tout en douceur, chez vous.",
    heroSubtitle:
      "Aura vous accompagne avec des gardes d’enfants bienveillantes, formées et sélectionnées avec soin, pour que vous puissiez souffler en toute confiance.",
    heroImage: Baby,
    badge: "Pour les 0–12 ans",
    introTitle: "Un service pensé pour les enfants… et pour leurs parents.",
    introText:
      "Confier son enfant n’est jamais anodin. Notre service de garde d’enfants à domicile a été conçu pour vous offrir un soutien fiable, chaleureux et adapté à votre rythme de vie.",
    introBullets: [
      "Garde occasionnelle ou régulière, selon vos besoins",
      "Présence rassurante pendant vos rendez-vous et obligations",
      "Aide adaptée aux fratries et aux familles nombreuses",
      "Moments de répit pour souffler ou travailler sereinement",
    ],
    highlights: [
      {
        title: "Environnement rassurant",
        text: "Des interventions à domicile, dans l’univers familier de votre enfant, pour une adaptation plus douce.",
      },
      {
        title: "Prestataires sélectionnés",
        text: "Des profils vérifiés, expérimentés et accompagnés par Aura, pour vous garantir sérieux et bienveillance.",
      },
      {
        title: "Horaires flexibles",
        text: "Des plages horaires adaptées à votre réalité : matin, après-midi, soirée ou week-end.",
      },
      {
        title: "Réservation simplifiée",
        text: "Des services consultables en ligne et la possibilité de réserver rapidement le prestataire qui vous correspond.",
      },
    ],
    stepsTitle: "Comment fonctionne la garde d’enfants Aura ?",
    steps: [
      {
        step: 1,
        title: "Vous décrivez votre besoin",
        text: "Âge de l’enfant, horaires, fréquence, attentes… nous prenons le temps de vous écouter.",
      },
      {
        step: 2,
        title: "Nous identifions un profil de confiance",
        text: "Parmi les prestataires Aura disponibles sur votre zone et vos horaires.",
      },
      {
        step: 3,
        title: "Vous validez la rencontre",
        text: "Un échange pour vérifier que le feeling passe avec votre enfant… et avec vous.",
      },
      {
        step: 4,
        title: "La garde démarre à votre rythme",
        text: "Ponctuelle ou régulière, en journée ou en soirée, selon ce qui vous convient.",
      },
    ],
    testimonialsTitle: "Une approche humaine, professionnelle et de confiance",
    testimonialsTagline: "Respect · Discrétion · Souci du détail",
    testimonials: [
      {
        author: "Camille, maman de deux enfants",
        text: "“Nous avions besoin d’un relais après la crèche. La garde à domicile nous a vraiment soulagés et notre nounou Aura fait désormais partie du quotidien des enfants.”",
      },
      {
        author: "Thomas, papa solo",
        text: "“Je travaille souvent en horaires décalés. Avoir trouvé quelqu’un de fiable pour accompagner ma fille le soir a tout changé.”",
      },
    ],
    contactCtaTitle: "Besoin d’en parler avec quelqu’un ?",
    contactCtaText:
      "Nous pouvons vous aider à clarifier vos besoins et à trouver le type de garde le plus adapté à votre famille.",
    contactCtaButton: "Échanger avec Aura",
  },

  Massage: {
    serviceName: "Massages à domicile",
    heroTitle: "Massages à domicile, pour retrouver calme et énergie.",
    heroSubtitle:
      "Des prestataires qualifiés se déplacent chez vous pour vous offrir un moment de détente profonde, sans avoir à sortir de chez vous.",
    heroImage: MassageImg,
    badge: "Bien-être & détente",
    introTitle: "Un moment pour vous, sans contraintes.",
    introText:
      "Nos prestations de massage à domicile s’adaptent à vos besoins : détente, récupération, relâchement musculaire… Vous choisissez, nous organisons.",
    introBullets: [
      "Massages relaxants ou énergisants",
      "Prestataires formés et déclarés",
      "Interventions à domicile ou sur votre lieu de séjour",
      "Créneaux en journée, en soirée ou le week-end",
    ],
    highlights: [
      {
        title: "Sans déplacement",
        text: "Votre masseur·se vient à vous : plus besoin de courir au salon, vous profitez du soin chez vous.",
      },
      {
        title: "Prestations personnalisées",
        text: "Chaque séance est adaptée à vos besoins, vos douleurs et votre niveau de fatigue.",
      },
      {
        title: "Matériel fourni",
        text: "Table de massage, huile, linges… le prestataire amène le nécessaire, selon l’offre choisie.",
      },
      {
        title: "Réservation en ligne",
        text: "Choisissez votre prestation, votre créneau et validez en quelques clics.",
      },
    ],
    stepsTitle: "Comment fonctionne le service de massage Aura ?",
    steps: [
      {
        step: 1,
        title: "Choisissez votre type de massage",
        text: "Relaxant, sportif, pré/post-natal… sélectionnez la prestation qui vous correspond.",
      },
      {
        step: 2,
        title: "Réservez votre créneau",
        text: "Consultez les offres disponibles et réservez le créneau qui s’intègre le mieux à votre planning.",
      },
      {
        step: 3,
        title: "Préparez votre espace",
        text: "Prévoyez un espace calme, suffisant pour le matériel de massage.",
      },
      {
        step: 4,
        title: "Profitez de la séance",
        text: "Vous n’avez plus qu’à vous détendre, Aura s’occupe du reste.",
      },
    ],
    testimonialsTitle: "Votre bien-être commence ici",
    testimonialsTagline: "Détente · Écoute · Douceur",
    testimonials: [
      {
        author: "Sophie",
        text: "“Un pur moment de détente après une semaine très chargée. Le fait que ce soit à domicile change vraiment tout.”",
      },
      {
        author: "Nadia",
        text: "“J’ai pu adapter l’intensité du massage à mes douleurs de dos. Très à l’écoute et très professionnel.”",
      },
    ],
    contactCtaTitle: "Envie de faire une pause rien que pour vous ?",
    contactCtaText:
      "Expliquez-nous votre besoin, nous vous aiderons à trouver la prestation idéale.",
    contactCtaButton: "Planifier un échange",
  },
};

const getCategoryContent = (categoryKey, offersByCategory) => {
  const rawLabel = offersByCategory[0]?.category || categoryKey || "Service";

  if (CATEGORY_CONTENT[rawLabel]) {
    return CATEGORY_CONTENT[rawLabel];
  }

  const formatted = String(rawLabel).replace(/[_-]/g, " ").trim();

  return {
    serviceName: formatted,
    heroTitle: `${formatted} avec Aura.`,
    heroSubtitle:
      "Aura vous met en relation avec des prestataires sélectionnés pour vous accompagner dans votre quotidien.",
    heroImage: getHeroImageForLabel(rawLabel),
    badge: "Service Aura",
    introTitle: `Un service de ${formatted.toLowerCase()} pensé pour vous.`,
    introText:
      "Découvrez un service flexible, humain et adapté à votre réalité, avec des prestataires de confiance.",
    introBullets: [
      "Prestataires vérifiés et accompagnés",
      "Services flexibles selon vos besoins",
      "Réservation simple et rapide",
    ],
    highlights: [],
    stepsTitle: `Comment fonctionne le service ${formatted} ?`,
    steps: [],
    testimonialsTitle: "Ils nous font confiance",
    testimonials: [],
    contactCtaTitle: "Vous avez des questions ?",
    contactCtaText:
      "Nous sommes disponibles pour vous aider à choisir le service et le prestataire les plus adaptés.",
    contactCtaButton: "Contacter Aura",
  };
};

const CategoryPage = () => {
  const { categoryKey } = useParams();

  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState(null);

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] =
    useState(0);

  const isCustomer = false;

  const getProviderLabel = (offer) =>
    offer.provider_name || "Prestataire Aura";

  const fetchOffers = async () => {
    setLoadingOffers(true);
    setErrorOffers(null);

    try {
      const params = new URLSearchParams();
      params.append("limit", "200");

      const response = await fetch(`${OFFERS_API_URL}?${params.toString()}`, {
        method: "GET",
      });

      const rawText = await response.text();
      console.log(
        "Réponse API CategoryPage offers :",
        response.status,
        rawText
      );

      let data = null;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.warn("Réponse non-JSON CategoryPage offers :", rawText);
        setErrorOffers(
          "La réponse du serveur n'est pas au format JSON. Vérifiez l'API."
        );
        setLoadingOffers(false);
        return;
      }

      if (!response.ok) {
        setErrorOffers(
          (data && data.message) ||
            "Erreur lors du chargement des services de cette catégorie."
        );
        setLoadingOffers(false);
        return;
      }

      if (!Array.isArray(data)) {
        setErrorOffers("Format de données inattendu pour les offres.");
        setLoadingOffers(false);
        return;
      }

      setOffers(data);
      setLoadingOffers(false);
    } catch (err) {
      console.error("Erreur réseau CategoryPage offers :", err);
      setErrorOffers(
        "Erreur réseau ou serveur lors du chargement des services."
      );
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    setSelectedOffer(null);
    setCurrentTestimonialIndex(0);
  }, [categoryKey]);

  const offersByCategory = useMemo(() => {
    if (!categoryKey) return [];
    return offers.filter((o) => o.category === categoryKey);
  }, [offers, categoryKey]);

  const baseContent = getCategoryContent(categoryKey, offersByCategory || []);

  const serviceName =
    baseContent.serviceName ||
    offersByCategory[0]?.category ||
    categoryKey ||
    "Service";

  const introBullets = Array.isArray(baseContent.introBullets)
    ? baseContent.introBullets
    : [];

  const highlights = Array.isArray(baseContent.highlights)
    ? baseContent.highlights
    : [];

  const steps = Array.isArray(baseContent.steps) ? baseContent.steps : [];

  const testimonials = Array.isArray(baseContent.testimonials)
    ? baseContent.testimonials
    : [];

  const heroImage = baseContent.heroImage || getHeroImageForLabel(serviceName);
  const introIcon = getIntroIconForLabel(serviceName);

  const paginatedOffers = offersByCategory.slice(0, 4);
  const filteredOffersCount = offersByCategory.length;
  const currentPage = 1;
  const totalPages = 1;
  const handlePageChange = () => {};

  const hasOffers = !loadingOffers && !errorOffers && filteredOffersCount > 0;

  const currentTestimonial =
    testimonials.length > 0 ? testimonials[currentTestimonialIndex] : null;

  const handleNextTestimonial = () => {
    if (testimonials.length <= 1) return;
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    if (testimonials.length <= 1) return;
    setCurrentTestimonialIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <main className="category-page">
      {/* HERO */}
      <section className="category-page__hero">
        <div className="category-page__hero-inner">
          <div className="category-page__hero-text">
            {baseContent.badge && (
              <span className="category-page__badge">{baseContent.badge}</span>
            )}
            <h1 className="category-page__title">
              {baseContent.heroTitle || `${serviceName} avec Aura.`}
            </h1>
            <p className="category-page__subtitle">
              {baseContent.heroSubtitle ||
                "Aura vous accompagne au quotidien avec des prestataires sélectionnés."}
            </p>

            {introBullets.length > 0 && (
              <ul className="category-page__hero-bullets">
                {introBullets.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="category-page__hero-actions">
              <a href="#offres" className="category-page__primary-cta">
                Découvrir les offres
              </a>
              <Link to="/contact" className="category-page__secondary-cta">
                Parler à Aura
              </Link>
            </div>
          </div>

          <div className="category-page__hero-media">
            <div className="category-page__hero-ellipse" />
            <div className="category-page__hero-image-wrapper">
              <img
                src={heroImage}
                alt={serviceName}
                className="category-page__hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION INTRO */}
      <section className="category-page__section category-page__section--intro">
        <div className="category-page__section-inner category-page__section-inner--intro">
          <div className="category-page__intro-media">
            <div className="category-page__intro-ellipse" />
            <img
              src={introIcon}
              alt={serviceName}
              className="category-page__intro-icon"
            />
          </div>

          <div className="category-page__intro-text">
            <h2 className="category-page__section-title">
              {baseContent.introTitle ||
                `Un service de ${serviceName.toLowerCase()} pour souffler un peu.`}
            </h2>
            <p className="category-page__section-text">
              {baseContent.introText ||
                "Nous avons conçu ce service pour être flexible, humain et adapté à votre quotidien."}
            </p>

            {introBullets.length > 0 && (
              <ul className="category-page__list">
                {introBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* SECTION ÉTAPES */}
      {steps.length > 0 && (
        <section className="category-page__section category-page__section--steps">
          <div className="category-page__section-inner">
            <h2 className="category-page__section-title category-page__section-title--center">
              {baseContent.stepsTitle ||
                `Comment fonctionne le service ${serviceName.toLowerCase()} ?`}
            </h2>

            <div className="category-page__steps-grid">
              {steps.map((s) => (
                <article key={s.step} className="category-page__step-card">
                  <div className="category-page__step-icon">
                    <span>{s.step}</span>
                  </div>
                  <div className="category-page__step-body">
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION APPROCHE + TÉMOIGNAGES */}
      {testimonials.length > 0 && currentTestimonial && (
        <section className="category-page__section category-page__section--testimonials">
          <div className="category-page__section-inner category-page__section-inner--testimonials">
            <div className="category-page__approach">
              <h2 className="category-page__approach-title">
                {baseContent.testimonialsTitle ||
                  "Une approche humaine, professionnelle et de confiance"}
              </h2>
              {baseContent.testimonialsTagline && (
                <p className="category-page__approach-tagline">
                  {baseContent.testimonialsTagline}
                </p>
              )}
              <p className="category-page__approach-text">
                Aura met l’accent sur l’écoute, la douceur et la fiabilité. Nous
                collaborons avec des prestataires qui partagent nos valeurs et
                notre exigence de qualité, pour que chaque intervention soit un
                vrai soutien au quotidien.
              </p>
            </div>

            <div className="category-page__testimonials-slider">
              <p className="category-page__testimonial-heading">
                Avis de familles Aura
              </p>

              <article className="category-page__testimonial-card">
                <p className="category-page__testimonial-text">
                  {currentTestimonial.text}
                </p>
                <p className="category-page__testimonial-author">
                  {currentTestimonial.author}
                </p>
              </article>

              <div className="category-page__testimonial-controls">
                <button
                  type="button"
                  className="category-page__testimonial-arrow"
                  onClick={handlePrevTestimonial}
                  disabled={testimonials.length <= 1}
                  aria-label="Témoignage précédent"
                >
                  ‹
                </button>

                <div className="category-page__testimonial-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`category-page__testimonial-dot${
                        index === currentTestimonialIndex
                          ? " category-page__testimonial-dot--active"
                          : ""
                      }`}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      aria-label={`Aller au témoignage ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="category-page__testimonial-arrow"
                  onClick={handleNextTestimonial}
                  disabled={testimonials.length <= 1}
                  aria-label="Témoignage suivant"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION CTA CONTACT */}
      <section className="category-page__section category-page__section--contact-cta">
        <div className="category-page__section-inner category-page__section-inner--cta">
          <div>
            <h2 className="category-page__section-title">
              {baseContent.contactCtaTitle || "Vous avez des questions ?"}
            </h2>
            <p className="category-page__section-text">
              {baseContent.contactCtaText ||
                "Nous sommes disponibles pour vous aider à choisir le bon service et le bon prestataire."}
            </p>
          </div>
          <Link to="/contact" className="category-page__primary-cta">
            {baseContent.contactCtaButton || "Contacter Aura"}
          </Link>
        </div>
      </section>

      {/* SECTION OFFRES */}
      <section
        id="offres"
        className="category-page__section category-page__section--offers"
      >
        <div className="category-page__section-inner">
          <header className="category-page__offers-header">
            <h2 className="category-page__section-title">
              Nos offres de {serviceName.toLowerCase()}
            </h2>
            <p className="category-page__section-text">
              Retrouvez ici les prestations disponibles actuellement pour ce
              service. Vous pouvez ensuite accéder à la page dédiée pour voir
              toutes les offres et utiliser la barre de recherche détaillée.
            </p>
          </header>

          {errorOffers && (
            <div className="category-page__state category-page__state--error">
              {errorOffers}
            </div>
          )}

          {loadingOffers && !errorOffers && (
            <div className="category-page__state category-page__state--loading">
              Chargement des offres de cette catégorie...
            </div>
          )}

          {!loadingOffers && !errorOffers && !hasOffers && (
            <div className="category-page__state category-page__state--empty">
              Aucune offre disponible pour le moment dans cette catégorie.
            </div>
          )}

          {hasOffers && (
            <>
              <CardOffers
                paginatedOffers={paginatedOffers}
                filteredOffersCount={filteredOffersCount}
                loadingOffers={loadingOffers}
                errorOffers={errorOffers}
                isCustomer={isCustomer}
                isFavorite={() => false}
                onAddFavorite={() => {}}
                onRemoveFavorite={() => {}}
                favLoading={false}
                getProviderLabel={getProviderLabel}
                selectedOffer={null}
                onSelectOffer={() => {}}
                onCloseDetail={() => {}}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isSelectable={false}
              />

              <div className="category-page__see-all">
                <Link
                  to={`/categorie/${categoryKey}/offres`}
                  className="category-page__see-all-btn"
                >
                  Voir toutes les offres de {serviceName.toLowerCase()}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
