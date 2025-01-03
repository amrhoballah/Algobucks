import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { exit } from 'process';
import { from, Observable } from 'rxjs';
import { BlockchainService } from 'src/services/blockchain.service';
import Web3 from 'web3';

const Contract = require('../../../build/contracts/Contract.json');

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
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

  Doctors: any;

  DoctorDetails: string[] = [];

  drInfoload:boolean = false;

  constructor(
    private blockChainService: BlockchainService,
  ) {
    //GET BlockChain Service
    this.web3 = this.blockChainService.getWeb3();

    this.web3.eth.getAccounts((err: any, accs: any) => {
      this.account = accs[0];
    });

    this.web3.eth.net.getId().then((r: number) => {
      this.netId = r;
      this.abi = Contract.abi;
      this.netWorkData = Contract.networks[this.netId];


      if (this.netWorkData) {
        this.address = this.netWorkData.address;
        this.contract = this.web3.eth.Contract(this.abi, this.address);
      }
    });

  }

  getDoctorDetails(docID: any): Promise<any> {
    return this.contract.methods
      .getDr(docID)
      .call();
  }
}
