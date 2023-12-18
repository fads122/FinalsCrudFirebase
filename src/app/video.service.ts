import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface UserData {
  videoUrl?: string;
  // Add other user properties here if needed
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) { } // Inject AngularFirestore

  uploadVideo(file: File, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = `${path}/${Date.now()}_${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            resolve(url);  // This 'url' is the download URL
          }, err => {
            reject(err);
          });
        })
      ).subscribe();
    });
  }

  async getAllUsersVideoUrls(): Promise<string[]> {
    const snapshot = await this.firestore.collection('users').get().toPromise();
    if (snapshot) {
      return snapshot.docs.map(doc => (doc.data() as UserData).videoUrl).filter(url => url !== undefined) as string[];
    } else {
      console.error('Snapshot not found');
      return [];
    }
  }
}


