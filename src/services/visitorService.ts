
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { VisitorFormInput } from '@/app/visitor/login/actions';

export interface VisitorLog extends VisitorFormInput {
    id: string;
    lastSeen: Timestamp;
    status: 'Online' | 'Offline';
}

// Add a new visitor log to Firestore
export async function addVisitorLog(visitorData: VisitorFormInput) {
    try {
        await addDoc(collection(db, 'visitorLogs'), {
            ...visitorData,
            lastSeen: serverTimestamp(),
            status: 'Online',
        });
    } catch (error) {
        console.error("Error adding visitor log: ", error);
        throw new Error("Could not save visitor information.");
    }
}

// Subscribe to real-time updates of visitor logs
export function subscribeToVisitorLogs(callback: (logs: VisitorLog[]) => void) {
    const q = query(collection(db, "visitorLogs"), orderBy("lastSeen", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const logs: VisitorLog[] = [];
        querySnapshot.forEach((doc) => {
            logs.push({ id: doc.id, ...doc.data() } as VisitorLog);
        });
        callback(logs);
    }, (error) => {
        console.error("Error fetching visitor logs: ", error);
    });

    return unsubscribe; // Return the unsubscribe function to clean up the listener
}
