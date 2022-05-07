import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { OrganisationDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './admin-dashboard/sidebar/sidebar.component';
import { HeaderComponent } from './admin-dashboard/header/header.component';
import { DoctorComponent } from './doctor/doctor.component';
import { AddComponent } from './doctor/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DoctorService } from './services/doctor.service';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CardComponent } from './dashboard-home/card/card.component';
import { ReportsComponent } from './reports/reports.component';
import { PatientComponent } from './patient/patient.component';
import { UtilsModule } from 'src/utils/utils.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewAllDoctorsComponent } from './doctor/view-doctors/view.component';

@NgModule({
  declarations: [
    OrganisationDashboardComponent,
    SidebarComponent,
    HeaderComponent,
    DoctorComponent,
    AddComponent,
    DashboardHomeComponent,
    CardComponent,
    ReportsComponent,
    PatientComponent,
    ViewAllDoctorsComponent
  ],
  imports: [ 
    CommonModule,
    AdminRoutingModule, 
    FormsModule,
    UtilsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatGridListModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule
  ],
  providers: [NgxImageCompressService,DoctorService],
})
export class AdminModule {}
