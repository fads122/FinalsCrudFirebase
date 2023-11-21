import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.email, this.password)
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error(error);
        // handle error here, e.g. show a message to the user
      });
  }
}
