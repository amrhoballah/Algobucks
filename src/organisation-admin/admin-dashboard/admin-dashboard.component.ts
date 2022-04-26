import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.sass'],
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
    this.onCheckCentralAuthority()

    //TODO
    this.router.navigate(['admin/admin-dashboard']);

    
    
  }

  onCheckCentralAuthority(){
    this.progressMsg = 'Checking Admin Acess...'
    this.progressWarn = false
    let checkAdmin = setInterval(() => {
      let admin = this.blockchainService.admin
      let currentAccount = this.blockchainService.account
  
      console.log("Admin"+admin)
      console.log("current Account"+currentAccount);
    
  
      if(currentAccount != null){
        if (this.blockchainService.contract.methods.isCentralAuthority().call()) {
          this.isAdmin = true
          console.log(this.blockchainService.LOG);
        }
        this.checkProgress = false
        this.progressWarn = true
        this.progressMsg = '<span class="text-danger">Only admin have Acess to this Page.... </span><br> '+
        'Conncet Metamask to your Admin account'
        clearInterval(checkAdmin)
      }
    },1000)
  }
}
