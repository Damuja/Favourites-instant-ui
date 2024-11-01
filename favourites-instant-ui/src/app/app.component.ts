// src/app/app.component.ts
import { Component } from '@angular/core';
import { DataGridComponent } from './data-grid/data-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataGridComponent],
  template: `
    <h1>Dummy Fav & Instant tickets</h1>
    <app-data-grid></app-data-grid>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
