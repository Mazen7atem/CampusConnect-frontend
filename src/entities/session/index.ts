export {
  default as authReducer,
  setCredentials,
  logout,
  selectCurrentUser,
  selectToken,
} from './model/authSlice';

export type { User, AuthState } from './model/authSlice';
