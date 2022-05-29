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
  selector: 'organisation-view',
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
    this.GetOrgs()
  }

  async loadOrgDetails() {
    for (let i = 0; i < this.Organisations.length; i++) {
      let orgDetails = await this.organisationService.getOrgDetails(this.Organisations[i])
      for (const org of this.OrganisationDetails) {
        if(org[0] != org[0]){
          this.OrganisationDetails.push(orgDetails)
        }
      }
    }    
  }

  GetOrgs(): any{
    this.showProgressCard= true;
    this.showProgressWarn = false;
    this.progressMsg = ''

    if(this.Organisations.length >= 1){
      this.showProgressCard = false
    }

    setTimeout(() => {
      this.Organisations = this.organisationService.Organisations;
      if (this.Organisations.length >= 1) {
        this.loadOrgDetails();
        console.log("All Orgs ", this.OrganisationDetails);
        
        this.progressMsg = "Found "+this.Organisations.length + " Accounts"
      }
      else{
        this.progressMsg = 'No Organisations in the Network....'
      }
    }, 1000);

    setTimeout(() => {
      if(this.Organisations.length <= 0){
        this.showProgressWarn = true;
      }

      if(this.OrganisationDetails.length > 0){
        this.loaded = true
      }

      if (this.OrganisationDetails.length == this.Organisations.length) {
        this.showProgressCard = false
        this.loadComplete = true
        this.OrganisationDetails = this.organisationService.OrganisationDetails;
        this.loaded = true
      } else {
        this.progressMsg = "Loading Organisation Details...."
        this.OrganisationDetails = this.organisationService.OrganisationDetails;
        this.showProgressCard = false
        this.loadComplete = true
        this.loaded = true
      }
    }, 1000);
    
  }
}
