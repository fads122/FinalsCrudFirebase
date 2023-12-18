import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  async login(event: Event, email: string, password: string) {
    event.preventDefault();
    try {
      await this.authService.login(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle the error further if needed, e.g. show a message to the user
    }
  }
}
