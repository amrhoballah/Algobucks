import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.sass'],
})
export class OrganisationDashboardComponent implements OnInit {

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
    this.onCheckCentralAuthority()

    //TODO
    this.router.navigate(['organisation/admin-dashboard']);

    
    
  }

  async onCheckCentralAuthority(){
    this.progressMsg = 'Checking Admin Access...'
    this.progressWarn = false
    let checkAdmin = setInterval(async () => {
      let currentAccount = this.blockchainService.account;
      console.log("ANA HENA FASHKH ")
      console.log(await this.blockchainService.contract.methods.isOrganisation().call({from: currentAccount}));
      if(currentAccount != null && await this.blockchainService.contract.methods.isOrganisation().call({ from: currentAccount })){
        this.isAdmin = true
        this.checkProgress = false
        this.progressWarn = true
        this.progressMsg = '<span class="text-danger">Only Organisation Admins have Access to this Page.... </span><br> '+
        'Conncet Metamask to your Admin account'
        clearInterval(checkAdmin)
      }
    },1000)
  }
}
