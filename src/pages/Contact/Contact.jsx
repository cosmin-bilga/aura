import React, { useState } from 'react';

import './Contact.css';

const Contact = () => {
  // États pour gérer le formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^[0-9]{10}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Numéro invalide (10 chiffres)';
    }

    if (!formData.sujet.trim()) {
      newErrors.sujet = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Le message doit contenir au moins 20 caractères';
    }

    return newErrors;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Données du formulaire:', formData);
      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          sujet: '',
          message: ''
        });
        setSubmitStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <main className="aura-contact">
        {/* Section Hero */}
        <section className="contact-hero">
          <div className="contact-hero__overlay"></div>
          <div className="contact-hero__content">
            <h1 className="contact-hero__title">
              <span>Contactez-Nous</span>
              <span className="contact-hero__title-gradient">
                Nous Sommes À Votre Écoute
              </span>
            </h1>
            <p className="contact-hero__subtitle">
              Une question ? Un besoin ? Notre équipe est là pour vous accompagner
              et vous aider à réserver la prestation qui vous convient : massage,
              beauté, garde d’enfant ou ménage à domicile.
            </p>
          </div>
        </section>

        {/* Section Informations */}
        <section className="contact-info">
          <div className="contact-info__container">
            <div className="contact-info__grid">
              <div className="info-card">
                <div className="info-card__icon">📍</div>
                <h3 className="info-card__title">Notre Adresse</h3>
                <p className="info-card__text" itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
                  123 Avenue de la Beauté<br />
                  75008 Paris, France
                </p>
              </div>

              <div className="info-card">
                <div className="info-card__icon">📞</div>
                <h3 className="info-card__title">Téléphone</h3>
                <p className="info-card__text" itemprop="telephone">
                  +33 1 47 25 30 16<br />
                 lundi - vendredi : 9h - 18h
                </p>
               
              </div>

              <div className="info-card">
                <div className="info-card__icon">✉️</div>
                <h3 className="info-card__title">Email</h3>
                <p className="info-card__text">
                  <span  itemprop="email">Claude.Martin@auradev.fr</span><br />
                  Réponse sous 24h
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Formulaire */}
        <section className="contact-form-section">
          <div className="contact-form-container">
            <h2 className="contact-form__title">Envoyez-nous un message</h2>
            <p className="contact-form__subtitle">
              Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
            </p>

            {submitStatus === 'success' && (
              <div className="alert alert--success">
                ✓ Message envoyé avec succès ! Nous vous répondrons bientôt.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="alert alert--error">
                ✕ Erreur lors de l&apos;envoi. Veuillez réessayer.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">Nom *</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={errors.nom ? 'error' : ''}
                    placeholder="Votre nom"
                  />
                  {errors.nom && <span className="error-message">{errors.nom}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="prenom">Prénom *</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={errors.prenom ? 'error' : ''}
                    placeholder="Votre prénom"
                  />
                  {errors.prenom && <span className="error-message">{errors.prenom}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="exemple@email.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="telephone">Téléphone *</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={errors.telephone ? 'error' : ''}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.telephone && <span className="error-message">{errors.telephone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sujet">Sujet *</label>
                <input
                  type="text"
                  id="sujet"
                  name="sujet"
                  value={formData.sujet}
                  onChange={handleChange}
                  className={errors.sujet ? 'error' : ''}
                  placeholder="Objet de votre message"
                />
                {errors.sujet && <span className="error-message">{errors.sujet}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Écrivez votre message ici..."
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Contact;
