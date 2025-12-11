import React, { useState } from "react";
import { useAuth } from "../../../contexts/UseAuth";

const boxStyle = {
  padding: "1.5rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "1.5rem",
  background: "#fafafa",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1.5rem",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "1.5rem",
  background: "#fff",
};

const inputStyle = {
  padding: "0.75rem",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  fontFamily: "inherit",
};

const buttonContainerStyle = {
  display: "flex",
  gap: "0.75rem",
  justifyContent: "flex-end",
};

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  borderRadius: "4px",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  fontWeight: "500",
};

const primaryButtonStyle = {
  ...buttonStyle,
  background: "#007bff",
  color: "white",
};

const secondaryButtonStyle = {
  ...buttonStyle,
  background: "#6c757d",
  color: "white",
};

const editButtonStyle = {
  ...buttonStyle,
  background: "#28a745",
  color: "white",
  marginBottom: "1rem",
};

const ProviderProfile = ({ user, onUserUpdate }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    name: "",
    email: "",
    phone_number: "",
    address: "",
    SIREN: "",
    additional_information: "",
  });

  // Charger les données du provider connecté au montage
  React.useEffect(() => {
    if (!user?.id_provider) return;
    setIsLoading(true);
    fetch(`/api/provider/index.php?id_provider=${user.id_provider}`, {
      method: "GET",
      headers: { "X-API-KEY": token },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);
        setFormData({
          firstname: data.firstname || "",
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          address: data.address || "",
          SIREN: data.SIREN || "",
          additional_information: data.additional_information || "",
        });
        setIsLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le profil prestataire");
        setIsLoading(false);
      });
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("id_provider", user.id_provider);
      formDataObj.append("firstname", formData.firstname);
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone_number", formData.phone_number);
      formDataObj.append("address", formData.address);
      formDataObj.append("SIREN", formData.SIREN);
      formDataObj.append(
        "additional_information",
        formData.additional_information
      );

      const response = await fetch("/api/provider/index.php", {
        method: "POST",
        headers: {
          "X-API-KEY": token,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update provider");
      }

      // Refetch the updated provider data
      const getResponse = await fetch(
        `/api/provider/index.php?id_provider=${user.id_provider}`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": token,
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error("Failed to fetch updated profile data");
      }

      const updatedUser = await getResponse.json();

      // Update both the form data and the displayed profile data
      setProfileData(updatedUser);
      setFormData({
        firstname: updatedUser.firstname || "",
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone_number: updatedUser.phone_number || "",
        address: updatedUser.address || "",
        SIREN: updatedUser.SIREN || "",
        additional_information: updatedUser.additional_information || "",
      });

      // Call the callback to update parent component if provided
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setIsEditing(false);
    } catch (err) {
      setError(
        err.message ||
          "Une erreur est survenue lors de la modification du profil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstname: user.firstname || "",
      name: user.name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      address: user.address || "",
      SIREN: user.SIREN || "",
      additional_information: user.additional_information || "",
    });
    setIsEditing(false);
  };

  return (
    <>
      <h2>Mon profil prestataire</h2>

      {error && (
        <div
          style={{
            padding: "0.75rem",
            marginBottom: "1rem",
            borderRadius: "4px",
            background: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
          }}
        >
          {error}
        </div>
      )}

      {!isEditing ? (
        <>
          <button style={editButtonStyle} onClick={() => setIsEditing(true)}>
            Editer le profil
          </button>
          <div className="profil-box" style={boxStyle}>
            <p>
              <b>Prénom :</b> {profileData?.firstname}
            </p>
            <p>
              <b>Nom :</b> {profileData?.name}
            </p>
            <p>
              <b>Email :</b> {profileData?.email}
            </p>
            <p>
              <b>Téléphone :</b> {profileData?.phone_number || "Non renseigné"}
            </p>
            <p>
              <b>Adresse :</b> {profileData?.address || "Non renseigné"}
            </p>
            <p>
              <b>SIREN :</b> {profileData?.SIREN || "Non renseigné"}
            </p>
            <p>
              <b>Informations complémentaires :</b>{" "}
              {profileData?.additional_information || "Non renseigné"}
            </p>
          </div>
        </>
      ) : (
        <form style={formStyle} onSubmit={handleSubmit}>
          <h3>Modifier votre profil</h3>

          <div>
            <label htmlFor="firstname">
              <b>Prénom :</b>
            </label>
            <input
              style={inputStyle}
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="name">
              <b>Nom :</b>
            </label>
            <input
              style={inputStyle}
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email">
              <b>Email :</b>
            </label>
            <input
              style={inputStyle}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="phone_number">
              <b>Téléphone :</b>
            </label>
            <input
              style={inputStyle}
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="address">
              <b>Adresse :</b>
            </label>
            <input
              style={inputStyle}
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="SIREN">
              <b>SIREN :</b>
            </label>
            <input
              style={inputStyle}
              type="text"
              id="SIREN"
              name="SIREN"
              value={formData.SIREN}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="additional_information">
              <b>Informations complémentaires :</b>
            </label>
            <textarea
              style={inputStyle}
              id="additional_information"
              name="additional_information"
              value={formData.additional_information}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div style={buttonContainerStyle}>
            <button
              style={secondaryButtonStyle}
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              style={primaryButtonStyle}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "En cours..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ProviderProfile;
