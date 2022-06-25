import { Injectable } from '@angular/core';
import Web3 from 'web3';

const Contract = require('../../build/contracts/Contract.json');
const PatientContract = require('../../build/contracts/PatientContract.json');
const PractitionerContract = require('../../build/contracts/PractitionerContract.json');
const OrganisationContract = require('../../build/contracts/OrganisationContract.json');


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
  orgContract: any;
  patContract: any;
  drContract: any;
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
        console.log(this.account);
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

        this.abi = PatientContract.abi;
        this.netWorkData = await PatientContract.networks[this.netId];

        if (this.netWorkData) {
          this.address = this.netWorkData.address;
          this.patContract = await this.web3.eth.Contract(this.abi, this.address);
        }

        this.abi = PractitionerContract.abi;
        this.netWorkData = await PractitionerContract.networks[this.netId];

        if (this.netWorkData) {
          this.address = this.netWorkData.address;
          this.drContract = await this.web3.eth.Contract(this.abi, this.address);
        }

        this.abi = OrganisationContract.abi;
        this.netWorkData = await OrganisationContract.networks[this.netId];

        if (this.netWorkData) {
          this.address = this.netWorkData.address;
          this.orgContract = await this.web3.eth.Contract(this.abi, this.address);
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

  getPatContract() {
    return this.patContract;
  }

  getDrContract() {
    return this.drContract;
  }

  getOrgContract() {  
    return this.orgContract;
  }

  async getCountsForCA(){
    let c1 = await this.orgContract.methods.getAllOrganisation().call({from:this.account})
    return [c1.length,
      await this.drContract.methods.getPractitionerCount().call({from:this.account}),
      await this.patContract.methods.getPatientCount().call({from:this.account})];
  }

  async getCountsForOrg(){
    let c1 = await this.drContract.methods.getPractitionersPerOrg().call({from:this.account})
    let c2 = await this.patContract.methods.getPatientsPerOrg().call({from:this.account})
    let drCount = 0;
    let patCount = 0;
    for(let item of c1){
      if(item[0] == "0x0000000000000000000000000000000000000000")
        continue;
      drCount++;
    }

    for(let item of c2){
      if(item[0] == "0x0000000000000000000000000000000000000000")
        continue;
      patCount++;
    }
    return [drCount,patCount];
  }
}
