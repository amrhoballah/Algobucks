import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationComponent } from './consultation/consultation.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { ViewAllPatientsComponent } from './view-patients/view.component';
import { ViewRecordComponent } from './view-record/view-record.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorDashboardComponent,
    children: [
      { path: 'dashboard', component: DashboardHomeComponent },
      { path: 'all-patients', component: ViewAllPatientsComponent },
      { path: 'all-patients/consult', component: ConsultationComponent, redirectTo: 'consult' },
      { path: 'consult', component: ConsultationComponent },
      { path: 'view-record', component: ViewRecordComponent }
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
export class DoctorRoutingModule {}
