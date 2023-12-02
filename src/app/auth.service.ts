import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/post-list']);
      } else {
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      }
    });
  }

  getAuthState() {
    return this.afAuth.authState;
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
