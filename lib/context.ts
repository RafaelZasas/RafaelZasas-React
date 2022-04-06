import {User} from 'firebase/auth';
import {createContext} from 'react';
import {UserData} from './types';
let userData: UserData = null;
let user: User = null;
export const UserContext = createContext({user, userData});
