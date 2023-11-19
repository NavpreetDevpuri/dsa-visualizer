import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
@Component({
  // ... existing metadata
})
export class HomeComponent {
  selectedComponent: string = '';

  constructor(private router: Router) {}

  loadComponent() {
    if (this.selectedComponent) {
      this.router.navigate([this.selectedComponent]);
    }
  }
}
