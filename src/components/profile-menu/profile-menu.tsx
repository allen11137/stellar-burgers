import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI, Preloader } from '@ui';

import { useDispatch, useSelector }  from '../../services/store';
import { RequestStatus }            from '@utils-types';
import { signOutUser, selectUserLoading } from '../../slices/userProfileSlice';


export const ProfileMenu: FC = () => 
{
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const status = useSelector( selectUserLoading );


    const handleLogout = () => 
    {
        dispatch( signOutUser() );
    };


    if ( status === RequestStatus.Loading ) 
    {
        return <Preloader />;
    }


    return (
        <ProfileMenuUI 
            handleLogout={ handleLogout } 
            pathname={ pathname } 
        />
    );
};