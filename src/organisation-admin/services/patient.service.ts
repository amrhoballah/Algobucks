import { Injectable } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';
import { IpfsService } from 'src/services/ipfs.service';

const Contract = require('../../../build/contracts/Contract.json');
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  web3: any;
  abi: any = {};
  netWorkData: any = {};
  netId: any;
  address: any;
  contract: any;
  account: any;

  ipfs: any;

  msg_text: string = '';

  result: any;
  constructor(
    private blockChainService: BlockchainService,
  ) {
    this.web3 = this.blockChainService.getWeb3();

    this.web3.eth.getAccounts((err: any, accs: any) => {
      this.account = accs[0];
    });

    this.web3.eth.net.getId().then((r: number) => {
      this.netId = r;
      this.abi = Contract.abi;
      this.netWorkData = Contract.networks[this.netId];

      console.log(this.netWorkData);

      if (this.netWorkData) {
        this.address = this.netWorkData.address;
        this.contract = this.web3.eth.Contract(this.abi, this.address);
      } else {
        console.log('Contract not Deployed');
      }
    });
  }
}
