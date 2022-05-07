import { Component, OnInit } from '@angular/core';
import { toMedicalRecord } from 'src/app/models/mappers/medicalRecord.mapper';
import { toPatient } from 'src/app/models/mappers/patient.mapper';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass'],
})
export class DashboardHomeComponent implements OnInit {
  PatientDetails: any = {};
  pastReports: any = [];
  practitionersKey : any = [];
  practitionersValue : any = [];
  organisationsKey : any = [];
  organisationsValue : any = [];

  constructor(private patientService: PatientService) {}

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.getPatientDetails()
    }, 2000);
  }

  async getPatientDetails(){
    await this.patientService.getPatientDetails(await this.patientService.getAccount()).then((data:any) =>{
      this.PatientDetails = toPatient(data);
      this.practitionersKey.push(this.PatientDetails.generalPractitioner);
      this.organisationsKey.push(this.PatientDetails.managingOrganisation);

    })
    await this.patientService.getPatientRecords(await this.patientService.getAccount()).then((data:any) =>{
      for(let datum of data){
        this.pastReports.push(toMedicalRecord(datum));
        if(this.practitionersKey.indexOf(datum[1]) == -1){
          this.practitionersKey.push(datum[1]);
        }
        if(this.organisationsKey.indexOf(datum[2]) == -1){
          this.organisationsKey.push(datum[2]);
        }
      }
    })
    for (let prac of this.practitionersKey) {      
      this.practitionersValue.push(await this.patientService.getPracName(prac));
    }
    for (let org of this.organisationsKey) {
      this.organisationsValue.push(await this.patientService.getOrgName(org));
    }
  }

  getOrgName(id:string){
    return this.organisationsValue[this.organisationsKey.indexOf(id)];
  }
  getPracName(id: string){
    return this.practitionersValue[this.practitionersKey.indexOf(id)];
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
