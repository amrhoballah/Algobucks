import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass']
})
export class DashboardHomeComponent implements OnInit {

  Titles: any = ['Hospitals & Clinics','Medical Practitioners',' Patients']
  Images: any = ['hospital','user-md','user-injured']
  Count: number[] = [];
  Background: any = ['green','orange','blue','violet']

  accountBalance: any;

  constructor(private blockchainService: BlockchainService) { }

  ngOnInit(): void {
    this.accountBalance = this.blockchainService.getBalance()
    console.log(this.accountBalance);

    let getBalance = setInterval(() => {
      this.accountBalance = this.blockchainService.getBalance()
      if(this.accountBalance != null){
        this.accountBalance /= 1000000000000000000
        console.log("Balance",this.accountBalance);
        clearInterval(getBalance);
      }
    },1000)

    let getCounts = setInterval(async() => {
      this.Count = await this.blockchainService.getCounts()
      if(this.Count != []){    
        console.log("Count",this.Count);
        clearInterval(getCounts);
      }
    },1000)
  }


  
  

}