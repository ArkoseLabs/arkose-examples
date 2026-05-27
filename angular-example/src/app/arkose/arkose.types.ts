export interface ArkoseEnforcement {
  setConfig(config: ArkoseConfig): void;
  run(): void;
  reset(): void;
}

export interface ArkoseConfig {
  selector?: string;
  mode?: 'inline' | 'lightbox';
  onReady?: () => void;
  onShown?: () => void;
  onShow?: () => void;
  onSuppress?: () => void;
  onCompleted?: (response: ArkoseCompletedResponse) => void;
  onReset?: () => void;
  onHide?: () => void;
  onError?: (response: ArkoseErrorResponse) => void;
  onFailed?: (response: ArkoseFailedResponse) => void;
}

export interface ArkoseCompletedResponse {
  token: string;
}

export interface ArkoseErrorResponse {
  error?: { error: string };
}

export interface ArkoseFailedResponse {
  token?: string;
}

declare global {
  interface Window {
    setupEnforcement?: (enforcement: ArkoseEnforcement) => void;
  }
}
