// regex
export const strictEmailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:+_#-])[A-Za-z\d@$!%*?&.,;:+_#-]{8,}$/;
export const phoneNumberRegex =
  /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

// validation step 1
export const validateStep1 = (data) => {
  const errors = {};
  if (!data.email) errors.email = "L’adresse email est obligatoire.";
  else if (!strictEmailRegex.test(data.email))
    errors.email = "Adresse email invalide.";

  if (!data.password) errors.password = "Le mot de passe est obligatoire.";
  else if (!passwordRegex.test(data.password))
    errors.password =
      "Le mot de passe doit contenir 8 caractères min., majuscule, chiffre et symbole.";

  if (!data.confirmPassword)
    errors.confirmPassword = "La confirmation du mot de passe est obligatoire.";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";

  return errors;
};

// validation step 2
export const validateStep2 = (data) => {
  const errors = {};
  if (!data.firstname || data.firstname.trim().length < 2)
    errors.firstname = "Le prénom doit contenir au moins 2 caractères.";
  if (!data.name || data.name.trim().length < 2)
    errors.name = "Le nom doit contenir au moins 2 caractères.";
  if (!data.phoneNumber)
    errors.phoneNumber = "Le numéro de téléphone est obligatoire.";
  else if (!phoneNumberRegex.test(data.phoneNumber))
    errors.phoneNumber = "Format invalide. Ex : 01 23 45 67 89.";
  if (!data.sex) errors.sex = "Merci de sélectionner un sexe.";
  return errors;
};

// validation step 3
export const validateStep3 = (data) => {
  const errors = {};
  if (!data.address || data.address.trim() === "")
    errors.address = "L’adresse est obligatoire.";

  if (data.role === "prestataire") {
    if (!data.siren || !/^\d{9}$/.test(data.siren))
      errors.siren = "Le numéro SIREN doit contenir 9 chiffres.";
    if (!data.statut) errors.statut = "Le statut est obligatoire.";
    if (!data.education || data.education.trim() === "")
      errors.education = "Merci de préciser votre expérience / formation.";
  }
  return errors;
};
