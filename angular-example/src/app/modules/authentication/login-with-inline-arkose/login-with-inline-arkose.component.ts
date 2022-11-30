import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-login-with-inline-arkose',
  templateUrl: './login-with-inline-arkose.component.html',
})
export class LoginWithInlineArkoseComponent  {
  public showArkoseEC: boolean;
  public publicKey: string;
  constructor(private _router: Router) {
    this.showArkoseEC = false;
    this.publicKey = environment.arkoseKey;
  }

  onCompleted(token: string) {
    this._router.navigate(['/dashboard']);
  }

  onError(errorMessage: any) {
    alert(errorMessage);
  }
}
