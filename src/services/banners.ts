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
    const bannersRef = collection(db, 'banner');
    // You can add an orderBy('priority', 'asc') if you add a priority field
    const q = query(bannersRef);

    return onSnapshot(q, (snapshot) => {
        const banners = snapshot.docs.map(doc => {
            const data = doc.data();
            const imagesMap = data.images || {};
            
            return {
                id: doc.id,
                title: imagesMap.title || data.title || 'Untitled',
                subtitle: imagesMap.subtitle || data.subtitle || '',
                location: imagesMap.location || data.location || '',
                date: imagesMap.date || data.date || '',
                image: imagesMap.image || data.image || (data.images && typeof data.images === 'string' ? data.images : 'https://images.unsplash.com/photo-1590005354167-6da97870c757?auto=format&fit=crop&q=80&w=800'),
                link: imagesMap.link || data.link || '',
            } as BannerItem;
        });
        
        callback(banners);
    }, (error) => {
        console.error("Error subscribing to banners:", error);
    });
};
