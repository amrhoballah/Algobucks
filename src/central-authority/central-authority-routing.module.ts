import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralAuthorityDashboardComponent } from './admin-dashboard/central-authority-dashboard.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: '',
    component: CentralAuthorityDashboardComponent,
    children: [
      { path: 'central-dashboard', component: DashboardHomeComponent },
      { path: 'organisations', component: OrganisationComponent },
      { path: 'reports', component: ReportsComponent },
    ],
  },
  {
    path:'',redirectTo:'central-authority/central-dashboard'
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
