import { useContext } from 'react';
import { UserContext } from './UserContext';

/**
 * A custom hook to check if the current user has a specific role.
 *
 * @param {string|string[]} expectedRole - The role(s) to check for. Can be a single role string or an array of roles.
 * @returns {boolean} - Returns true if the user's role matches the expected role(s), otherwise false.
 */
const useRole = (expectedRole) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // While loading, we can't determine the role, so we return false.
    return false;
  }

  if (!user) {
    // If there is no user, they are not authorized.
    return false;
  }

  if (Array.isArray(expectedRole)) {
    // If an array of roles is provided, check if the user's role is in the array.
    return expectedRole.includes(user.role);
  }

  // Otherwise, check for a single role.
  return user.role === expectedRole;
};

export default useRole;
