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
  progressMsg:string = 'Checking Central Authority....';

  constructor(
    private router: Router,
    private blockchainService: BlockchainService
  ) {}

  async ngOnInit(): Promise<void> {    
    this.onCheckCentralAuthority()
    this.router.navigate(['central-authority/central-dashboard']);
  }

  onCheckCentralAuthority(){
    this.progressMsg = 'Checking Central Authority Access...'
    this.progressWarn = false
    let checkAdmin = setInterval(async () => {
      let currentAccount = this.blockchainService.account;
      let isCentral = await this.blockchainService.contract.methods.isCentralAuthority().call({ from: currentAccount });
      
      if(currentAccount != null && isCentral){
        this.isAdmin = true
        this.checkProgress = false
        this.progressWarn = true
        this.progressMsg = '<span class="text-danger">Only Central Authority has Access to this Page.... </span><br> '+
        'Connect Metamask to your Central Authority account'
        clearInterval(checkAdmin)
      }
      else{
        clearInterval(checkAdmin)
        this.router.navigate(['/']);
      }
    },1000)
  }

}
