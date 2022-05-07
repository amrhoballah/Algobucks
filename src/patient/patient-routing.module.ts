import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: PatientDashboardComponent,
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
    ],
  },
  {
    path: '',
    component: DashboardHomeComponent,
    redirectTo: 'dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
