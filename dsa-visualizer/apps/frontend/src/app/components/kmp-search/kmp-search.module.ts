import { FormsModule } from '@angular/forms';
import { KmpSearchComponent } from './kmp-search.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    // other imports
    FormsModule,
  ],
  declarations: [KmpSearchComponent],
})
export class KmpSearchModule {}
