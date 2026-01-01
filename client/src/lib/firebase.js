import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCZxEV_BibDYoNbBT4VVHwb6nD2dZPwyo4",
  authDomain: "psych-app-dd3c7.firebaseapp.com",
  projectId: "psych-app-dd3c7",
  storageBucket: "psych-app-dd3c7.firebasestorage.app",
  messagingSenderId: "246027624730",
  appId: "1:246027624730:web:497f8eeeb377e1d1954ca3",
  measurementId: "G-ZN7Y7P1LMS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials and try again.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
    'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

export const registerWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: getFirebaseErrorMessage(error.code) };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: getFirebaseErrorMessage(error.code) };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: getFirebaseErrorMessage(error.code) };
  }
};

export { onAuthStateChanged };
