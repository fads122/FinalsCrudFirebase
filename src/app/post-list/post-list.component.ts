import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UserService } from '../user.service';
import { VideoService } from '../video.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  searchTerm: string = '';
  authSub: Subscription;
  videoUrl: string = '';
  otherUsersVideoUrls: string[] = [];



  constructor(private postService: PostService, private authService: AuthService, private videoService: VideoService,  private firestore: AngularFirestore) {
    this.authSub = new Subscription();
  }

  async ngOnInit(): Promise<void> {
    this.authSub = this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.postService.getPost().then(posts => {
          this.posts = posts.sort((a, b) => a.order - b.order); // Sort the posts by their order property
          this.filteredPosts = [...this.posts];
          console.log('Posts:', this.posts);
        });
      }
    });
    this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.filteredPosts = [...posts];
    });
    this.postService.getSearchTerm().subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.onSearch();
    });
    this.postService.getPostDeletedListener().subscribe(() => {
      this.postService.getPost().then(posts => {
        this.posts = posts;
        this.filteredPosts = [...posts];
        console.log('Posts after deletion:', this.posts);
      });
    });

    // Fetch the video URL from Firestore
    const userId = await this.authService.getUserId();
  if (userId) {  // Add this check
    const userDoc = await this.firestore.collection('users').doc(userId).get().toPromise();
    if (userDoc?.exists) {
      const userData: any = userDoc.data();
      if (userData) {
        this.videoUrl = userData.videoUrl;
      }
    }
  }
  await this.fetchOtherUsersVideos();
}

async fetchOtherUsersVideos() {
  this.otherUsersVideoUrls = await this.videoService.getAllUsersVideoUrls();
}

  async onSearch(): Promise<void> {
    const userId = await this.authService.getUserId();
    this.filteredPosts = this.postService.searchPosts(this.searchTerm, userId);
    console.log('Filtered posts:', this.filteredPosts); // Add this line
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.filteredPosts, event.previousIndex, event.currentIndex);
    this.filteredPosts.forEach((post, index) => {
      post.order = index;
      console.log(`Post ID: ${post.id}, New order: ${post.order}`); // Add this line
    });
    this.postService.saveData();
  }

  async onRecordVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      // Display the stream in a video element
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = event => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const file = new File([blob], 'video.mp4', { type: 'video/mp4' });
        this.videoService.uploadVideo(file, 'videos').then(async url => {
          // Wait for 5 seconds before setting videoUrl
          await new Promise(resolve => setTimeout(resolve, 5000));
          this.videoUrl = url;
          console.log('Video URL:', this.videoUrl);
          // Save the URL to the post in Firestore
          const userId = await this.authService.getUserId();
      if (userId) {  // Add this check
        await this.firestore.collection('users').doc(userId).update({ videoUrl: url });
      }
        });
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        if (videoElement) {
          videoElement.srcObject = null;
        }
      }, 5000); // Record for 5 seconds
    });
  }



  }


