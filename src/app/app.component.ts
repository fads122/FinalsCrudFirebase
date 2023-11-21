import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { BackEndService } from './back-end.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private backEndService: BackEndService, private authService: AuthService) {}
  ngOnInit(): void {
    this.backEndService.fetchData();
  }
  title = 'crud';
}
