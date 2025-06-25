import { useDispatch, useSelector } from '../../services/store';
import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { updateUserData } from '../../slices/userProfileSlice';
import { ProfileUI } from '@ui-pages';
import { updateUserApi } from '@api';


export const Profile: FC = () => {
    const dispatch = useDispatch();
    const { data: user } = useSelector(store=>store.user);

    const [formValue, setFormValue] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });

    useEffect(()=>{
        setFormValue(prevState=>({
            ...prevState,
            name: user?.name || '',
            email: user?.email || ''
        }));
    },[user]);

    const isFormChanged = formValue.name !== user?.name || 
                         formValue.email !== user?.email || 
                         !!formValue.password;

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        updateUserApi(formValue)
            .then(res=>{
                dispatch(updateUserData(res.user));
            })
            .catch(err=>console.log(err));
        setFormValue({
            name: user?.name || '',
            email: user?.email || '',
            password: ''
        });
    };

    const handleCancel = (e: SyntheticEvent) => {
        e.preventDefault();
        setFormValue({
            name: user?.name || '',
            email: user?.email || '',
            password: ''
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(prevState=>({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
    />;
};