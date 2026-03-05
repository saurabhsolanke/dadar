import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
    FacebookAuthProvider,
    GoogleAuthProvider,
    signInWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

// Note: You must provide these IDs from your developer consoles
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'missing-client-id';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'missing-client-id';
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'missing-client-id';

const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'missing-app-id';

const INSTAGRAM_CLIENT_ID = process.env.EXPO_PUBLIC_INSTAGRAM_CLIENT_ID || 'missing-client-id';

// Discovery for Instagram
const instagramDiscovery = {
    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
};

export const useGoogleAuth = () => {
    console.log('--- Google Auth Debug ---');
    console.log('Web Client ID:', GOOGLE_CLIENT_ID);
    console.log('iOS Client ID:', GOOGLE_IOS_CLIENT_ID);
    console.log('Android Client ID:', GOOGLE_ANDROID_CLIENT_ID);
    console.log('-------------------------');

    return Google.useAuthRequest({
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        webClientId: GOOGLE_CLIENT_ID,
    });
};

export const handleGoogleSignIn = async (response: any) => {
    if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        return await signInWithCredential(auth, credential);
    }
};

export const useFacebookAuth = () => {
    return Facebook.useAuthRequest({
        clientId: FACEBOOK_APP_ID,
    });
};

export const handleFacebookSignIn = async (response: any) => {
    if (response?.type === 'success') {
        const { access_token } = response.params;
        const credential = FacebookAuthProvider.credential(access_token);
        return await signInWithCredential(auth, credential);
    }
};

export const useInstagramAuth = () => {
    return AuthSession.useAuthRequest(
        {
            clientId: INSTAGRAM_CLIENT_ID || '',
            redirectUri: AuthSession.makeRedirectUri({
                scheme: 'dadar',
            }),
            scopes: ['user_profile', 'user_media'],
            responseType: AuthSession.ResponseType.Code,
        },
        instagramDiscovery
    );
};

export const handleInstagramSignIn = async (response: any) => {
    if (response?.type === 'success') {
        const { code } = response.params;
        // Instagram requires a server-side exchange of code for access token
        // and then creating a Firebase custom token.
        console.log('Instagram Auth Code:', code);
        throw new Error('Instagram requires backend implementation for token exchange.');
    }
};
