// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { Injectable } from '@angular/core';
// import { User } from '@firebase/auth-types';

// @Injectable({
//   providedIn: 'root'
// })
// export class FirebaseService {
//   user!: User;

//   constructor(public firebaseAuth: AngularFireAuth) {
//     this.firebaseAuth.onAuthStateChanged(user => {
//       if (user) {
//         this.user = user;
//         localStorage.setItem('user', JSON.stringify(this.user));
//       } else {
//         localStorage.setItem('user', 'no user');
//       }
//     })
//   }

//   async signIn(email: string, password: string) {
//     var result = await this.firebaseAuth.signInWithEmailAndPassword(email, password)
//     localStorage.setItem('user', JSON.stringify(result.user));
//   }

//   async signUp(email: string, password: string) {
//     var result = await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
//     this.sendEmailVerification();
//   }

//   async sendEmailVerification() {
//     (await this.firebaseAuth.currentUser)?.sendEmailVerification();
//   }

//   async signOut() {
//     await this.firebaseAuth.signOut();
//     localStorage.removeItem('user');
//   }
// }
