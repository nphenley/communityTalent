import { createContext } from 'react';
import { Profile } from '_types/Profile';

export const ProfileContext = createContext<Profile | undefined>(undefined);
