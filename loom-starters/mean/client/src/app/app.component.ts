import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  message = 'Loading...';

  constructor(private http: HttpClient) {
    this.http.get<{ message: string }>('http://localhost:5000/').subscribe({
      next: (res) => (this.message = res.message),
      error: () => (this.message = 'Could not reach the server'),
    });
  }
}
