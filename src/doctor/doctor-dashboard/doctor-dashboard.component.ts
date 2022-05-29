import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.sass'],
})
export class DoctorDashboardComponent implements OnInit {
  isDoctor: boolean = false;

  isCollapse: boolean = false;

  checkProgress: boolean = true;
  progressWarn: boolean = false;
  progressMsg: string = 'Checking Doctor....';

  constructor(private router: Router, private blockchainService: BlockchainService) {
  }

  ngOnInit(): void {
    this.onCheckDoctor();
    this.router.navigate(['/doctor/dashboard']);
  }

  onCheckDoctor() {
    this.progressMsg = 'Checking Doctor Access...'
    this.progressWarn = false
    let checkDr = setTimeout(async () => {
      let currentAccount = this.blockchainService.account;
      try{      
      if(currentAccount != null && await this.blockchainService.drContract.methods.isPractitioner(currentAccount).call()==1){
        this.isDoctor = true
        this.checkProgress = false
        this.progressWarn = true
        this.progressMsg = '<span class="text-danger">Only Doctors have access to this page.... </span><br> '+
        'Conncet Metamask to your Doctor account'
        clearInterval(checkDr)
      }
      else{        
        clearInterval(checkDr)
        this.router.navigate(['/']);
      }
    }
    catch(err){      
    }
    },1000)
  }
}
