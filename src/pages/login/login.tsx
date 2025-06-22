import { useDispatch, useSelector } from '../../services/store';
import { useState, FC, SyntheticEvent } from 'react';
import { signInUser } from '../../slices/userProfileSlice';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    
    const error    = useSelector((state) => state.user.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        
        try {
            dispatch(signInUser({ email, password }))
                .unwrap()
                .then(() => {
                    navigate('/', { replace: true });
                })
                .catch(() => {});
        } 
        catch (err) {
            console.log(err);
        }
    };

    return (
        <LoginUI
            errorText   = {error?.message}
            email       = {email}
            setEmail    = {setEmail}
            password    = {password}
            setPassword = {setPassword}
            handleSubmit= {handleSubmit}
        />
    );
};