import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { MedicalRecord } from 'src/app/models/medicalRecord.model';
import { Medication } from 'src/app/models/medication.model';


type MedicationType = [
  {
    name: '';
    dose: '';
    frequency: '';
    nofDays: '';
    remarks: '';
  }
];

type PatientMedicalrecordType = {
  Diagnosis: '';
  Medication: MedicationType;
  ClinicalTest: [];
};

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.sass'],
})
export class PatientRecordComponent implements OnInit {
  @Input() PatientDetails: any = {};
  @Input() pastReports : any = [];
  @Output() saveRecord = new EventEmitter<any>();

  model: any;
  addReport: boolean = false;

  Medication: Medication[] = [];
  ClinicalTest: any[] = [];

  med: any = {};
  clinic: any = "";

  LabFiles: any[] = []

  constructor() {
    this.model = {};
  }

  ngOnInit(): void {
  }

  onMedicinesSave() {
    this.Medication.push(this.med);
    this.med = {};
  }

  onTestSave() {
    this.ClinicalTest.push(this.clinic);
    this.clinic = "";
  }

  onPatientRecordSubmit() {
    this.model.treatment = this.Medication;
    this.model.clinicalTests = this.ClinicalTest;

    this.saveRecord.emit(this.model)
    this.model = {};
    this.Medication = [];
    this.ClinicalTest = [];
    
  }

  onFileAdd(files:any){
    for (let i = 0; i< files.target.files.length; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.LabFiles[i]= event.target.result;
      };
      reader.readAsDataURL(files.target.files[i]);
    }
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

  onAddReport(){
    this.addReport = !this.addReport;
  }
  panelOpenState: boolean = false;
}
