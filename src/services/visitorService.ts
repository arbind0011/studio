
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { VisitorFormInput } from '@/app/visitor/login/actions';

export interface VisitorLog extends VisitorFormInput {
    id: string;
    lastSeen: Timestamp;
    status: 'Online' | 'Offline';
}

export interface SosAlert {
    id: string;
    name: string;
    email: string;
    walletAddress: string;
    message: string;
    timestamp: Timestamp;
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

// Send an SOS alert
export async function sendSosAlert(user: { name: string, email: string, walletAddress: string }) {
    try {
        await addDoc(collection(db, 'sos-alerts'), {
            ...user,
            message: 'Emergency! User requires immediate assistance.',
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error sending SOS alert: ", error);
        throw new Error("Could not send SOS alert.");
    }
}

// Subscribe to real-time SOS alerts
export function subscribeToSosAlerts(callback: (alerts: SosAlert[]) => void) {
    const q = query(collection(db, "sos-alerts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const alerts: SosAlert[] = [];
        querySnapshot.forEach((doc) => {
            alerts.push({ id: doc.id, ...doc.data() } as SosAlert);
        });
        callback(alerts);
    }, (error) => {
        console.error("Error fetching SOS alerts: ", error);
    });

    return unsubscribe;
}
