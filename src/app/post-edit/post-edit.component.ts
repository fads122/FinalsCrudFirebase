import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post-service';
import { Post } from '../post.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  form!: FormGroup;
  index: string = '';
  editMode = false;

  constructor(private postService: PostService, private router: Router, private actRoute: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {

    let title = '';
    let description = '';
    let imgPath = '';


    this.actRoute.params.subscribe(async (params: Params) => {
      this.index = params['index'];
      if(this.index){
        // Fetch the posts from the database
        const listofPosts = await this.postService.getPost();

        const editPost = listofPosts[+this.index]; // Convert string to number using the unary plus operator

        if (editPost) {
          this.form.controls['title'].setValue(editPost.title);
          this.form.controls['description'].setValue(editPost.description);
          this.form.controls['imgPath'].setValue(editPost.imgPath);

          this.editMode = true;
        }
      } else {
        this.editMode = false;
      }
    });

      this.form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        imgPath: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
      });

}

async onSubmit() {
  const title = this.form.value.title;
  const imgPath = this.form.value.imgPath;
  const description = this.form.value.description;
  const userId = await this.authService.getUserId();
  const userEmail = await this.authService.getUserEmail();

  let likes: string[] = []; // Add this line

  const post: Post = new Post(
    title,
    imgPath,
    description,
    'Christian L. Montesor',
    userEmail,
    new Date(),
    0,
    likes, // Add this line
    [], // Initialize comments as an empty array
    userId
  );

  if(this.editMode == true){
    this.postService.updatePost(userId, post);
  }
  else{
    this.postService.addPost(post);
  }

  this.router.navigate(['post-list']);
}
}
