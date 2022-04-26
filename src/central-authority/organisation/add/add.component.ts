import { Component, OnInit } from '@angular/core';
import { timeStamp } from 'console';

import { NgxImageCompressService } from 'ngx-image-compress';
import { PhysicalAddress } from 'src/app/models/physicalAddress.model';
import { Organisation } from 'src/app/models/organisation.model';
import { OrganisationService } from 'src/central-authority/services/organisation.service';

// declare let window: any;
// const { ethereum } = window;

@Component({
  selector: 'organisation-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.sass'],
})
export class AddComponent implements OnInit {
  model: any = {
    publicID:'',
    name: '',
    use:"",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  };

  image_url: any;
  imageCompressedUrl: string = '';

  show: boolean = false;
  msg_text: string = '';
  warn: boolean = false;
  success: boolean = false

  ipfs: any;

  constructor(
    private imageCompress: NgxImageCompressService,
    private organisationService: OrganisationService
  ) {}

  ngOnInit(): void {
    // ethereum.on('message', (message: string) => console.log(message));
  }

  onAddOrgSubmit() {
    this.show = true;
    this.msg_text = 'Adding Organisation to the Network....';
    this.warn = false;

    this.model.imageHash = this.image_url;
    // add doctor
    // await this.doctorService.addDoctor(this.model, this.model.docID);

    let data = this.model;
    let address = new PhysicalAddress("work",this.model.street, this.model.city, this.model.state, this.model.postalCode, this.model.country);
    let org = new Organisation(this.model.publicID,this.model.name, Date.now(), address);
    this.organisationService.contract.methods
        .addOrganisation(org)
        .send({ from: this.organisationService.account })
        .on("confirmation",(result: any) => {
          console.log('result', result);
          if (result) {
            this.msg_text += '<br>Organisation Added to the Blockchain';
            console.log('Organisation added Successfully');
            this.success = true
            this.model = {};
            return result;
          } else {
            this.warn = !this.warn;
            this.msg_text = this.organisationService.msg_text;
            console.log(result);
            return result;
          }
        })
        .catch((err: any) => {
          this.warn = !this.warn;
          this.msg_text =
            'Adding Organisation Failed<br> <small class="fw-light text-danger"><b>"</b>' +
            this.model.publicID +
            '<b>"</b></small><br>1.not a valid address or <br>2.Already have a role';
          console.log(err);
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
        console.log(er);
      });
  }

  onClose() {
    this.show = false;
    this.warn = false;
  }
}
