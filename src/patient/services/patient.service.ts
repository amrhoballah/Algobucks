import { Injectable } from "@angular/core";
import { rejects } from "assert";
import { resolve } from "dns";
import { from, Observable } from "rxjs";
import { toPractitioner } from "src/app/models/mappers/practitioner.mapper";
import { BlockchainService } from "src/services/blockchain.service";
const EthCrypto = require("eth-crypto");

@Injectable({
  providedIn: "root",
})
export class PatientService {
  web3: any;
  contract: any;
  account: any;

  isPatient: boolean = false;
  Patients: any = [];
  checkComplete: boolean = false;

  PatientDetails: any = {};
  patientId: string = "";

  ipfs: any;

  constructor(private blockchainService: BlockchainService) {
    this.web3 = this.blockchainService.getWeb3();
    this.contract = this.blockchainService.getContract();
    this.account = this.blockchainService.getAccount();
  }

  async getAccount() {
    return await this.blockchainService.getAccount();
  }

  async getDoctor(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.blockchainService.contract.methods
        .getDr(await this.blockchainService.getAccount())
        .call()
        .then((result: any) => {
          resolve(toPractitioner(result));
          // await this.ipfs.cat(result).then((data: any) => {
          //   this.DoctorDetails = data;
          //   resolve(this.DoctorDetails);
          //   JSON.parse(this.DoctorDetails);
          //   return this.DoctorDetails;
          // });
        });
    });
  }

  async checkIsPatient(id: string): Promise<any> {
    this.patientId = id;
    return new Promise(async (resolve, reject) => {
      this.contract.methods
        .isPatient(id)
        .call({ from: await this.blockchainService.getAccount() })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async getPatientDetails(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.blockchainService.contract.methods
        .getPatInfo(id)
        .call({ from: await this.blockchainService.getAccount() })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async getPatientRecords(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.blockchainService.getContract().methods
        .viewMedicalRecord()
        .call({ from: await this.blockchainService.getAccount() })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async getOrgName(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.blockchainService.getContract().methods
        .getOrganisation(id)
        .call({ from: await this.blockchainService.getAccount() })
        .then((result: any) => {
          resolve(result[1]);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async getPracName(id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.blockchainService.getContract().methods
        .getDr(id)
        .call({ from: await this.blockchainService.getAccount() })
        .then((result: any) => {          
          resolve(`${result[1][0]} ${result[1][1]}`);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}
