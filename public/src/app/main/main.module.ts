import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [HeaderComponent, MainComponent],
  imports: [CommonModule, MaterialModule],
  exports: [MainComponent],
})
export class MainModule {}
