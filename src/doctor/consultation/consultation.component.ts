import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toMedicalRecord } from "src/app/models/mappers/medicalRecord.mapper";
import { toPatient } from "src/app/models/mappers/patient.mapper";
import { MedicalRecord } from "src/app/models/medicalRecord.model";
import { DoctorService } from "../services/doctor.service";

@Component({
  selector: "app-consultation",
  templateUrl: "./consultation.component.html",
  styleUrls: ["./consultation.component.sass"],
})
export class ConsultationComponent implements OnInit {
  model: any = {
    patID: "",
  };

  //TODO
  isPatient: boolean = false;

  PatientDetails: any = {};
  pastReports: any = [];

  showProggressCard: boolean = false;
  showProgressWarning: boolean = false;
  progressMsg: string = "";

  constructor(
    private doctorService: DoctorService,
    private acitvatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.model.patID = this.acitvatedRoute.snapshot.queryParams["patID"];
    if (
      this.model.patID != undefined &&
      this.model.patID != null &&
      this.model.patID != ""
    ) {
      this.onPatIDSubmit();
    }
  }

  onPatIDSubmit() {
    this.showProggressCard = true;
    this.progressMsg = "Checking for Patient ID";
    this.doctorService
      .checkIsPatient(this.model.patID)
      .then((result: any) => {
        if (result == 1) {
          this.progressMsg =
            "Patient ID Found <br> Fetching Patient details From IPFS";
          this.doctorService
            .getPatientDetails(this.model.patID)
            .then((data: any) => {
              this.PatientDetails = toPatient(data);
              this.showProggressCard = false;
              this.isPatient = true;
            })
            .then(() => {
              this.doctorService
                .getPatientRecords(this.model.patID)
                .then((data: any) => {
                  for (const datum of data) {
                    this.pastReports.push(toMedicalRecord(datum));
                  }
                  this.showProggressCard = false;
                  this.isPatient = true;
                })
                .catch((err: any) => {
                  this.showProgressWarning = true;
                  this.progressMsg = "Failed to get Patient Details";
                });
            });
        } else {
          this.showProgressWarning = true;
          this.progressMsg = "Patient does not exist in the network......";
        }
      })
      .catch((err: any) => {
        this.showProgressWarning = true;
        this.progressMsg = "Patient does not exist in the network......";
      });
  }

  async onMedRecordSave(data: any) {
    this.progressMsg = "Saving Medical Record in blockchain....";
    this.showProggressCard = true;
    let medName = [];
    let medDosage = [];
    let medUnit = [];
    let medNoOfDays = [];
    let medRemarks = [];
    for (const med of data.treatment) {
      medName.push(med.medicationName);
      medDosage.push(med.dosage);
      medUnit.push(med.unit);
      medNoOfDays.push(med.noOfDays);
      medRemarks.push(med.remarks);
    }
    let medRec = new MedicalRecord(
      this.model.patID,
      await this.doctorService.getAccount(),
      await this.doctorService.getAccount(),
      Date.now(),
      data.diagnosis,
      medName,
      medDosage,
      medUnit,
      medNoOfDays,
      medRemarks,
      data.clinicalTests
    );
    this.doctorService
      .savePatientMedRecord(medRec)
      .then((result: any) => {
        if (result) {
          this.progressMsg = "Medical record added to the blockchian";
          this.showProggressCard = false;
        }
      })
      .catch((err: any) => {
        this.showProgressWarning = true;
      });
  }

  onRetry() {
    this.model.patID = "";
    this.showProggressCard = false;
    this.progressMsg = "";
    this.showProgressWarning = false;
  }
}
