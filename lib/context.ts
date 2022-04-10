import {User} from 'firebase/auth';
import {createContext, Dispatch, SetStateAction} from 'react';
import {ToastData} from '../components/toast';
import {UserData} from './types';
let userData: UserData = null;
let user: User = null;
export const UserContext = createContext({user, userData});

// Toast Context
let showToast: boolean = false;
let setShowToast: Dispatch<SetStateAction<boolean>> = null;
let toastData: ToastData = null;
let setToastData: Dispatch<SetStateAction<ToastData>> = null;

export const ToastContext = createContext({showToast, setShowToast, toastData, setToastData});
