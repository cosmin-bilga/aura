

import "./cgv.css";
export default function Cgv() {
  return (
    <main className="cgv-page">
      <header>
        <h1>Conditions Générales de Vente</h1>
        <p>Aura Services – Services à domicile</p>
        <p>Dernière mise à jour : <strong>19 novembre 2025</strong></p>
      </header>

      <section>
        <h2>1. Informations sur l’entreprise</h2>
        <p><strong>Aura Services</strong> — SARL au capital de 5 000 €</p>
        <p>
          Adresse : 15 rue de la République, 78000 Versailles<br />
          SIRET : 123 456 789 00012<br />
          N° TVA : FR12 123456789
        </p>
        <p>
          Email : <a href="mailto:Claude.admin@auradev.fr">Claude.admin@auradev.fr
</a><br />
          Téléphone : 01 47 25 30 16<br />
          Site web : <a href="Home.jsx">www.aura-services.fr</a> 
        </p>
        <p>
          Assurance RC Pro : Allianz France – Police n°123456789, couverture 2 000 000 €.
        </p>
      </section>

      <section>
        <h2>2. Services proposés</h2>

        <h3>Massage et bien-être</h3>
        <ul>
          <li>Massage relaxant</li>
          <li>Massage thérapeutique</li>
          <li>Réflexologie</li>
        </ul>
        <p>Durées : 30 min, 1h, 1h30</p>

        <h3>Coiffure à domicile</h3>
        <ul>
          <li>Coupe homme, femme, enfant</li>
          <li>Coloration et mèches</li>
          <li>Coiffure événement</li>
          <li>Soins capillaires</li>
        </ul>

        <h3>Garde d’enfants</h3>
        <ul>
          <li>Garde ponctuelle ou régulière</li>
          <li>Aide aux devoirs</li>
          <li>Activités éducatives</li>
        </ul>
        <p>Âge : 3 mois à 12 ans</p>

        <h3>Ménage et entretien</h3>
        <ul>
          <li>Ménage courant</li>
          <li>Repassage</li>
          <li>Nettoyage approfondi</li>
          <li>Entretien ponctuel ou régulier</li>
        </ul>
      </section>

      <section>
        <h2>3. Zones d’intervention</h2>
        <ul>
          <li>Versailles et agglomération</li>
          <li>Saint-Quentin-en-Yvelines</li>
          <li>Départements 78 et 92</li>
        </ul>
      </section>

      <section>
        <h2>4. Tarifs</h2>

        <h3>Massages</h3>
        <ul>
          <li>30 min : 35 €</li>
          <li>1 heure : 60 €</li>
          <li>1h30 : 85 €</li>
        </ul>

        <h3>Coiffure</h3>
        <ul>
          <li>Coupe homme : 30 €</li>
          <li>Coupe femme : 40 €</li>
          <li>Coupe enfant : 20 €</li>
          <li>Coloration : dès 60 €</li>
          <li>Coiffure événement : 80 €</li>
        </ul>

        <h3>Garde d’enfants</h3>
        <p>
          Tarif horaire : 15 €/h<br />
          Minimum : 2 h<br />
          Majoration soirée : +3 €/h<br />
          Majoration dimanche/jours fériés : +5 €/h
        </p>

        <h3>Ménage</h3>
        <p>
          Tarif horaire : 25 €/h<br />
          Forfait 3h : 70 €<br />
          Forfait 5h : 110 €<br />
          Repassage seul : 20 €
        </p>

        <h3>Frais de déplacement</h3>
        <p>
          Gratuit dans un rayon de 10 km<br />
          Au-delà : 0,50 €/km
        </p>
      </section>

      <section>
        <h2>5. Moyens de paiement</h2>
        <ul>
          <li>Espèces</li>
          <li>Chèque</li>
          <li>CB (sur place ou en ligne)</li>
          <li>Virement bancaire</li>
          <li>CESU</li>
        </ul>
      </section>

      <section>
        <h2>6. Horaires</h2>
        <p>Lundi – Samedi : 8h – 20h</p>
        <p>Dimanche : 9h – 18h (avec majoration)</p>
        <h3>Service client</h3>
        <p>Lundi – Vendredi : 9h – 18h</p>
        <p>Samedi : 9h – 13h</p>
      </section>

      <section>
        <h2>7. Politique d’annulation</h2>
        <ul>
          <li>Plus de 24h : gratuit</li>
          <li>Entre 24h et 12h : 50% facturé</li>
          <li>Moins de 12h : 100% facturé</li>
          <li>Absence du client : 100% facturé</li>
        </ul>
      </section>

      <section>
        <h2>8. Médiation</h2>
        <p>
          AME CONSO<br />
          11 Place Dauphine, 75001 Paris<br />
          Site : www.mediationconso-ame.com
        </p>
      </section>

      <section>
        <h2>9. Crédit d’impôt</h2>
        <p>
          Certains services (ménage, garde d’enfants) sont éligibles à un crédit
          d’impôt de 50%.
        </p>
      </section>
    </main>
  );
}
