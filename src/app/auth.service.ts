import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth;

  

  constructor(private afAuth: AngularFireAuth, private router: Router) {
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
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    const result = await this.afAuth.signInWithEmailAndPassword(email, password);
    localStorage.setItem('user', JSON.stringify(result.user));
    this.router.navigate(['/post-list']);
  }

  async logout() {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
