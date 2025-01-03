import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: OrganisationDashboardComponent,
    children: [
      { path: 'admin-dashboard', component: DashboardHomeComponent },
      { path: 'doctor', component: DoctorComponent },
      { path: 'patient', component: PatientComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
  {
    path:'',redirectTo:'organisation/admin-dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
