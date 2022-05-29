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
export class DoctorService {
  web3: any;
  contract: any;
  account: any;

  isDoctor: boolean = false;
  Doctors: any = [];
  checkComplete: boolean = false;

  DoctorDetails: any = {};

  PatientDetails: any = {};
  patientId: string = "";

  ipfs: any;

  constructor(private blockchainService: BlockchainService) {
    this.web3 = this.blockchainService.getWeb3();
    this.contract = this.blockchainService.getDrContract();
    this.account = this.blockchainService.getAccount();
  }

  async getAccount() {
    return await this.blockchainService.getAccount();
  }

  async checkisDr() {
    this.contract = this.blockchainService.getDrContract();

    this.account = this.blockchainService.account;

    await this.contract.methods
      .isPractitioner(this.account)
      .call()
      .then((result: any) => {
        if (result == 1) {
          this.isDoctor = true;
        }
        this.checkComplete = true;
      })
      .catch((err: any) => {});
  }

  async getDoctor(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      console.log(await this.blockchainService.getAccount());
      console.log(await this.blockchainService.getDrContract());
      
      await this.blockchainService.getDrContract().methods
        .getDr(await this.blockchainService.getAccount())
        .call({from: await this.blockchainService.getAccount()})
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
      this.blockchainService.getPatContract().methods
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
      this.blockchainService.getPatContract().methods
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
      console.log("anzel");
      
      this.blockchainService.getPatContract().methods
        .viewMedicalRecord(id)
        .call({ from: await this.blockchainService.getAccount() })
        .then((result: any) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async savePatientMedRecord(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.blockchainService.getPatContract().methods
        .addMedicalRecord(data)
        .send({ from: await this.blockchainService.getAccount() })
        .on("confirmation", (result: any) => {
          resolve(result);
        })
        .on("error", (err: any) => {
          reject(err);
        });
    }).catch((err: any) => {});
  }
}
