import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { selectUserData, selectAuthChecked } from '../../slices/userProfileSlice';

interface ProtectedRouteProps {
  publicAccess?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({ 
  publicAccess: isPublic = false, 
  children 
}: ProtectedRouteProps) => {
  const { state: locationState, ...locationRest } = useLocation();
  const isAuth = useSelector(selectAuthChecked);
  const user = useSelector(selectUserData);

  if (!isAuth && user !== null) return <Preloader />;

  if (!isPublic && !user) {
    return (
      <Navigate
        to='/login'
        replace
        state={{
          from: {
            ...locationRest,
            background: locationState?.background,
            state: null,
          },
        }}
      />
    );
  }

  if (isPublic && user) {
    const redirectTo = locationState?.from || { pathname: '/' };
    return <Navigate to={redirectTo} />;
  }

  return children;
};