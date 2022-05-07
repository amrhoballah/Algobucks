import { ThisReceiver } from '@angular/compiler';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { toPatient } from 'src/app/models/mappers/patient.mapper';
import { Organisation } from 'src/app/models/organisation.model';
import { OrganisationService } from 'src/central-authority/services/organisation.service';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'patients-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass'],
})
export class ViewAllPatientsComponent implements OnInit {

  Patients: any  = [];

  Organisation:any = {};

  PatientDetails: any = [];

  loaded : boolean = false;
  loadComplete: boolean = false;

  showProgressCard: boolean = false;
  showProgressWarn:boolean = false;
  progressMsg:string = ''
  

  constructor(private patientsService: BlockchainService, private router : Router) {
    this.progressMsg = 'Loading Patients From Blockchain'
  }

  async ngOnInit() {    
    this.Patients = await this.patientsService.contract.methods.getPatientsPerDoc().call({from: this.patientsService.account}).then((res: any[]) => {
      let result = [];
      for (let i = 0; i < res.length; i++) {
        result.push(toPatient(res[i]))
      }
      return result;
    });
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

  viewPatient(id:string){
    this.router.navigate(['/doctor/consult/'+id]);
  }
}
