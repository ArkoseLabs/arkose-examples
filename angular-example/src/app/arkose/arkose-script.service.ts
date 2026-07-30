import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ArkoseScriptService {
  private document = inject(DOCUMENT);

  loadScript(publicKey: string, nonce?: string): HTMLScriptElement {
    const scriptId = `arkose-script-${publicKey}`;
    const existing = this.document.getElementById(scriptId);
    if (existing) {
      existing.remove();
    }

    const script = this.document.createElement('script');
    script.id = scriptId;
    script.src = `https://client-api.arkoselabs.com/v2/${publicKey}/api.js`;
    script.setAttribute('data-callback', 'setupEnforcement');
    script.async = false;
    if (nonce) {
      script.setAttribute('data-nonce', nonce);
    }
    this.document.body.appendChild(script);
    return script;
  }

  removeScript(publicKey: string): void {
    const scriptId = `arkose-script-${publicKey}`;
    const existing = this.document.getElementById(scriptId);
    if (existing) {
      existing.remove();
    }
  }
}
