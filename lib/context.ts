import {createContext} from 'react';
import firebase from 'firebase/compat';
import {User} from './types';
let userData: User = null;
let user: firebase.User = null;
export const UserContext = createContext({user, userData});
