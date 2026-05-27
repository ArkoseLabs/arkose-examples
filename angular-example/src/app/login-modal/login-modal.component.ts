import { Component, inject, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArkoseComponent } from '../arkose/arkose.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ArkoseComponent, RouterLink],
  template: `
    <h2>Login (Modal)</h2>
    <input type="text" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <button (click)="onSubmit()">Sign In</button>
    <arkose
      #arkoseRef
      [publicKey]="publicKey"
      mode="lightbox"
      (completed)="onCompleted($event)"
    />
    <p><a routerLink="/">Switch to Inline Login</a></p>
  `,
})
export class LoginModalComponent {
  private arkoseRef = viewChild.required<ArkoseComponent>('arkoseRef');
  private router = inject(Router);

  publicKey = environment.arkoseKey;
  private token: string | null = null;

  onCompleted(token: string): void {
    this.token = token;
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (!this.token) {
      this.arkoseRef().run();
    }
  }
}
