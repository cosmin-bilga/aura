import "./Home.scss";
import heroWoman from "../assets/hero-woman.png";

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
    </main>
  );
}