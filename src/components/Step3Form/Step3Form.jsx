import React from "react";

const Step3Form = ({ formData, handleChange, errors, loading }) => (
  <>
    <div className="register-card__section-title">
      Informations complémentaires
    </div>

    <label className="register-field">
      <span className="register-field__label">Adresse</span>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        disabled={loading}
      />
      {errors.address && <span className="error">{errors.address}</span>}
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
              value={formData.siren}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.siren && <span className="error">{errors.siren}</span>}
          </label>

          <label className="register-field">
            <span className="register-field__label">Status</span>
            <select
              name="status"
              value={formData.status}
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
            {errors.status && <span className="error">{errors.status}</span>}
          </label>
        </div>

        <label className="register-field">
          <span className="register-field__label">Expérience / Formation</span>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            disabled={loading}
            rows={3}
          />
          {errors.education && (
            <span className="error">{errors.education}</span>
          )}
        </label>
      </>
    )}

    <label className="register-field">
      <span className="register-field__label">
        Informations complémentaires
      </span>
      <textarea
        name="additionalInformation"
        value={formData.additionalInformation}
        onChange={handleChange}
        disabled={loading}
        rows={3}
      />
    </label>
  </>
);

export default Step3Form;
