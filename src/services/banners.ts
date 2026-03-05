import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface BannerItem {
    id: string;
    title: string;
    subtitle: string;
    location: string;
    date: string;
    image: string;
    link?: string;
}

export const subscribeToBanners = (callback: (banners: BannerItem[]) => void) => {
    const bannersRef = collection(db, 'banners');
    // You can add an orderBy('priority', 'asc') if you add a priority field
    const q = query(bannersRef);

    return onSnapshot(q, (snapshot) => {
        const banners = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as BannerItem[];
        
        callback(banners);
    }, (error) => {
        console.error("Error subscribing to banners:", error);
    });
};
