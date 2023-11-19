import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { KmpSearchComponent } from './components/kmp-search/kmp-search.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'kmpSearch', component: KmpSearchComponent },
  // ... other routes
];
