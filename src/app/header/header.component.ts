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
  @Output() searchTermChange = new EventEmitter<string>();
  private _searchTerm: string = '';

  constructor(private postService: PostService, private backEndService: BackEndService, private authService: AuthService, private router: Router){}

  ngOnInit(): void {
  }

  onSave(){
    this.backEndService.saveData();
  }

  goToProfile() {
    this.router.navigate(['/user-profile']);
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

  onSearch(): void {
    this.postService.setSearchTerm(this.searchTerm);
  }
  onSearchClick(): void {
    this.postService.setSearchTerm(this.searchTerm);
  }
}
