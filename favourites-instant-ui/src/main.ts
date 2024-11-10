import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { DataGridComponent } from './app/data-grid/data-grid.component';
import { InstantFaresManagementComponent } from './app/instant-fares-management/instant-fares-management.component'; // Import the new component

// Define routes
const routes: Routes = [
  { path: '', component: DataGridComponent }, // Default path to DataGrid
  { path: '/instant-fare', component: InstantFaresManagementComponent }, // Route to InstantFarePage
];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([]) // Add routes here when needed
  ]
}).catch((err) => console.error(err));