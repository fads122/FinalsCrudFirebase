import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) { }

  async register(email: string, password: string) {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    if (credential.user) {
      await this.firestore.collection('users').doc(credential.user.uid).set({
        email: email,
        // add any other user details you want to store
      });
    } else {
      // Handle the case when user is null
      console.error('User not found');
    }
  }

  async getUsers() {
    const snapshot = await this.firestore.collection('users').get().toPromise();
    if (snapshot) {
      return snapshot.docs.map(doc => doc.data());
    } else {
      // Handle the case when snapshot is undefined
      console.error('Snapshot not found');
      return [];
    }
  }
}
