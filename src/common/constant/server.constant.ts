//////////// Server Constants ////////////////////
// Auth flow constants
export const LOG_IN_URL = "auth/signIn";
export const RESET_INVITE_URL = "auth/password/reset";
export const RESET_PASSWORD_URL = "auth/password/reset/create";
// Users
export const GET_USERS_LIST = "users/all";
export const ADD_NEW_USER = "auth/register";
export const EDIT_USER = "users/";
export const CHANGE_PASSWORD_URL = "auth/password/change";
// Profile
export const EDIT_PROFILE_URL = "users/profile";
export const GET_USER_PROFILE = "users/profile";
// Roles
export const GET_ROLES_LIST = "roles/all";

export const GET_COLLECTIONS_LIST = "collection/all";
export const ADD_NEW_COLLECTION = "collection/create";
export const EDIT_COLLECTION = "collection/";
export const DELETE_COLLECTION = "collection/";
export const GET_ONE_COLLECTION = "collection";
// Team Managmenet
export const GET_AVAILABLE_TEAM_MEMBERS = "collection";
export const EDIT_TEAM_MEMBERS = "collection/";
export const DELETE_TEAM_MEMBER = "collection/";
// Exports CSV's
export const GENERATE_USERS_CSV = "users/generate-CSV";
export const GENERATE_COLLECTIONS_CSV = "collection/generate-CSV";
export const GENERATE_TEAM_MEMBERS_CSV = "teams/generate-CSV";
export const GET_ALL_EXPORTS = "export/all";
export const DOWNLOAD_EXPORT_URL = "export";
// Products
export const GET_PRODUCTS_LIST = "products/all";
export const GET_PRODUCT_DETAIL = "products";
export const EDIT_PRODUCT_DETAIL = "products";
export const SAVE_PRODUCT_SEARCH = "products/search/create";
export const GET_ALL_PRODUCTS_SEARCHES = "products/search/all";
export const DELETE_PRODUCT_SEARCH = `products/search`;
export const UPDATE_PRODUCT_SEARCHES = "products/search";

// Meta Data
export const GET_PRODUCT_CLAIMS = "masterdata/metadata/CLM";
export const GET_PRODUCT_ALLERGEN = "masterdata/metadata/ALG";
export const GET_PRODUCT_RETAILER = "masterdata/metadata/R";
export const GET_PRODUCT_NIPTYPE = "masterdata/nip-type/all";
export const GET_PRODUCT_GROUP = "masterdata/metadata/populate/categories-tree/list";
export const GET_COUNTRY_LIST = "masterdata/country/all";
