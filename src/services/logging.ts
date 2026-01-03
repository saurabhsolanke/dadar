import { logEvent } from "firebase/analytics";
import { analytics } from '../config/firebase';

export const logScreenView = async (screenName: string, screenClass: string = screenName) => {
  if (analytics) {
    try {
      await logEvent(analytics, 'screen_view', {
        firebase_screen: screenName,
        firebase_screen_class: screenClass,
      });
      console.log(`[Analytics] Screen view logged: ${screenName}`);
    } catch (error) {
      console.error('[Analytics] Error logging screen view:', error);
    }
  } else {
    console.log(`[Analytics (Mock)] Screen view: ${screenName}`);
  }
};

export const logCustomEvent = async (eventName: string, params: object = {}) => {
  if (analytics) {
    try {
      await logEvent(analytics, eventName, params);
      console.log(`[Analytics] Event logged: ${eventName}`, params);
    } catch (error) {
      console.error('[Analytics] Error logging event:', error);
    }
  } else {
    console.log(`[Analytics (Mock)] Event: ${eventName}`, params);
  }
};
