import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';
import { Auth } from '@firebase/auth';

interface UserData {
  savedPosts?: string[];
  // Add other user properties here
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth, private authService: AuthService) { }

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
      console.error('Snapshot not found');
      return [];
    }
  }

  async addSavedPost(postId: string) {
    const user = await this.afAuth.currentUser;
    const userId = user?.uid;
    if (userId) {
      const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();
      if (userDoc?.exists) {
        let userData = userDoc.data() as UserData;
        if (userData) {
          if (!userData.savedPosts) {
            userData.savedPosts = [];
          }
          userData.savedPosts.push(postId);
          await this.firestore.collection('users').doc(userId).set(userData);
        }
      } else {
        console.error(`User document not found for ID: ${userId}`);
      }
    }
  }

  async getUserDoc(userId: string) {
    return await this.firestore.collection('users').doc(userId).get().toPromise();
  }

  async updateUserProfileImage(url: string) {
    const userId = await this.authService.getUserId();
    await this.firestore.collection('users').doc(userId).update({ profileImageUrl: url });
  }

  async updateUserCoverImage(url: string) {
    const userId = await this.authService.getUserId();
    await this.firestore.collection('users').doc(userId).update({ coverImageUrl: url });
  }
}
