import { Injectable } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';

const Contract = require('../../../build/contracts/Contract.json');

@Injectable({
  providedIn: 'root',
})
export class OrganisationService {
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

  Organisations: string[] = [];

  OrganisationDetails: string[] = [];

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

        this.Organisations = this.contract.methods.getAllOrganisation
           .call({from: this.account})
           .then((orgs: string[]) => {
             this.Organisations = orgs;
           });
      }
    });

  }

  async getOrgDetails(orgID: any): Promise<any> {
    return await this.contract.methods
      .getOrganisation(orgID)
      .call()
      .then((data : any) => {
        let found = false;
        for (const org of this.OrganisationDetails) {
          if(org[0] == data[0]){
            found = true;
          }
        }
        if(!found){
          data[2]= new Date(data[2]*1);
          this.OrganisationDetails.push(data)
          return data;
        }
      });
  }
}
