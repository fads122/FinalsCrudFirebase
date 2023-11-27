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
  index: number = 0;
  editMode = false;

  constructor(private postService: PostService, private router: Router, private actRoute: ActivatedRoute, private authService: AuthService) {}
  ngOnInit(): void {

    let title = '';
    let description = '';
    let imgPath = '';

    this.actRoute.params.subscribe((params: Params) => {
      let title = '';
      let description = '';
      let imgPath = '';

      if(params['id']){
        console.log(params['id']);
        const id = params['id'];

        const editPost = this.postService.getPostById(id);

        if (editPost) {
          title = editPost.title;
          description = editPost.description;
          imgPath = editPost.imgPath;

          this.editMode = true;
        }
      }

      this.form = new FormGroup({
        title: new FormControl(title, [Validators.required]),
        imgPath: new FormControl(imgPath, [Validators.required]),
        description: new FormControl(description, [Validators.required]),
      });
    });
  }

  async onSubmit() {
    const title = this.form.value.title;
    const imgPath = this.form.value.imgPath;
    const description = this.form.value.description;
    const userId = await this.authService.getUserId();

    let existingPost = this.postService.getSpecPost(this.index);
    let postId = existingPost ? existingPost.id : '';

    let comments: { userId: string, comment: string }[] = [];

    const post: Post = new Post(
      postId,
      title,
      imgPath,
      description,
      'Christian L. Montesor',
      new Date(),
      0,
      comments,
      userId
    );

    if(this.editMode == true){
      this.postService.updatePost(this.index, post)
    }
    else{
      this.postService.addPost(post);
    }

    this.router.navigate(['post-list']);
  }}
