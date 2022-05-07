import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patient-routing.module';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { SidebarComponent } from './patient-dashboard/sidebar/sidebar.component';
import { HeaderComponent } from './patient-dashboard/header/header.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { UtilsModule } from 'src/utils/utils.module';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    PatientDashboardComponent,
    SidebarComponent,
    HeaderComponent,
    DashboardHomeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
    PatientsRoutingModule, 
    UtilsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatExpansionModule, 
    MatFormFieldModule, 
    MatIconModule,
    MatDatepickerModule
  ],
})
export class PatientModule {}
