import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctor.service';

@Component({
  selector: 'app-view-record',
  templateUrl: './view-record.component.html',
  styleUrls: ['./view-record.component.sass'],
})
export class ViewRecordComponent implements OnInit {
  model: any = {};
  PatientRecords: any;
  record: boolean = false;

  PatientRecord: any = [];

  showProgress: boolean = false;
  progressMsg: string = 'Loading....';
  progressWarn: boolean = false;
  progressSuccess: boolean = false;
  viewRecord:boolean =false

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.PatientRecords = {}
  }

  onPatIDSubmit() {
    this.showProgress = true;
    this.doctorService
      .getPatientRecords(this.model.patID)
      .then((result: any) => {
        this.record = true;
        this.progressSuccess = true;
        this.PatientRecords = result['MedRecord'];
        this.progressMsg =
          '<span class="text-danger fw-bold">' +
          this.PatientRecords.length +
          ' </span> Record Found';
      })
      .catch((err: any) => {
        this.progressWarn = true;
        this.progressMsg =
          'Not Found a Record for Patient with <br> <span class="text-danger">' +
          this.model.patID;
      });
  }

  onProgressClose() {
    this.showProgress = false;
    this.progressWarn = false;
    this.progressSuccess = false;
    this.progressMsg = 'Loading...!';
  }

  onViewRecord(record:any){
    this.PatientRecord = record
    this.viewRecord = true
  }

  onRecordClose(){
    this.PatientRecord = {}
    this.viewRecord = false
  }
}
