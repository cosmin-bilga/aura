import "./Home.scss";

import heroWoman from "../assets/hero-woman.png";
import nailService from "../assets/Rhapsody-Road-Photography-Sherille-Riley-Beauty-Edit-Launch-Nails-Brows-Mayfair-©-Emma-Lambe-0005-DSC_5730-scaled.jpg";
import massageService from "../assets/R.jpeg";
import menageService from "../assets/femme de ménage.png";

export default function Home() {
  return (
    <main className="aura-home">
      {/* HERO */}
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

      {/* NOS SERVICES – fond menthe + 3 grandes cartes */}
      <section className="aura-services">
        <div className="aura-services__inner">
          <h2 className="aura-services__title">Nos services</h2>
          <p className="aura-services__subtitle">
            Soutenir votre quotidien avec des prestations de bien-être, de
            beauté et d&apos;aide à domicile pensées pour vraiment vous
            soulager.
          </p>

          <div className="aura-services__grid">
            {/* Carte 1 */}
            <article className="aura-services-card">
              <img src={nailService} alt="Onglerie et soins beauté" />
              <div className="aura-services-card__overlay">
                <h3 className="aura-services-card__title">
                  Beauté &amp; soins
                </h3>
                <button className="aura-services-card__btn">
                  En savoir plus
                </button>
              </div>
            </article>

            {/* Carte 2 */}
            <article className="aura-services-card">
              <img src={massageService} alt="Moment de détente massage" />
              <div className="aura-services-card__overlay">
                <h3 className="aura-services-card__title">Bien-être</h3>
                <button className="aura-services-card__btn">
                  En savoir plus
                </button>
              </div>
            </article>

            {/* Carte 3 */}
            <article className="aura-services-card">
              <img src={menageService} alt="Aide ménagère à domicile" />
              <div className="aura-services-card__overlay">
                <h3 className="aura-services-card__title">
                  Aide à domicile &amp; ménage
                </h3>
                <button className="aura-services-card__btn">
                  En savoir plus
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE – bande 3 colonnes style carte pastel */}
      <section className="aura-how">
        <div className="aura-how__inner">
          <h2 className="aura-how__title">Comment ça marche ?</h2>
          <p className="aura-how__subtitle">
            Aura vous accompagne à chaque étape, de la première demande à la
            prestation réalisée à domicile.
          </p>

          <div className="aura-how__grid">
            <article className="aura-how-card aura-how-card--left">
              <div className="aura-how-card__icon">♡</div>
              <h3 className="aura-how-card__title">
                1. Parlez-nous de vos besoins
              </h3>
              <p className="aura-how-card__text">
                Vous décrivez votre situation, vos contraintes et vos envies.
                Nous prenons le temps de comprendre ce qui vous ferait vraiment
                du bien.
              </p>
            </article>

            <article className="aura-how-card aura-how-card--center">
              <div className="aura-how-card__icon">★</div>
              <h3 className="aura-how-card__title">
                2. Nous trouvons le bon prestataire
              </h3>
              <p className="aura-how-card__text">
                Nous sélectionnons des professionnels de confiance, vérifiés et
                alignés avec vos attentes, pour intervenir chez vous en toute
                sérénité.
              </p>
            </article>

            <article className="aura-how-card aura-how-card--right">
              <div className="aura-how-card__icon">⏱</div>
              <h3 className="aura-how-card__title">
                3. Vous gagnez du temps &amp; de l&apos;énergie
              </h3>
              <p className="aura-how-card__text">
                Vous profitez de votre temps libre pendant que les prestations
                sont réalisées à domicile, dans le respect de votre rythme.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION QUI SOMMES NOUS (on laisse simple pour l’instant) */}
      <section className="aura-about">
        <div className="aura-about__inner">
          <h2 className="aura-about__title">Qui sommes-nous ?</h2>

          <p className="aura-about__text">
            Chez Aura, nous croyons qu&apos;un quotidien plus simple et plus
            léger change tout. Notre équipe accompagne chaque personne avec
            bienveillance et professionnalisme, en proposant des services
            adaptés à ses besoins réels. Nous mettons le bien-être, la confiance
            et la qualité au cœur de chaque intervention afin de vous offrir un
            environnement plus serein, plus organisé et plus harmonieux jour
            après jour.
          </p>

          <button className="aura-about__cta">Témoignages</button>
        </div>
      </section>

      {/* OFFRE SPÉCIALE – placeholder (tu pourras remplir après) */}
      <section className="aura-annecdotes">
        <h2 className="aura-annecdotes__title">Offre spéciale</h2>
        <p className="aura-annecdotes__subtitle">
          Des avantages ponctuels pour profiter de nos services au meilleur
          prix.
        </p>

        <div className="aura-annecdotes__grid"></div>
      </section>
    </main>
  );
}
