import { initializeApp } from "firebase/app";
import { collection, addDoc, deleteDoc, getDocs, doc, getFirestore } from "firebase/firestore";
import { Pilot } from '../models/pilot-model';
import { Env } from '@stencil/core';
import { isOlderThanTenMinutes } from '../utils/utils';

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
    let pilotFromDb: Pilot;
    querySnapshot.forEach(pilot => {
      if (isOlderThanTenMinutes(pilot.data().violationTimestamp.toDate())) {
        const docRef = doc(db, "pilots", pilot.id);
        FirebaseService.deletePilotFromFirebase(docRef);
      }
      if (pilot.data().pilotId === pilotId) {
        pilotFromDb = pilot.data() as Pilot;
      }
    })
    return pilotFromDb as Pilot;
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
        lastSeen: pilotData.lastSeen,
      });
  }

  static async deletePilotFromFirebase(docRef: any): Promise<void> {
    await deleteDoc(docRef);
  }
}
