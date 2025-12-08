import React from "react";

const Step2Form = ({ formData, handleChange, errors, loading }) => (
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
          value={formData.firstname}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.firstname && <span className="error">{errors.firstname}</span>}
      </label>

      <label className="register-field">
        <span className="register-field__label">Nom</span>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>
    </div>

    <div className="register-card__grid">
      <label className="register-field">
        <span className="register-field__label">Téléphone</span>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.phoneNumber && (
          <span className="error">{errors.phoneNumber}</span>
        )}
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
        {errors.sex && <span className="error">{errors.sex}</span>}
      </label>
    </div>
  </>
);

export default Step2Form;
