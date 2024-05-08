import * as yup from "yup";

// Auth Module
// Login Schema
export const loginFormSchema = yup.object().shape({
  email: yup.string().label("Email").email("invalidEmail").required("emailRequired"),
  password: yup.string().label("Password").required("passwordRequired"),
});
// Forgot form Schema
export const forgotFormSchema = yup.object().shape({
  email: yup.string().label("Email").email("invalidEmail").required("emailRequired"),
});
// Reset password validation
export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .label("Password")
    .required("passwordRequired")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, "mustContain"),
  confirmPassword: yup
    .string()
    .label("Confirm Password")
    .oneOf([yup.ref("password")], "mustMatch")
    .required("confirmPasswordRequired"),
});

// Profile Module
// Edit User Profile Schema
export const editProfileFormSchema = yup.object().shape({
  firstName: yup.string().label("First Name").required("firstNameRequired"),
  lastName: yup.string().label("Last Name").required("lastNameRequired"),
  email: yup.string().label("Email").email("invalidEmail").required("emailRequired"),
  role: yup.string().label("Role").required("roleRequired"),
  mobile: yup.string().label("Mobile"),
});

// Change Password Schema
export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().label("Old Password").required("oldPasswordRequired"),
  newPassword: yup
    .string()
    .label("Password")
    .required("passwordRequired")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, "mustContain"),
  confirmPassword: yup
    .string()
    .label("Confirm Password")
    .required("confirmPasswordRequired")
    .oneOf([yup.ref("newPassword")], "mustMatch"),
});

// User Module
// Add New User Form
export const addNewUserFormSchema = yup.object().shape({
  firstName: yup.string().trim().label("First Name").required("firstNameRequired"),
  lastName: yup.string().trim().label("Last Name").required("lastNameRequired"),
  email: yup.string().label("Email").email("invalidEmail").required("emailRequired"),
  country: yup.string().required("countryRequired"),
  mobile: yup.string().label("Mobile"),
  role: yup.string().label("Role").required("roleRequired"),
  // status: yup.string().label("Status").required("statusRequired"),
});

// Update User form schema
export const updateUserFormSchema = yup.object().shape({
  firstName: yup.string().trim().label("First Name").required("firstNameRequired"),
  lastName: yup.string().trim().label("Last Name").required("lastNameRequired"),
  email: yup.string().label("Email").email("invalidEmail").required("emailRequired"),
  country: yup.string().required("countryRequired"),
  mobile: yup.string().label("Mobile"),
  role: yup.string().label("Role").required("roleRequired"),
  status: yup.string().label("Status").required("statusRequired"),
});

// Users Search Form Schema
export const usersSearchFormSchema = yup.object().shape({
  firstName: yup.string().trim(),
  lastName: yup.string().trim(),
  email: yup.string().email("validation.invalidEmail"),
  status: yup.string(),
  role: yup.string(),
  country: yup.string(),
});

// Collection Module
// Add New Collection Form
export const addNewCollectionFormSchema = yup.object().shape({
  name: yup.string().trim().required("validation.nameRequired"),
  collaborator: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      name: yup.string(),
    }),
  ),
  startDate: yup.date().typeError("validation.invalidDateType"),
  endDate: yup.date().min(yup.ref("startDate"), "validation.invalidDate").typeError("validation.invalidDateType"),
  status: yup.string().required("validation.statusRequired"),
  country: yup.string().required("validation.countryRequired"),
});

// Update Collection form schema
export const updateCollectionFormSchema = yup.object().shape({
  name: yup.string().trim().required("validation.nameRequired"),
  collaborator: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      name: yup.string(),
    }),
  ),
  startDate: yup.date().typeError("validation.invalidDateType"),
  endDate: yup.date().min(yup.ref("startDate"), "validation.invalidDate").typeError("validation.invalidDateType"),
  status: yup.string().required("validation.statusRequired"),
  country: yup.string().required("validation.countryRequired"),
});

// Collections Search Form Schema
export const collectionsSearchFormSchema = yup.object().shape({
  name: yup.string().trim(),
  collaborator: yup.string().trim(),
  startDate: yup.mixed().nullable(),
  endDate: yup.mixed().nullable(),
  status: yup.string(),
});

// Associate Collection Form
export const AssociateCollectionFormSchema = yup.object().shape({
  collection: yup.string().required("validation.collectionRequired"),
});

// Collection Team Mangment Module
// My Team Users Search Form Schema
export const myTeamMembersSearchFormSchema = yup.object().shape({
  firstName: yup.string().trim(),
  lastName: yup.string().trim(),
  email: yup.string().email("validation.invalidEmail"),
  status: yup.string(),
  role: yup.string(),
});

// Add New Team Member User Form
export const addTeamMemberFormSchema = yup.object().shape({
  name: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string(),
        name: yup.string(),
      }),
    )
    .min(1, "validation.nameRequired"),
});

// Product Module
// Product search form schema
// Collections Search Form Schema
export const productSearchFormSchema = yup.object().shape({
  productName: yup.string().trim(),
  gtin: yup.string().trim(),
  isLocked: yup.string(),
  status: yup.string(),
  fields: yup.array().of(yup.string()),
});

// Exports Module
// Exports Search Form Schema
export const exportsSearchFormSchema = yup.object().shape({
  userName: yup.string().trim(),
  exportName: yup.string().trim(),
  status: yup.string(),
});

// Add Export Name schema
export const exportNameFormSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9\s-]*$/, "validation.nameSpecialCharactersNotAllowed")
    .required("validation.nameRequired"),
});

// Saved search form schema
export const savedSearchNameFormSchema = yup.object().shape({
  searchName: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9\s-]*$/, "validation.nameSpecialCharactersNotAllowed")
    .required("validation.nameRequired"),
  // description: yup.string(),
});
