import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-login-with-arkose-modal',
  templateUrl: './login-with-modal-arkose.component.html',
})
export class LoginWithModalArkoseComponent implements OnInit {
  public publicKey: string;
  public arkoseToken: string | undefined;
  constructor(private _router: Router) {
    this.arkoseToken = undefined;
    this.publicKey = environment.arkoseKey;
  }

  ngOnInit(): void {}

  onCompleted(token: string) {
    this.arkoseToken = token;
    this._router.navigate(['/dashboard']);
  }

  onError(errorMessage: any) {
    alert(errorMessage);
  }

  onSubmit() {
    if (!this.arkoseToken) {
      window.myEnforcement.run();
    }
  }
}
