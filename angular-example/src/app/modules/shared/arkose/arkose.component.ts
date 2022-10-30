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

  // This is the function that will be called after the Arkose script has loaded
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
      onError: (response: any) => {
        this.zone.run(() => {
          this.onError.emit(response);
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
