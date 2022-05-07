import { Injectable } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';
import { IpfsService } from 'src/services/ipfs.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  web3: any;
  contract: any;
  account: any;

  ipfs: any;

  addprogress:boolean = false;
  added:boolean = false
  failed:boolean = false

  constructor(
    private blockchainService: BlockchainService,
  ) {
    this.web3 = blockchainService.getWeb3();

    this.contract = blockchainService.getContract();

    this.getAcccount();
  }

  addPatient(pat_id: any, data: any) {
    this.contract = this.blockchainService.getContract()
      this.contract.methods
        .addPatInfo(pat_id, data.fName, data.lName)
        .send({ from: this.account })
        .on("confirmation",(result: any) => {
          if(result){
            this.addprogress = true
            this.added = true
          }
        })
        .catch((err: any) => {
          this.addprogress = true
          this.added = false
          this.failed = true
        });
  }

  getAcccount() {
    let getacc = setTimeout(() => {
      this.account = this.blockchainService.getAccount();
      if (this.account != null) {
        clearInterval(getacc);
        return this.account;
      }
    }, 1000);
  }
}
