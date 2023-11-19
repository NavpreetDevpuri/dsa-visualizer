import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import if you're using forms in your HomeComponent

import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FormsModule, // Include this if your HomeComponent uses forms
  ],
  exports: [
    HomeComponent, // Export HomeComponent if it needs to be used outside this module
  ],
})
export class HomeModule {}
