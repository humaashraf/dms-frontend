// src/utils/auth.js
export const getUser = () => JSON.parse(localStorage.getItem('user'));
export const getRoles = () => JSON.parse(localStorage.getItem('roles')) || [];
export const getPermissions = () => JSON.parse(localStorage.getItem('permissions')) || [];

// Check if user has permission
export const hasPermission = (permission) => {
  const permissions = getPermissions();
  return permissions.includes(permission);
};

// Check if user has any of the given permissions
export const hasAnyPermission = (permissionArray) => {
  const permissions = getPermissions();
  return permissionArray.some(perm => permissions.includes(perm));
};

// Check role
export const hasRole = (role) => {
  const roles = getRoles();
  return roles.includes(role);
};
