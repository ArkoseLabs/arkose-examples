import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h2>Dashboard</h2>
    <p>Welcome! You have been verified.</p>
    <a routerLink="/">Back to Login</a>
  `,
})
export class DashboardComponent {}
