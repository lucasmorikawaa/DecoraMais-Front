import { UsuarioData } from '../../services/auth/types';

export interface LoginScreenProps {
  onLoginSuccess?: (usuario: UsuarioData) => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
}