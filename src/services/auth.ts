import { ConfirmationResult, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPhoneNumber, updateProfile, UserCredential } from "firebase/auth";
import { auth } from '../config/firebase';

// Note: In a real Expo app with JS SDK, you need a RecaptchaVerifier.
// This is a simplified interface. You might need 'expo-firebase-recaptcha'
// and pass the verifier reference here.

export const sendOTP = async (phoneNumber: string, recaptchaVerifier: any): Promise<ConfirmationResult> => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('OTP sent to', phoneNumber);
    return confirmationResult;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, code: string) => {
  try {
    const result = await confirmationResult.confirm(code);
    console.log('User signed in successfully', result.user);
    return result.user;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const register = async (email: string, pass: string, name: string): Promise<UserCredential> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        await updateProfile(userCredential.user, {
            displayName: name
        });
        return userCredential;
    } catch (error) {
        console.error("Error registering: ", error);
        throw error;
    }
}

export const login = async (email: string, pass: string): Promise<UserCredential> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential;
    } catch (error) {
        console.error("Error logging in: ", error);
        throw error;
    }
}

export const logout = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error signing out: ", error);
        throw error;
    }
}
