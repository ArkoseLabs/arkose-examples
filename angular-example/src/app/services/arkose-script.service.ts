import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';
declare global {
  interface Window {
    setupEnforcement?: (myEnforcement: any) => void;
    myEnforcement?: any;
  }
}
@Injectable({
  providedIn: 'root',
})
export class ArkoseScriptService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  // Append the JS tag to the Document Body.
  public loadScript(
    renderer: Renderer2,
    publicKey: string,
    nonce?: string
  ): HTMLScriptElement {
    const scriptId = 'arkose-script';
    const currentScript = this.document.getElementById(scriptId);
    if (currentScript) {
      currentScript.remove();
    }
    const script = renderer.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = `https://client-api.arkoselabs.com/v2/${publicKey}/api.js`;
    script.setAttribute('data-callback', 'setupEnforcement');
    script.async = true;
    script.defer = true;
    if (nonce) {
      script.setAttribute('data-nonce', nonce);
    }
    renderer.appendChild(this.document.body, script);
    return script;
  }
}
