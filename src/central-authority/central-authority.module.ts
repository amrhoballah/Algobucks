import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './central-authority-routing.module';
import { CentralAuthorityDashboardComponent } from './admin-dashboard/central-authority-dashboard.component';
import { SidebarComponent } from './admin-dashboard/sidebar/sidebar.component';
import { HeaderComponent } from './admin-dashboard/header/header.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { ViewComponent } from './organisation/view/view.component';
import { AddComponent } from './organisation/add/add.component';
import { FormsModule } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { OrganisationService } from './services/organisation.service';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { CardComponent } from './dashboard-home/card/card.component';
import { ReportsComponent } from './reports/reports.component';
import { UtilsModule } from 'src/utils/utils.module';
import { BlockchainService } from 'src/services/blockchain.service';

@NgModule({
  declarations: [
    CentralAuthorityDashboardComponent,
    SidebarComponent,
    HeaderComponent,
    OrganisationComponent,
    ViewComponent,
    AddComponent,
    DashboardHomeComponent,
    CardComponent,
    ReportsComponent
  ],
  imports: [CommonModule, AdminRoutingModule, FormsModule,UtilsModule],
  providers: [NgxImageCompressService,OrganisationService,BlockchainService],
})
export class CentralAuthorityModule {}
