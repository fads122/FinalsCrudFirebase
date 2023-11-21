import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BackEndService } from '../back-end.service';
import { PostService } from '../post-service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private _searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();

  constructor (private backEndService: BackEndService, private postService: PostService, private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    
  }

  onSave(){
    this.backEndService.saveData();
  }

  onLogout() {
    this.authService.logout();
  }

  onFetch() {
    this.backEndService.fetchData();
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.searchTermChange.emit(this._searchTerm);
  }

  get searchTerm(): string {
    return this._searchTerm;
  }
}
