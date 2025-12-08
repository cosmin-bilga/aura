const Step1Form = ({
  formData,
  handleChange,
  handleRoleChange,
  errors,
  loading,
}) => (
  <>
    <div className="register-card__section-title">
      Informations de connexion
    </div>

    <div className="register-switch">
      <button
        type="button"
        className={
          "register-switch__track register-switch__track--" + formData.role
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
      {errors.email && <span className="error">{errors.email}</span>}
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
      {errors.password && <span className="error">{errors.password}</span>}
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
      {errors.confirmPassword && (
        <span className="error">{errors.confirmPassword}</span>
      )}
    </label>
  </>
);

export default Step1Form;
