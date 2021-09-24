import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [HeaderComponent, MainComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [MainComponent],
})
export class MainModule {}
