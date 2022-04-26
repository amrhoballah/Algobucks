import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-central-authority-dashboard',
  templateUrl: './central-authority-dashboard.component.html',
  styleUrls: ['./central-authority-dashboard.component.sass'],
})
export class CentralAuthorityDashboardComponent implements OnInit {

  isCollapse: boolean = true;

  isAdmin:boolean = false;

  checkProgress: boolean = true;
  progressWarn:boolean = false
  progressMsg:string = 'Checking Admin....';

  constructor(
    private router: Router,
    private blockchainService: BlockchainService
  ) {}

  ngOnInit(): void {
    console.log("siu");
    
    this.onCheckCentralAuthority()

    //TODO
    this.router.navigate(['central-authority/central-dashboard']);

  }

  async onCheckCentralAuthority(){
    this.progressMsg = 'Checking Admin Acess...'
    this.progressWarn = false
    let checkAdmin = setInterval(async () => {
      let currentAccount = this.blockchainService.account;
  
      if(currentAccount != null && await this.blockchainService.contract.methods.isCentralAuthority().call({ from: currentAccount })){
        this.isAdmin = true
        this.checkProgress = false
        this.progressWarn = true
        this.progressMsg = '<span class="text-danger">Only admin have Acess to this Page.... </span><br> '+
        'Conncet Metamask to your Admin account'
        clearInterval(checkAdmin)
      }
    },1000)
  }
}
