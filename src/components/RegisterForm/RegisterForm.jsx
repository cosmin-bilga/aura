import { useState } from "react";
import { useNavigate } from "react-router-dom";

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+_#-])[A-Za-z\d@$!%*?&.,;:+_#-]{8,}$/;
const phoneNumberRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "client",
    name: "",
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    sex: "Autre",
    additionalInformation: "",
    siren: "",
    statut: "Micro-entreprise",
    education: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const getStepErrors = (data, currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!data.email) newErrors.email = "L’adresse email est obligatoire.";
      else if (!strictEmailRegex.test(data.email))
        newErrors.email = "Adresse email invalide (ex : nom@domaine.fr).";

      if (!data.password)
        newErrors.password = "Le mot de passe est obligatoire.";
      else if (!passwordRegex.test(data.password))
        newErrors.password =
          "Le mot de passe doit contenir 8 caractères min., avec majuscule, minuscule, chiffre et symbole.";

      if (!data.confirmPassword)
        newErrors.confirmPassword =
          "La confirmation du mot de passe est obligatoire.";
      else if (data.confirmPassword !== data.password)
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (currentStep === 2) {
      if (!data.firstname.trim() || data.firstname.trim().length < 2)
        newErrors.firstname = "Le prénom doit contenir au moins 2 caractères.";
      if (!data.name.trim() || data.name.trim().length < 2)
        newErrors.name = "Le nom doit contenir au moins 2 caractères.";

      if (!data.phoneNumber)
        newErrors.phoneNumber = "Le numéro de téléphone est obligatoire.";
      else if (!phoneNumberRegex.test(data.phoneNumber))
        newErrors.phoneNumber = "Format invalide. Utilisez 0X XX XX XX XX.";

      if (!data.sex) newErrors.sex = "Merci de sélectionner un sexe.";
    }

    if (currentStep === 3) {
      if (!data.address.trim())
        newErrors.address = "L’adresse est obligatoire.";

      if (data.role === "prestataire") {
        if (!data.siren.trim())
          newErrors.siren = "Le numéro SIREN est obligatoire.";
        else if (!/^\d{9}$/.test(data.siren.trim()))
          newErrors.siren = "Le numéro SIREN doit contenir 9 chiffres.";

        if (!data.statut) newErrors.statut = "Le statut est obligatoire.";
        if (!data.education.trim())
          newErrors.education =
            "Merci de préciser votre expérience / formation.";
      }
    }

    return newErrors;
  };

  const validateStep = () => {
    const newErrors = getStepErrors(formData, step);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setErrors(getStepErrors(updatedData, step));
  };

  const handleRoleChange = (role) => {
    const updatedData = { ...formData, role };
    setFormData(updatedData);
    if (step === 3) setErrors(getStepErrors(updatedData, 3));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
    setErrors({});
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    const registrationData =
      formData.role === "client"
        ? {
            name: formData.name,
            firstname: formData.firstname,
            email: formData.email,
            password: formData.password,
            password_confirm: formData.confirmPassword, // à ajouter
            phone_number: formData.phoneNumber,
            address: formData.address,
            sex: formData.sex,
            additional_information: formData.additionalInformation || "",
          }
        : {
            name: formData.name,
            firstname: formData.firstname,
            email: formData.email,
            password: formData.password,
            password_confirm: formData.confirmPassword, // à ajouter
            phone_number: formData.phoneNumber,
            address: formData.address,
            sex: formData.sex,
            SIREN: formData.siren,
            statut: formData.statut,
            education_experience: formData.education,
            additional_information: formData.additionalInformation || "",
          };

    try {
      const response = await fetch("/api/customer/index.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        alert("Inscription réussie !");
        navigate("/connexion");
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      alert("Erreur réseau : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Pagination en 3 étapes */}
      <div className="register-steps">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={
              "register-step " +
              (step === i
                ? "register-step--active"
                : step > i
                ? "register-step--done"
                : "")
            }
          >
            <span className="register-step__index">{i}</span>
          </div>
        ))}
      </div>

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
                      <option value="Micro-entreprise">Micro-entreprise</option>
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
    </>
  );
};

export default RegisterForm;
