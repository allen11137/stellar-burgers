import { AppHeaderUI } from '@ui';
import { FC } from 'react';
import { selectUserData } from '../../slices/userProfileSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const currentUser = useSelector(selectUserData);

  return (
    <>
      <AppHeaderUI userName={currentUser?.name} />
    </>
  );
};