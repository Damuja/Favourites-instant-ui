import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstantFaresManagementComponent } from './instant-fares-management/instant-fares-management.component';

const routes: Routes = [
  { path: 'instant-fares', component: InstantFaresManagementComponent },
  // other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}