/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  NgZone,
  OnDestroy,
  Input,
} from '@angular/core';
import { ArkoseScriptService } from '../../../services/arkose-script.service';

@Component({
  selector: 'arkose',
  templateUrl: './arkose.component.html',
})
export class ArkoseComponent implements OnInit, OnDestroy {
  @Input() public publicKey: string;
  @Input() public mode?: 'lightbox' | 'inline';
  @Input() public selector?: string;
  @Output() onReady = new EventEmitter();
  @Output() onShown = new EventEmitter();
  @Output() onShow = new EventEmitter();
  @Output() onSuppress = new EventEmitter();
  @Output() onCompleted = new EventEmitter();
  @Output() onReset = new EventEmitter();
  @Output() onHide = new EventEmitter();
  @Output() onError = new EventEmitter();
  @Output() onFailed = new EventEmitter();
  
  // Variables for Health Checks
  private arkoseRetryCount = 0; // Counter for script retries
  private arkoseMaxRetries = 2; // The number of retries to perform when error (Configurable)

  constructor(
    private renderer: Renderer2,
    private arkoseScriptService: ArkoseScriptService,
    private zone: NgZone
  ) {
    this.publicKey = '';
  }

  ngOnInit(): void {
    // This injects the Arkose script into the angular dom
    const scriptElement = this.arkoseScriptService.loadScript(
      this.renderer,
      this.publicKey
    );

    // This will inject required html and css after the Arkose script is properly loaded
    scriptElement.onload = () => {
      console.log('Arkose API Script loaded');
      window.setupEnforcement = this.setupEnforcement.bind(this);
    };

    // If there is an error loading the Arkose script this callback will be called
    scriptElement.onerror = () => {
      console.log('Could not load the Arkose API Script!');
    };
  }

  ngOnDestroy(): void {
    if (window.myEnforcement) {
      delete window.myEnforcement;
    }
    if (window.setupEnforcement) {
      delete window.setupEnforcement;
    }
  }

  /**
    * Checks the current status of the Arkose Labs platform
    */
  async checkArkoseAPIHealthStatus() {
    try {
      const healthResponse = await fetch(
        'https://status.arkoselabs.com/api/v2/status.json'
      );
      const healthJson = await healthResponse.json();
      const status = healthJson.status.indicator;
      return status === 'none'; // status "none" indicates Arkose systems are healthy
    } catch (error) {
      return false;
    }
  }

  /**
   * This is the function that will be called after the Arkose script has loaded
   * @param myEnforcement Arkose Enforcement object
   */
  setupEnforcement = (myEnforcement: any) => {
    window.myEnforcement = myEnforcement;
    window.myEnforcement.setConfig({
      selector: this.selector && `#${this.selector}`,
      mode: this.mode,
      onReady: () => {
        this.zone.run(() => {
          this.onReady.emit();
        });
      },
      onShown: () => {
        this.zone.run(() => {
          this.onShown.emit();
        });
      },
      onShow: () => {
        this.zone.run(() => {
          this.onShow.emit();
        });
      },
      onSuppress: () => {
        this.zone.run(() => {
          this.onSuppress.emit();
        });
      },
      onCompleted: (response: any) => {
        if (response.token) {
          this.zone.run(() => {
            this.onCompleted.emit(response.token);
          });
        }
      },
      onReset: () => {
        this.zone.run(() => {
          this.onReset.emit();
        });
      },
      onHide: () => {
        this.zone.run(() => {
          this.onHide.emit();
        });
      },
      onError: async (response: any) => {
        const arkoseStatus = await this.checkArkoseAPIHealthStatus();
        if (arkoseStatus && this.arkoseRetryCount < this.arkoseMaxRetries) {
          myEnforcement.reset();
          // To ensure the enforcement has been successfully reset, we need to set a timeout here
          setTimeout(function () {
            myEnforcement.run();
          }, 500);
          this.arkoseRetryCount++;
          return;
        }
        this.zone.run(() => {
          this.onError.emit(response);
          // Error can be handled via this event.
        });
      },
      onFailed: (response: any) => {
        this.zone.run(() => {
          this.onFailed.emit(response);
        });
      },
    });
  };
}
