import { Component, OnInit } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Communication } from 'src/app/models/communication.model';
import { ContactPoint } from 'src/app/models/contactPoint.model';
import { HumanName, Gender } from 'src/app/models/humanName.model';
import { Patient } from 'src/app/models/patient.model';
import { PhysicalAddress } from 'src/app/models/physicalAddress.model';
import { Practitioner } from 'src/app/models/practitioner.model';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.sass'],
})
export class PatientComponent implements OnInit {
  name : HumanName = {
    givenNames: '',
    surname: ''
  };

  address : PhysicalAddress = {
    use: 'home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  }

  communication : Communication = {
    languages: [],
    preferred: ''
  }

  telecom : ContactPoint = {
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
    this.msg_text = 'Adding Practitioner to the Network....';
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
          console.log('result', result);
          if (result) {
            this.msg_text += '<br>Patient Added to the Blockchain';
            console.log('Patient added Successfully');
            this.success = true
            this.model = {};
            return result;
          } else {
            this.warn = !this.warn;
            this.msg_text = this.patientService.msg_text;
            console.log(result);
            return result;
          }
        })
        .catch((err: any) => {
          this.warn = !this.warn;
          this.msg_text =
            'Adding Patient Failed<br> <small class="fw-light text-danger"><b>"</b>' +
            this.model.id +
            '<b>"</b></small><br>1.not a valid address or <br>2.Already have a role';
          console.log(err);
          return err;
        });
      }
      else{
        console.log("Not a valid practitioner");
      }
  }


  onClose() {
    this.show = false
    this.warn = false
  }
}
