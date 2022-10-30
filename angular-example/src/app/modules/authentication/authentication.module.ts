import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginWithInlineArkoseComponent } from './login-with-inline-arkose/login-with-inline-arkose.component';
import { LoginWithModalArkoseComponent } from './login-with-modal-arkose/login-with-modal-arkose.component';

@NgModule({
  declarations: [LoginWithInlineArkoseComponent, LoginWithModalArkoseComponent],
  imports: [
    CommonModule,
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class AuthenticationModule {}
