import { FirestoreService } from './firestore.service';
import type { UserProfile } from '../../features/auth/types/user.types';
import { doc, getDoc, setDoc, serverTimestamp, increment, arrayUnion } from 'firebase/firestore';


export class UserService extends FirestoreService<UserProfile> {
    constructor() {
        super('users');
    }

    async getProfile(uid: string): Promise<UserProfile | null> {
        return this.getById(uid);
    }

    async createOrUpdateProfile(user: any): Promise<UserProfile> {
        const docRef = doc(this.collectionRef, user.uid);
        const docSnap = await getDoc(docRef);

        const now = serverTimestamp();

        if (docSnap.exists()) {
            await this.update(user.uid, {
                lastActive: now
            } as any);
            return { id: docSnap.id, ...docSnap.data() } as unknown as UserProfile;
        } else {
            const newProfile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || 'Hero',
                photoURL: user.photoURL || '',
                currentDay: 1,
                streakCount: 0,
                learningPoints: 0,
                hearts: 5,
                lastActive: now,
                paymentStatus: 'free',
                unlockedDays: [1],
                completedDays: [],
                vaultItems: [],
                referralCode: 'HERO-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                referralCount: 0,
                referredBy: null,
                createdAt: now
            };

            await setDoc(docRef, newProfile);
            return newProfile;
        }
    }

    async incrementReferralCount(uid: string): Promise<void> {
        await this.update(uid, {
            referralCount: increment(1)
        } as any);
    }

    async addUnlockedDay(uid: string, day: number): Promise<void> {
        await this.update(uid, {
            unlockedDays: arrayUnion(day)
        } as any);
    }
}

export const userService = new UserService();
