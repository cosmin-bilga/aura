import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.scss";

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+_#-])[A-Za-z\d@$!%*?&.,;:+_#-]{8,}$/;

const phoneNumberRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// URL EXACTE de l’API prestataire
const PROVIDER_API_URL = "/api/provider/index.php";
// URL EXACTE de l’API client
const CUSTOMER_API_URL = "/api/customer/index.php";

const Register = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "client",

    // Champs communs
    name: "",
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    sex: "Autre",
    additionalInformation: "",
    profile_picture: "",

    // Champs prestataire
    siren: "",
    statut: "Micro-entreprise",
    education: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getStepErrors = (data, currentStep) => {
    const newErrors = {};

    // Step 1 : email + password
    if (currentStep === 1) {
      if (!data.email) {
        newErrors.email = "L’adresse email est obligatoire.";
      } else if (!strictEmailRegex.test(data.email)) {
        newErrors.email = "Adresse email invalide (ex : nom@domaine.fr).";
      }

      if (!data.password) {
        newErrors.password = "Le mot de passe est obligatoire.";
      } else if (!passwordRegex.test(data.password)) {
        newErrors.password =
          "Le mot de passe doit contenir 8 caractères min., avec majuscule, minuscule, chiffre et symbole.";
      }

      if (!data.confirmPassword) {
        newErrors.confirmPassword =
          "La confirmation du mot de passe est obligatoire.";
      } else if (data.confirmPassword !== data.password) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
      }
    }

    // Step 2 : infos perso
    if (currentStep === 2) {
      if (!data.firstname.trim() || data.firstname.trim().length < 2) {
        newErrors.firstname = "Le prénom doit contenir au moins 2 caractères.";
      }

      if (!data.name.trim() || data.name.trim().length < 2) {
        newErrors.name = "Le nom doit contenir au moins 2 caractères.";
      }

      if (!data.phoneNumber) {
        newErrors.phoneNumber = "Le numéro de téléphone est obligatoire.";
      } else if (!phoneNumberRegex.test(data.phoneNumber)) {
        newErrors.phoneNumber =
          "Format invalide. Utilisez 0X XX XX XX XX (ex : 01 23 45 67 89).";
      }

      if (!data.sex) {
        newErrors.sex = "Merci de sélectionner un sexe.";
      }
    }

    // Step 3 : adresse + éventuels champs prestataire
    if (currentStep === 3) {
      if (!data.address.trim()) {
        newErrors.address = "L’adresse est obligatoire.";
      }

      if (data.role === "prestataire") {
        if (!data.siren.trim()) {
          newErrors.siren = "Le numéro SIREN est obligatoire.";
        } else if (!/^\d{9}$/.test(data.siren.trim())) {
          newErrors.siren = "Le numéro SIREN doit contenir 9 chiffres.";
        }

        if (!data.statut) {
          newErrors.statut = "Le statut est obligatoire.";
        }

        if (!data.education.trim()) {
          newErrors.education =
            "Merci de préciser votre expérience / formation.";
        }
      }
    }

    return newErrors;
  };

  const validateStep = () => {
    const newErrors = getStepErrors(formData, step);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updatedData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedData);

    const stepErrors = getStepErrors(updatedData, step);
    setErrors(stepErrors);
  };

  const handleRoleChange = (role) => {
    const updatedData = {
      ...formData,
      role,
    };
    setFormData(updatedData);

    if (step === 3) {
      const stepErrors = getStepErrors(updatedData, 3);
      setErrors(stepErrors);
    }
  };

  const handleNext = (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
    setErrors({});
  };

  const handlePrev = (event) => {
    event.preventDefault();
    setStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    try {
      if (formData.role === "client") {
        // ========= BRANCHE CLIENT : appel API =========
        const registrationData = {
          name: formData.name,
          firstname: formData.firstname,
          email: formData.email,
          password: formData.password,

          // IMPORTANT : pour matcher customer_validation.php
          password_confirm: formData.confirmPassword,

          phone_number: formData.phoneNumber,
          address: formData.address,
          sex: formData.sex,
          additional_information: formData.additionalInformation || "",
        };

        console.log(
          "Inscription Client – données envoyées à l’API :",
          registrationData
        );

        const formBody = new URLSearchParams();
        Object.entries(registrationData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formBody.append(key, value);
          }
        });

        const response = await fetch(CUSTOMER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formBody.toString(),
        });

        const rawText = await response.text();
        console.log(
          "Réponse brute API client (register) :",
          response.status,
          rawText
        );

        let data = null;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          console.warn(
            "Réponse non-JSON ou JSON invalide côté client :",
            rawText
          );
        }

        if (!response.ok) {
          const errorMessage =
            (data && data.message) ||
            rawText ||
            "Une erreur est survenue lors de l’inscription client.";
          alert(errorMessage);
          setLoading(false);
          return;
        }

        alert(
          (data && data.message) ||
            "Inscription Client validée. Redirection vers la connexion."
        );
        setLoading(false);
        navigate("/connexion");
      } else {
        // ========= BRANCHE PRESTATAIRE : appel API prestataire =========
        const registrationData = {
          name: formData.name,
          firstname: formData.firstname,
          email: formData.email,
          password: formData.password,

          // On envoie plusieurs variantes pour coller à ce que le back attend
          password_confirm: formData.confirmPassword,
          confirm_password: formData.confirmPassword,
          passwordConfirm: formData.confirmPassword,
          confirmPassword: formData.confirmPassword,

          phone_number: formData.phoneNumber,
          address: formData.address,
          sex: formData.sex,
          SIREN: formData.siren,
          statut: formData.statut,
          education_experience: formData.education,
          additional_information: formData.additionalInformation || "",
          profile_picture: "",
        };

        console.log(
          "Inscription Prestataire – données envoyées à l’API :",
          registrationData
        );

        const formBody = new URLSearchParams();
        Object.entries(registrationData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formBody.append(key, value);
          }
        });

        const response = await fetch(PROVIDER_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formBody.toString(),
        });

        const rawText = await response.text();
        console.log("Réponse brute API prestataire :", rawText);

        let data = null;
        try {
          data = JSON.parse(rawText);
        } catch (e) {
          console.warn("Réponse non-JSON ou JSON invalide :", rawText);
        }

        if (!response.ok) {
          const errorMessage =
            (data && data.message) ||
            rawText ||
            "Une erreur est survenue lors de l’inscription prestataire.";
          alert(errorMessage);
          setLoading(false);
          return;
        }

        alert(
          (data && data.message) ||
            "Inscription Prestataire validée. Redirection vers la connexion."
        );
        setLoading(false);
        navigate("/connexion");
      }
    } catch (error) {
      console.error("Erreur lors de l’inscription :", error);
      alert(
        "Erreur réseau ou serveur : " + (error.message || "Erreur inconnue")
      );
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-hero">
        <div className="register-hero__content">
          <h1 className="register-hero__title">Créer mon compte Aura</h1>
          <p className="register-hero__subtitle">
            En quelques étapes, créez un espace sécurisé pour réserver des
            services ou proposer vos prestations.
          </p>
        </div>
      </section>

      <section className="register-section">
        <div className="register-card">
          {/* Pagination en 3 étapes */}
          <div className="register-steps">
            <div
              className={
                "register-step " +
                (step === 1
                  ? "register-step--active"
                  : step > 1
                  ? "register-step--done"
                  : "")
              }
            >
              <span className="register-step__index">1</span>
            </div>
            <div
              className={
                "register-step " +
                (step === 2
                  ? "register-step--active"
                  : step > 2
                  ? "register-step--done"
                  : "")
              }
            >
              <span className="register-step__index">2</span>
            </div>
            <div
              className={
                "register-step " + (step === 3 ? "register-step--active" : "")
              }
            >
              <span className="register-step__index">3</span>
            </div>
          </div>

          {/* Formulaire en plusieurs étapes */}
          <form
            className="register-form"
            onSubmit={step === 3 ? handleSubmit : handleNext}
          >
            {step === 1 && (
              <>
                <div className="register-card__section-title">
                  Informations de connexion
                </div>

                <div className="register-switch">
                  <button
                    type="button"
                    className={
                      "register-switch__track register-switch__track--" +
                      formData.role
                    }
                    onClick={() =>
                      handleRoleChange(
                        formData.role === "client" ? "prestataire" : "client"
                      )
                    }
                  >
                    <span className="register-switch__option register-switch__option--client">
                      Client
                    </span>
                    <span className="register-switch__option register-switch__option--prestataire">
                      Prestataire
                    </span>
                    <span className="register-switch__thumb" />
                  </button>
                </div>

                <label className="register-field">
                  <span className="register-field__label">Adresse email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="prenom.nom@domaine.fr"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </label>

                <label className="register-field">
                  <span className="register-field__label">Mot de passe</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="8 caractères min. avec majuscule, chiffre…"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </label>

                <label className="register-field">
                  <span className="register-field__label">
                    Confirmation du mot de passe
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Ressaisissez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <div className="register-card__section-title">
                  Informations personnelles
                </div>

                <div className="register-card__grid">
                  <label className="register-field">
                    <span className="register-field__label">Prénom</span>
                    <input
                      type="text"
                      name="firstname"
                      placeholder="Votre prénom"
                      value={formData.firstname}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </label>

                  <label className="register-field">
                    <span className="register-field__label">Nom</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </label>
                </div>

                <div className="register-card__grid">
                  <label className="register-field">
                    <span className="register-field__label">Téléphone</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="01 23 45 67 89"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </label>

                  <label className="register-field">
                    <span className="register-field__label">Sexe</span>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="F">Féminin (F)</option>
                      <option value="M">Masculin (M)</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </label>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="register-card__section-title">
                  Informations complémentaires
                </div>

                <label className="register-field">
                  <span className="register-field__label">Adresse</span>
                  <input
                    type="text"
                    name="address"
                    placeholder="Votre adresse complète"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </label>

                {formData.role === "prestataire" && (
                  <>
                    <div className="register-card__grid">
                      <label className="register-field">
                        <span className="register-field__label">
                          Numéro SIREN (9 chiffres)
                        </span>
                        <input
                          type="text"
                          name="siren"
                          placeholder="Ex : 123456789"
                          value={formData.siren}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      </label>

                      <label className="register-field">
                        <span className="register-field__label">Statut</span>
                        <select
                          name="statut"
                          value={formData.statut}
                          onChange={handleChange}
                          disabled={loading}
                        >
                          <option value="Micro-entreprise">
                            Micro-entreprise
                          </option>
                          <option value="EI">EI</option>
                          <option value="EURL">EURL</option>
                          <option value="SASU">SASU</option>
                          <option value="SARL">SARL</option>
                          <option value="SAS">SAS</option>
                        </select>
                      </label>
                    </div>

                    <label className="register-field">
                      <span className="register-field__label">
                        Expérience / Formation
                      </span>
                      <textarea
                        name="education"
                        placeholder="Décrivez vos diplômes, formations et expériences."
                        value={formData.education}
                        onChange={handleChange}
                        disabled={loading}
                        rows={3}
                      />
                    </label>
                  </>
                )}

                <label className="register-field">
                  <span className="register-field__label">
                    Informations complémentaires
                  </span>
                  <textarea
                    name="additionalInformation"
                    placeholder={
                      formData.role === "client"
                        ? "Précisez vos contraintes, vos attentes particulières…"
                        : "Ajoutez des précisions sur vos prestations, vos disponibilités…"
                    }
                    value={formData.additionalInformation}
                    onChange={handleChange}
                    disabled={loading}
                    rows={3}
                  />
                </label>
              </>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="register-form__errors">
                <p>Merci de vérifier les points suivants :</p>
                <ul>
                  {Object.values(errors).map((error, index) => (
                    <li key={`${error}-${index}`}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="register-form__actions">
              {step > 1 && (
                <button
                  type="button"
                  className="register-btn register-btn--ghost"
                  onClick={handlePrev}
                  disabled={loading}
                >
                  Retour
                </button>
              )}

              <button
                type="submit"
                className="register-btn register-btn--primary"
                disabled={loading}
              >
                {loading
                  ? "Inscription en cours..."
                  : step < 3
                  ? "Étape suivante"
                  : "Finaliser mon inscription"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
