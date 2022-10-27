import { LoginWithInlineArkoseComponent } from './login-with-inline-arkose/login-with-inline-arkose.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginWithModalArkoseComponent } from './login-with-modal-arkose/login-with-modal-arkose.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login/inline',
  },
  {
    path: 'login/inline',
    component: LoginWithInlineArkoseComponent,
  },
  {
    path: 'login/modal',
    component: LoginWithModalArkoseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
