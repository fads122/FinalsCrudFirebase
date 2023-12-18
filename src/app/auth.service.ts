import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;



  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) {
    const app = initializeApp({
      apiKey: "AIzaSyBjAbdwCUe4w3ubimXtnovIKYU6K1-qAig",
      authDomain: "firecrud-2ee77.firebaseapp.com",
      databaseURL: "https://firecrud-2ee77-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "firecrud-2ee77",
      storageBucket: "firecrud-2ee77.appspot.com",
      messagingSenderId: "452447375053",
      appId: "1:452447375053:web:c422df9a1a296c4c85a384"
    });

    this.auth = getAuth(app);

    this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }




  getAuthState() {
    return this.afAuth.authState;
  }



  getCurrentUser() {
    return this.auth.currentUser;
  }

   async getUserId(): Promise<string> {
    const user = await this.afAuth.currentUser;
    return user?.uid || '';
  }



  async getUserEmail(): Promise<string> {
    const user = await this.afAuth.currentUser;
    return user?.email || '';
  }


  async register(email: string, password: string) {
    const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
    if (result.user) {
      await this.firestore.collection('users').doc(result.user.uid).set({
        email: email,
        savedPosts: []
        // add any other user details you want to store
      });
    }
  }

  async login(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    if (result.user) {
      const uid = result.user.uid;
      if (uid) {
        this.firestore.collection('users').doc(uid).get().subscribe(userDoc => {
          if (!userDoc.exists) {
            console.error('User document not found');
          }
        });
        this.router.navigate(['/post-list']); // Add this line
      } else {
        console.error('User ID is undefined');
      }
    } else {
      console.error('User not found');
    }
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
