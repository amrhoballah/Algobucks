import { ThisReceiver } from '@angular/compiler';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { toPractitioner } from 'src/app/models/mappers/practitioner.mapper';
import { Organisation } from 'src/app/models/organisation.model';
import { OrganisationService } from 'src/central-authority/services/organisation.service';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'doctors-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewAllDoctorsComponent implements OnInit {

  Doctors: any  = [];

  Organisation:any = {};

  DoctorDetails: any = [];

  loaded : boolean = false;
  loadComplete: boolean = false;

  showProgressCard: boolean = false;
  showProgressWarn:boolean = false;
  progressMsg:string = ''
  

  constructor(private doctorsService: BlockchainService, private router : Router) {
    this.progressMsg = 'Loading Doctors From Blockchain'
  }

  async ngOnInit() {  
    setTimeout(async () => {
      this.Doctors = await this.doctorsService.drContract.methods.getPractitionersPerOrg().call({from: this.doctorsService.account}).then((res: any[]) => {
        console.log(res);
        
        let result = [];
        for (let i = 0; i < res.length; i++) {
          result.push(toPractitioner(res[i]))
        }
        return result;
      });
    }, 1000);  
  }

  getStringDate(date : number):string{
    return new Date(date*1).toDateString();
  }

  getStringGender(data : any):string{
    switch(data){
      case 0: return "Male"
      case 1: return "Female"
      case 2: return "Unknown"
      default: return "Other"
    }
  }
}
