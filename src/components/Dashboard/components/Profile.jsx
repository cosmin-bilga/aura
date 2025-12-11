import { useState } from "react";
import { useAuth } from "../../../contexts/UseAuth";

const Profile = ({ user, onUserUpdate }) => {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(user);
  const [formData, setFormData] = useState({
    firstname: user.firstname || "",
    name: user.name || "",
    email: user.email || "",
    phone_number: user.phone_number || "",
    address: user.address || "",
  });

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
      formDataObj.append("id_customer", user.id_customer);
      formDataObj.append("firstname", formData.firstname);
      formDataObj.append("name", formData.name);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone_number", formData.phone_number);
      formDataObj.append("address", formData.address);

      const response = await fetch("/api/customer/index.php", {
        method: "POST",
        headers: {
          "X-API-KEY": token,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update customer");
      }

      const getResponse = await fetch(
        `/api/customer/index.php?id_customer=${user.id_customer}`,
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

      setProfileData(updatedUser);
      setFormData({
        firstname: updatedUser.firstname || "",
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone_number: updatedUser.phone_number || "",
        address: updatedUser.address || "",
      });

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err.message || "An error occurred while updating your profile");
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
    });
    setIsEditing(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleCancel();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <section className="dash-profile-panel">
      <header className="dash-profile-panel__header">
        <div>
          <p className="dash-profile-panel__eyebrow">Compte</p>
          <h2 className="dash-profile-panel__title">Mon profil</h2>
        </div>
        <button
          type="button"
          className="dash-profile-panel__edit"
          onClick={handleToggleEdit}
          aria-label={isEditing ? "Fermer l'edition" : "Editer le profil"}
          disabled={isLoading}
        >
          {isEditing ? "✕" : "✎️"}
        </button>
      </header>

      {error && <div className="dash-alert dash-alert--error">{error}</div>}

      {!isEditing ? (
        <div className="dash-profile-panel__details">
          <div className="dash-profile-panel__row">
            <span className="dash-profile-panel__label">Prenom</span>
            <span className="dash-profile-panel__value">
              {profileData.firstname || "Non renseigne"}
            </span>
          </div>
          <div className="dash-profile-panel__row">
            <span className="dash-profile-panel__label">Nom</span>
            <span className="dash-profile-panel__value">
              {profileData.name || "Non renseigne"}
            </span>
          </div>
          <div className="dash-profile-panel__row">
            <span className="dash-profile-panel__label">Email</span>
            <span className="dash-profile-panel__value">
              {profileData.email || "Non renseigne"}
            </span>
          </div>
          <div className="dash-profile-panel__row">
            <span className="dash-profile-panel__label">Telephone</span>
            <span className="dash-profile-panel__value">
              {profileData.phone_number || "Non renseigne"}
            </span>
          </div>
          <div className="dash-profile-panel__row">
            <span className="dash-profile-panel__label">Adresse</span>
            <span className="dash-profile-panel__value">
              {profileData.address || "Non renseigne"}
            </span>
          </div>
        </div>
      ) : (
        <form className="dash-profile-panel__form" onSubmit={handleSubmit}>
          <div className="dash-profile-panel__field">
            <label htmlFor="firstname">Prenom</label>
            <input
              className="dash-profile-panel__input"
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="dash-profile-panel__field">
            <label htmlFor="name">Nom</label>
            <input
              className="dash-profile-panel__input"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="dash-profile-panel__field">
            <label htmlFor="email">Email</label>
            <input
              className="dash-profile-panel__input"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="dash-profile-panel__field">
            <label htmlFor="phone_number">Telephone</label>
            <input
              className="dash-profile-panel__input"
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="dash-profile-panel__field">
            <label htmlFor="address">Adresse</label>
            <input
              className="dash-profile-panel__input"
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="dash-profile-panel__actions">
            <button
              className="dash-pill dash-pill--ghost"
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button className="dash-pill" type="submit" disabled={isLoading}>
              {isLoading ? "En cours..." : "Sauvegarder"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default Profile;
