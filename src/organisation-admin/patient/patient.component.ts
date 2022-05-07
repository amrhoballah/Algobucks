import { Component, OnInit } from '@angular/core';
import { Communication } from 'src/app/models/communication.model';
import { ContactPoint } from 'src/app/models/contactPoint.model';
import { HumanName, Gender } from 'src/app/models/humanName.model';
import { Patient } from 'src/app/models/patient.model';
import { PhysicalAddress } from 'src/app/models/physicalAddress.model';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.sass'],
})
export class PatientComponent implements OnInit {
  name : any = {
    givenNames: '',
    surname: ''
  };

  address : any = {
    use: 'home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  }

  communication : any = {
    languages: [],
    preferred: ''
  }

  telecom : any = {
    phoneNumber: '',
    email: ''
  }

  model : any = {
    id: '',
    gender: '',
    birthDate: 0,
    generalPractitioner : '',
    memberOrganisation: '',
    deceasedBoolean : false,
    deceasedDateTime : 0,
    multipleBirthBoolean : false,
    multipleBirthInteger : 0,
    exists : false
  }

  gender : Gender = Gender.UNKNOWN;
  image_url: any;

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success:boolean = false

  ipfs: any;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {}

  async onAddPatSubmit() {
    this.show = true;
    this.msg_text = 'Adding Patient to the Network....';
    this.warn = false;
    switch(this.model.gender.toLowerCase()){
      case "male" : this.gender = Gender.MALE; break;
      case "female" : this.gender = Gender.FEMALE; break;
      case "unknown" : this.gender = Gender.UNKNOWN; break;
      default : this.gender = Gender.OTHER;
    }
    let myDate = this.model.birthDate.split("-");
    let dob = new Date( myDate[0], myDate[1] - 1, myDate[2]);

    let pat = new Patient(this.model.id,this.name,this.telecom,this.address,dob.getTime(),this.model.generalPractitioner,this.patientService.account,this.communication,this.gender,false,0,this.model.multipleBirthBoolean,this.model.multipleBirthInteger);
    let res = await this.patientService.contract.methods.isPractitioner(this.model.generalPractitioner).call()
    if(res == 1){
    this.patientService.contract.methods
        .addPatient(pat)
        .send({ from: this.patientService.account })
        .on("confirmation",(result: any) => {
          if (result) {
            this.msg_text += '<br>Patient Added to the Blockchain';
            this.success = true
            this.model = {};
            this.telecom = {};
            this.address = {};
            this.communication = {};
            this.name = {};
            return result;
          } else {
            this.warn = !this.warn;
            this.msg_text = this.patientService.msg_text;
            return result;
          }
        })
        .catch((err: any) => {
          this.warn = !this.warn;
          this.msg_text =
            'Adding Patient Failed<br> <small class="fw-light text-danger"><b>"</b>' +
            this.model.id +
            '<b>"</b></small><br>1.not a valid address or <br>2.Already have a role';
          return err;
        });
      }
      else{
        this.msg_text =
        'Not a valid practitioner<br> <small class="fw-light text-danger"><b>"</b>'
      }
  }


  onClose() {
    this.show = false
    this.warn = false
  }
}
