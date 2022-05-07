import { Component, OnInit } from '@angular/core';

import { FormControl,FormGroup } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Communication } from 'src/app/models/communication.model';
import { ContactPoint } from 'src/app/models/contactPoint.model';
import { Gender, HumanName } from 'src/app/models/humanName.model';
import { PhysicalAddress } from 'src/app/models/physicalAddress.model';
import { Practitioner } from 'src/app/models/practitioner.model';
import { DoctorService } from 'src/organisation-admin/services/doctor.service';
@Component({
  selector: 'doctor-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {

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
    memberOrganisation: ''
  }

  gender : Gender = Gender.UNKNOWN;

  image_url: any;
  imageCompressedUrl: string = '';

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success: boolean = false

  ipfs: any;

  constructor(
    private imageCompress: NgxImageCompressService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
  }

  onAddDocSubmit() {
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
    let org = new Practitioner(this.model.id,this.name,this.telecom,this.address,this.gender,dob.getTime(),this.communication,this.doctorService.account);
    
    this.doctorService.contract.methods
        .addPractitioner(org)
        .send({ from: this.doctorService.account })
        .on("confirmation",(result: any) => {
          if (result) {
            this.msg_text += '<br>Practitioner Added to the Blockchain';
            this.success = true
            this.model = {};
            return result;
          } else {
            this.warn = !this.warn;
            this.msg_text = this.doctorService.msg_text;
            return result;
          }
        })
        .catch((err: any) => {
          this.warn = !this.warn;
          this.msg_text =
            'Adding Practitioner Failed<br> <small class="fw-light text-danger"><b>"</b>' +
            this.model.id +
            '<b>"</b></small><br>1.not a valid address or <br>2.Already have a role';
          return err;
        });
  }

  PreviewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.image_url = event.target.result;
        this.compressImage();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  compressImage() {
    this.imageCompress
      .compressFile(this.image_url, 50, 50)
      .then((compressedImage) => {
        this.imageCompressedUrl = compressedImage;
        this.image_url = this.imageCompressedUrl;
      })
      .catch((er) => {
      });
  }

  onClose() {
    this.show = false;
    this.warn = false;
  }
}
