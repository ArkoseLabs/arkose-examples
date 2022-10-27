import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArkoseComponent } from './arkose/arkose.component';

@NgModule({
  declarations: [
    ArkoseComponent,
  ],
  imports: [CommonModule],
  exports: [ArkoseComponent],
})
export class SharedModule {}
