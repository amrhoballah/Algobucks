import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.sass'],
})
export class PatientDashboardComponent implements OnInit {
  isPatient: boolean = false;

  isCollapse: boolean = false;

  checkProgress: boolean = true;
  progressWarn: boolean = false;
  progressMsg: string = 'Checking Doctor....';

  constructor(private router: Router, private blockchainService: BlockchainService) {
  }

  ngOnInit(): void {
    this.onCheckPatient();
    this.router.navigate(['/patient/dashboard']);
  }

  onCheckPatient() {
    this.progressMsg = 'Checking Patient Access...'
    this.progressWarn = false
    setTimeout(async () => {
      let currentAccount = await this.blockchainService.getAccount();
      try{      
      if(currentAccount != null && await this.blockchainService.contract.methods.isPatient(currentAccount).call()==1){
        this.isPatient = true
        this.checkProgress = false
        this.progressWarn = true
        this.progressMsg = '<span class="text-danger">Only Doctors have access to this page.... </span><br> '+
        'Conncet Metamask to your Doctor account'
      }
      else{        
        this.router.navigate(['/']);
      }
    }
    catch(err){      
    }
    },1500)
  }
}
