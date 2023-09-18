import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  index=0
  listofPosts: Post[]=[
    new Post("Tech Crunch", "https://www.hostinger.ph/tutorials/wp-content/uploads/sites/2/2021/12/engadget-website-homepage.png", "Launched by Peter Rojas, Engadget is a technology blog providing reviews of gadgets and consumer electronics as well as the latest news in the tech world.", "Christian Montesor", new Date()),
    new Post("Engadget", "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/12/techcrunch-website-homepage.webp", "TechCrunch is a blog that provides technology and startup news, from the latest developments in Silicon Valley to venture capital funding.", "Christian Montesor", new Date()),
    new Post("Engadget", "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/12/techcrunch-website-homepage.webp", "TechCrunch is a blog that provides technology and startup news, from the latest developments in Silicon Valley to venture capital funding.", "Christian Montesor", new Date())
  ]
  constructor(){}
  

  ngOnInit(): void{

  }
}
