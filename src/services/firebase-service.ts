import { initializeApp } from "firebase/app";
import { deleteDoc, getDocs, getFirestore } from "firebase/firestore";
import { collection, doc, addDoc } from "firebase/firestore";
import { Pilot } from '../models/pilot-model';
import { Env } from '@stencil/core';

const firebaseConfig = {
  apiKey: Env.API_KEY,
  authDomain: Env.AUTH_DOMAIN,
  projectId: Env.PROJECT_ID,
  storageBucket: Env.STORAGE_BUCKET,
  messagingSenderId: Env.MESSAGING_SENDER_ID,
  appId: Env.APP_ID,
  measurementId: Env.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class FirebaseService {
  static async readAllPilotDataFromFirebase(): Promise<Pilot[]> {
    let allPilots: Pilot[] = [];
    const querySnapshot = await getDocs(collection(db, "pilots"));
    querySnapshot.forEach((doc) => {
      allPilots.push(doc.data() as Pilot)
    });
    return allPilots as Pilot[];
  }

  static async readPilotDataFromFirebase(pilotId: string): Promise<Pilot> {
    const querySnapshot = await getDocs(collection(db, "pilots"));
    let pilot: Pilot;
    querySnapshot.forEach(doc => {
      if (doc.data().pilotId === pilotId) {
        pilot = doc.data() as Pilot;
      }
    })
    return pilot as Pilot;
  }

  static postPilotDataToFirebase(pilotData: Pilot): void {
    addDoc(collection(db, "pilots"), {
        createdDt: pilotData.createdDt,
        email: pilotData.email,
        firstName: pilotData.firstName,
        lastName: pilotData.lastName,
        phoneNumber: pilotData.phoneNumber,
        pilotId: pilotData.pilotId,
        closestDistance: pilotData.closestDistance,
        violationTimestamp: pilotData.violationTimestamp,
        lastSeen: pilotData.lastSeen
      });
  }

  static async deletePilotFromFirebase(pilotId: string): Promise<void> {
    await deleteDoc(doc(db, "pilots", pilotId));
  }
}
