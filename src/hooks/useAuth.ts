import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  return {
    user,
    isAuthenticated,
    loading,
    hasPermission,
    hasRole,
  };
};

export default useAuth;