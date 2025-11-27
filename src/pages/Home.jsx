import "./Home.scss";
import heroWoman from "../assets/hero-woman.png";
import nailService from "../assets/Rhapsody-Road-Photography-Sherille-Riley-Beauty-Edit-Launch-Nails-Brows-Mayfair-©-Emma-Lambe-0005-DSC_5730-scaled.jpg";
import massageService from "../assets/R.jpeg";
import menageService from "../assets/femme de ménage.png";

export default function Home() {
  return (
    <main className="aura-home">
      <section className="aura-hero">
        <div className="aura-hero__content">
          <h1 className="aura-hero__title">
            <span>Feel Good,</span>
            <span>Feel Light,</span>
            <span>Feel Ora</span>
          </h1>

          <button type="button" className="aura-hero__cta">
            Commencer
          </button>
        </div>

        <div className="aura-hero__visual">
          <div className="aura-hero__circle" />
          <img
            src={heroWoman}
            alt="Femme souriante les bras levés"
            className="aura-hero__image"
          />
        </div>
      </section>

      <section className="aura-services">
        <h2 className="aura-services__title">Nos Services</h2>
        <p className="aura-services__subtitle">
          Découvrez nos prestations bien-être, beauté et aide à domicile.
        </p>

        <div className="aura-services__grid">
          {/* Onglerie */}
          <div className="aura-service-card">
            <img src={nailService} alt="Onglerie" />
            <div className="aura-service-card__overlay">
              <button className="aura-service-card__btn">En savoir plus</button>
            </div>
          </div>

          {/* Massage */}
          <div className="aura-service-card">
            <img src={menageService} alt="Massage" />
            <div className="aura-service-card__overlay">
              <button className="aura-service-card__btn">En savoir plus</button>
            </div>
          </div>

          {/* Femme de ménage */}
          <div className="aura-service-card">
            <img src={massageService} alt="Femme de ménage" />
            <div className="aura-service-card__overlay">
              <button className="aura-service-card__btn">En savoir plus</button>
            </div>
          </div>
        </div>
      </section>
      {/* SECTION QUI SOMMES NOUS */}
      <section className="aura-about">
        <div className="aura-about__inner">
          <h2 className="aura-about__title">Qui sommes nous ?</h2>

          <p className="aura-about__text">
            <p className="aura-about__text">
              Chez Aura, nous croyons qu’un quotidien plus simple et plus léger
              change tout. Notre équipe accompagne chaque personne avec
              bienveillance et professionnalisme, en proposant des services
              adaptés à ses besoins réels. Nous mettons le bien-être, la
              confiance et la qualité au cœur de chaque intervention afin de
              vous offrir un environnement plus serein, plus organisé et plus
              harmonieux jour après jour.
            </p>
          </p>

          <button className="aura-about__cta">Témoignages</button>
        </div>
      </section>
      <section className="aura-annecdotes">
        <h2 className="aura-annecdotes__title">Annecdotes</h2>
        <p className="aura-annecdotes__subtitle">
          Découvrez nos prestations bien-être, beauté et aide à domicile.
        </p>

        <div className="aura-annecdotes__grid"></div>
      </section>

      <section className="aura-define">
        <h2 className="aura-define__title">Annecdotes</h2>
        <p className="aura-define__subtitle">
          Découvrez nos prestations bien-être, beauté et aide à domicile.
        </p>

        <div className="aura-define__grid"></div>
      </section>
    </main>
  );
}
