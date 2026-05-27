import { Component, input, output, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ArkoseScriptService } from './arkose-script.service';
import { ArkoseEnforcement, ArkoseCompletedResponse, ArkoseErrorResponse, ArkoseFailedResponse } from './arkose.types';

@Component({
  selector: 'arkose',
  standalone: true,
  template: `@if (mode() === 'inline' && selectorId()) {
    <div [id]="selectorId()" />
  }`,
})
export class ArkoseComponent implements OnInit, OnDestroy {
  publicKey = input.required<string>();
  maxRetries = input(2);
  mode = input<'lightbox' | 'inline'>();
  selectorId = input<string>();
  nonce = input<string>();

  ready = output<void>();
  shown = output<void>();
  show = output<void>();
  suppress = output<void>();
  completed = output<string>();
  reset = output<void>();
  hide = output<void>();
  error = output<ArkoseErrorResponse>();
  failed = output<ArkoseFailedResponse>();

  private enforcement: ArkoseEnforcement | null = null;
  private retryCount = 0;
  private resetting = false;
  private zone = inject(NgZone);
  private scriptService = inject(ArkoseScriptService);

  run(): void {
    this.enforcement?.run();
  }

  ngOnInit(): void {
    window.setupEnforcement = this.setupEnforcement;
    this.scriptService.loadScript(this.publicKey(), this.nonce());
  }

  ngOnDestroy(): void {
    delete window.setupEnforcement;
    this.scriptService.removeScript(this.publicKey());
  }

  private async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('https://status.arkoselabs.com/api/v2/status.json');
      const data: { status: { indicator: string } } = await res.json();
      return data.status.indicator === 'none';
    } catch {
      return false;
    }
  }

  private setupEnforcement = (enforcement: ArkoseEnforcement): void => {
    this.enforcement = enforcement;
    this.enforcement.setConfig({
      selector: this.selectorId() ? `#${this.selectorId()}` : undefined,
      mode: this.mode(),
      onReady: () => this.zone.run(() => {
        this.resetting = false;
        this.ready.emit();
      }),
      onShown: () => this.zone.run(() => this.shown.emit()),
      onShow: () => this.zone.run(() => this.show.emit()),
      onSuppress: () => this.zone.run(() => this.suppress.emit()),
      onCompleted: (response: ArkoseCompletedResponse) => this.zone.run(() => {
        this.completed.emit(response.token);
      }),
      onReset: () => this.zone.run(() => this.reset.emit()),
      onHide: () => this.zone.run(() => this.hide.emit()),
      onError: async (response: ArkoseErrorResponse) => {
        const healthy = await this.checkHealth();
        if (healthy && this.retryCount < this.maxRetries()) {
          this.resetting = true;
          this.retryCount++;
          enforcement.reset();
          return;
        }
        this.zone.run(() => this.error.emit(response));
      },
      onFailed: (response: ArkoseFailedResponse) => this.zone.run(() => {
        this.failed.emit(response);
      }),
    });
  };
}
