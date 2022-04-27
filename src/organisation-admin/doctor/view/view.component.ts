import { ThisReceiver } from '@angular/compiler';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { Organisation } from 'src/app/models/organisation.model';
import { OrganisationService } from 'src/central-authority/services/organisation.service';

@Component({
  selector: 'doctor-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewComponent implements OnInit {

  Organisations: string[] = [];

  Organisation:any = {};

  OrganisationDetails: any = [];

  loaded : boolean = false;
  loadComplete: boolean = false;

  showProgressCard: boolean = false;
  showProgressWarn:boolean = false;
  progressMsg:string = ''
  

  constructor(private organisationService: OrganisationService) {
    this.progressMsg = 'Loading Organisations From Blockchain'
    this.Organisations = this.organisationService.Organisations;
  }

  ngOnInit(): void {    
    //this.GetOrgs()
  }

  // async loadOrgDetails() {
  //   for (let i = 0; i < this.Organisations.length; i++) {
  //     let orgDetails = await this.organisationService.getOrgDetails(this.Organisations[i])
  //     for (const org of this.OrganisationDetails) {
  //       if(org[0] != org[0]){
  //         this.OrganisationDetails.push(orgDetails)
  //       }
  //     }
  //   }    
  // }

  // GetOrgs(): any{
  //   this.showProgressCard= true;
  //   this.showProgressWarn = false;
  //   this.progressMsg = ''

  //   if(this.Organisations.length >= 1){
  //     this.showProgressCard = false
  //   }

  //   let orgCall = setInterval(() => {
  //     console.log('interval');

  //     this.Organisations = this.organisationService.Organisations;
  //     console.log(this.Organisations.length);
  //     if (this.Organisations.length >= 1) {
  //       this.loadOrgDetails();
  //       this.progressMsg = "Found "+this.Organisations.length + " Accounts"
  //       clearInterval(orgCall);
  //     }
  //     else{
  //       this.progressMsg = 'No Organisations in the Network....'
  //     }
  //   }, 1000);

  //   let OrgDetailsCall = setInterval(() => {
  //     console.log('loading Org Details');
  //     console.log('OrgDet len', this.organisationService.OrganisationDetails.length);
  //     console.log('Org len', this.Organisations.length);

  //     if(this.Organisations.length <= 0){
  //       clearInterval(OrgDetailsCall)
  //     }

  //     if(this.OrganisationDetails.length > 0){
  //       this.loaded = true
  //     }

  //     if (this.OrganisationDetails.length == this.Organisations.length) {
  //       console.log(this.organisationService.OrganisationDetails);
  //       this.showProgressCard = false
  //       this.loadComplete = true
  //       this.OrganisationDetails = this.organisationService.OrganisationDetails;
  //       clearInterval(OrgDetailsCall);
  //     } else {
  //       this.progressMsg = "Loading Organisation Details...."
  //       console.log(' Organisation... fff', this.organisationService.OrganisationDetails);
  //       this.OrganisationDetails = this.organisationService.OrganisationDetails;
  //     }
  //   }, 5000);
    
  // }
}
