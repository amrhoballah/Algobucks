import { Injectable } from '@angular/core';
import Web3 from 'web3';

const Contract = require('../../build/contracts/Contract.json');

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  account: any = [];
  netId: any;
  web3: any;
  address: any;
  contract: any;
  netWorkData: any;
  abi: any;
  balance: any;
  blockNumber: any;
  LOG: any;
  Report: any = [];

  constructor() {
    this.getWeb3Provider().then(async () => {
      await this.web3.eth.getAccounts(async (err: any, accs: any) => {
        this.account = accs[0];
        await this.web3.eth.getBalance(this.account).then((r: any) => {
          this.balance = r;
        });
        this.web3.eth.getBlockNumber().then((block: any) => {
          this.blockNumber = block;
        });
      });

      this.web3.eth.net.getId().then(async (r: number) => {

        this.netId = r;
        this.abi = Contract.abi;
        this.netWorkData = await Contract.networks[this.netId];

        if (this.netWorkData) {
          this.address = this.netWorkData.address;
          this.contract = await this.web3.eth.Contract(this.abi, this.address);
        }
      });
      window.ethereum.on('accountsChanged', (acc:any) => {
        window.location.reload();
      });
    });

  }

  //generate Report of Transactions
  generateReport(block: number) {
    for (var i = 1; i <= block; i++) {
      this.web3.eth.getBlock(i).then((Block: any) => {
        this.Report.push(Block);
      });
    }
  }

  //gets

  async getWeb3Provider() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();

      this.web3 = window.web3;
      this.account = this.web3.eth.getAccounts()[0];
      return window.web3;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return window.web3;
    } else {
      return window.web3;
    }
  }

  getWeb3(): Web3 {
    return this.web3;
  }

  getBalance(): any {
    return this.balance;
  }

  getTransactionBlockNumber() {
    return this.blockNumber;
  }

  getAccount() {
    return this.account;
  }

  getContract() {
    return this.contract;
  }

  async getCountsForCA(){
    let c1 = await this.contract.methods.getAllOrganisation().call({from:this.account})
    return [c1.length,
      await this.contract.methods.getPractitionerCount().call({from:this.account}),
      await this.contract.methods.getPatientCount().call({from:this.account})];
  }

  async getCountsForOrg(){
    let c1 = await this.contract.methods.getPractitionersPerOrg().call({from:this.account})
    let c2 = await this.contract.methods.getPatientsPerOrg().call({from:this.account})
    return [c1.length,c2.length];
  }
}
