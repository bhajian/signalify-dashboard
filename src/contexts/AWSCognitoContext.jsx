import { createContext, useEffect, useReducer } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosServices from '../utils/axios'
// third-party
import { CognitoUser, CognitoUserPool, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';

// project imports
import Loader from 'components/Loader';
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

export const userPool = new CognitoUserPool({
  UserPoolId: import.meta.env.VITE_APP_AWS_POOL_ID || '',
  ClientId: import.meta.env.VITE_APP_AWS_APP_CLIENT_ID || ''
});

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
  } else {
    localStorage.removeItem('serviceToken');
  }
};

// ==============================|| AWS COGNITO - CONTEXT & PROVIDER ||============================== //

const AWSCognitoContext = createContext(null);

export const AWSCognitoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const validateToken = () => {
    try {
      const serviceToken = localStorage.getItem('serviceToken');
      if (serviceToken) {
        const decodedToken = jwtDecode(serviceToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          // Token has expired
          setSession(null);
          dispatch({ type: LOGOUT });
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      setSession(null);
      dispatch({ type: LOGOUT });
      return false;
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosServices.get('api/profile')
      return response.data.profile
      
    } catch (error) {
      // alert(error)
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && validateToken()) {
          setSession(serviceToken);
          let profile = await fetchProfile()
          let name = profile.firstname + profile.lastname
          // let name = "TEST"
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                name: name
              }
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const usr = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    const authData = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    await new Promise((resolve, reject) => {
      usr.authenticateUser(authData, {
        onSuccess: async(session) => {
          setSession(session.getAccessToken().getJwtToken());
          let profile = await fetchProfile()
          let name = profile.firstname + profile.lastname
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                email: authData.getUsername(),
                name: name,
              }
            }
          });
          resolve();
        },
        onFailure: (err) => {
          reject(err);
        },
        newPasswordRequired: () => {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.
          // the api doesn't accept this field back
          // delete userAttributes.email_verified;
          // unsure about this field, but I don't send this back
          // delete userAttributes.phone_number_verified;
          // Get these details and call
          // usr.completeNewPasswordChallenge(password, userAttributes, requiredAttributes);
        }
      });
    });
  };

  const register = async (email, phone, password, firstname, lastname) => {
    await new Promise((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          // new CognitoUserAttribute({ phone: 'phone', Value: phone }),
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'name', Value: `${firstname} ${lastname}` })
        ],
        [],
        async (err, result) => {
          if (err) {
            reject(err);
            return;
          }
  
          try {
            // Extract the unique identifier (sub) from the user attributes
            const sub = result.userSub;
  
            // Prepare the data to send to the backend API
            const profileData = {
              sub, // Unique identifier from Cognito
              email,
              phone,
              firstname,
              lastname
            };
  
            // Make a POST request to the profile API
            const response = await fetch('http://localhost:3001/api/profile', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(profileData)
            });
  
            if (!response.ok) {
              throw new Error(`Failed to create profile: ${response.statusText}`);
            }
  
            localStorage.setItem('email', email);
            resolve();
          } catch (apiError) {
            console.error('Profile creation failed:', apiError);
            reject(apiError);
          }
        }
      );
    });
  };
  

  const logout = () => {
    const loggedInUser = userPool.getCurrentUser();
    if (loggedInUser) {
      setSession(null);
      loggedInUser.signOut();
      dispatch({ type: LOGOUT });
    }
  };

  const forgotPassword = async (email) => {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    user.forgotPassword({
      onSuccess: () => {},
      onFailure: () => {}
    });
  };

  const awsResetPassword = async (verificationCode, newPassword) => {
    const email = localStorage.getItem('email');
    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });
    await new Promise((resolve, reject) => {
      user.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          localStorage.removeItem('email');
          resolve();
        },
        onFailure: (error) => {
          reject(error.message);
        }
      });
    });
  };

  const codeVerification = async (verificationCode) => {
    const email = localStorage.getItem('email');
    if (!email) {
      throw new Error('Username and Pool information are required');
    }

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    await new Promise((resolve, reject) => {
      user.confirmRegistration(verificationCode, true, (error) => {
        if (error) {
          reject(error.message || JSON.stringify(error));
        } else {
          localStorage.removeItem('email');
          resolve();
        }
      });
    });
  };

  const resendConfirmationCode = async () => {
    const email = localStorage.getItem('email');
    if (!email) {
      throw new Error('Username and Pool information are required');
    }

    const user = new CognitoUser({
      Username: email,
      Pool: userPool
    });

    await new Promise((resolve, reject) => {
      user.resendConfirmationCode((error) => {
        if (error) {
          reject(error.message || JSON.stringify(error));
        } else {
          resolve();
        }
      });
    });
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <AWSCognitoContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        forgotPassword,
        awsResetPassword,
        updateProfile,
        codeVerification,
        resendConfirmationCode,
        validateToken
      }}
    >
      {children}
    </AWSCognitoContext.Provider>
  );
};

export default AWSCognitoContext;
