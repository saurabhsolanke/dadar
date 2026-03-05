import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    createdAt?: Timestamp;
}

export const subscribeToNotifications = (callback: (notifications: Notification[]) => void) => {
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Notification[];
        
        callback(notifications);
    }, (error) => {
        console.error("Error subscribing to notifications:", error);
    });
};
