import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'central-authority',
    loadChildren: () =>
      import('../central-authority/central-authority.module').then((m) => m.CentralAuthorityModule),
  },
  {
    path: 'doctor',
    loadChildren: () =>
      import('../doctor/doctor.module').then((m) => m.DoctorModule),
  },
  { path: '**', component: HomeComponent, redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
