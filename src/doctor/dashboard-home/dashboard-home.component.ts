import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass'],
})
export class DashboardHomeComponent implements OnInit {
  DoctorDetails: any = {};

  constructor(private doctorService: DoctorService) {}

  async ngOnInit(): Promise<void> {
    setTimeout(() => {
      this.getDoctorDetails()
    }, 1000);
  }

  async getDoctorDetails(){
    await this.doctorService.getDoctor().then((data:any) =>{
      this.DoctorDetails = data
    })
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
