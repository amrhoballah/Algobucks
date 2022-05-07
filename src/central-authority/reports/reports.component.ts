import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.sass'],
})
export class ReportsComponent implements OnInit {
  Transactions: any;
  noOfBlocks: any;

  reportLoaded: boolean = false;
  reportProgress: boolean = false
  reportToastShow:boolean = false
  reportProgressMsg:string = ''

  constructor(private blockchainService: BlockchainService) {}

  ngOnInit(): void {
    this.Transactions = 0;
    this.noOfBlocks = 0;

    let getBlockNumber = setTimeout(() => {
      this.Transactions = this.blockchainService.blockNumber;
      if (this.Transactions != null) {
        clearInterval(getBlockNumber);
      }
    }, 1000);
  }

  genrateReport() {
    this.reportProgress = true
    if (this.noOfBlocks > this.Transactions) {
      this.noOfBlocks = this.Transactions;
    }

    this.blockchainService.generateReport(this.noOfBlocks);
    this.checkReportComplete();
  }

  checkReportComplete() {

    let reportProgrress = setTimeout(() => {
      if (this.blockchainService.Report.length == this.noOfBlocks) {
        this.reportLoaded = true;
        this.reportToastShow = true
        this.reportProgress = false
        clearInterval(reportProgrress);
      }
    }, 1000);
  }
}
