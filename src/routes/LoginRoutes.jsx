import { lazy } from 'react';

// project import
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';
import { APP_AUTH, AuthProvider } from 'config';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));

// aws auth
const AwsAuthLogin = Loadable(lazy(() => import('pages/auth/aws/login')));
const AwsAuthRegister = Loadable(lazy(() => import('pages/auth/aws/register')));
const AwsAuthForgotPassword = Loadable(lazy(() => import('pages/auth/aws/forgot-password')));
const AwsAuthResetPassword = Loadable(lazy(() => import('pages/auth/aws/reset-password')));
const AwsAuthCodeVerification = Loadable(lazy(() => import('pages/auth/aws/code-verification')));
const AwsAuthCheckMail = Loadable(lazy(() => import('pages/auth/aws/check-mail')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: APP_AUTH === AuthProvider.AWS ? '/' : 'aws',
          children: [
            { path: 'login', element: <AwsAuthLogin /> },
            { path: 'register', element: <AwsAuthRegister /> },
            { path: 'forgot-password', element: <AwsAuthForgotPassword /> },
            { path: 'reset-password', element: <AwsAuthResetPassword /> },
            { path: 'code-verification', element: <AwsAuthCodeVerification /> },
            { path: 'check-mail', element: <AwsAuthCheckMail /> }
          ]
        },
        {
          path: '/',
          element: <AuthLogin />
        },
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    }
  ]
};

export default LoginRoutes;
