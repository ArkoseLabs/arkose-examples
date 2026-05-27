import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArkoseComponent } from '../arkose/arkose.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login-inline',
  standalone: true,
  imports: [ArkoseComponent, RouterLink],
  template: `
    <h2>Login (Inline)</h2>
    <input type="text" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <arkose
      [publicKey]="publicKey"
      mode="inline"
      selectorId="arkose-inline"
      (completed)="onCompleted($event)"
    />
    <p><a routerLink="/login-modal">Switch to Modal Login</a></p>
  `,
})
export class LoginInlineComponent {
  private router = inject(Router);
  publicKey = environment.arkoseKey;

  onCompleted(token: string): void {
    this.router.navigate(['/dashboard']);
  }
}
