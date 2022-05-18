import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReqResService } from '../../service/req-res.service';
declare var $: any;
declare var toastr: any;
@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})

export class ProposalComponent implements OnInit {
  id: number = 0;
  cmp: number = 0;
  code: string = "";
  proposalData: any = [];
  proposalDataSingle: any = {};
  proposalId: number = 0;
  proposalSaveObj: any = {};
  disableButtons: number = 0;
  warningMessage: string = "";
  constructor(private router: Router, private route: ActivatedRoute, private reqRes: ReqResService,) {
    this.route.paramMap.subscribe(paramMap => {
      this.id = Number(paramMap.get('id'));
      this.cmp = Number(paramMap.get('cmpn'));
      this.code = paramMap.get('key');
    });
  }
  ngOnInit(): void {
    this.getClientData(this.id, this.cmp, this.code)
  }

  ngAfterViewChecked() {
    $('.signature-pad').mouseup(() => {
      this.disableSignature = true;
      this.agreeCondition();
    });
    $('.signature-Clear').click(() => {
      this.approveSignature = false;
      this.disableSignature = false;
      $(".signature-Sign").attr('disabled', true);
    });
  }

  clickProposal(id) {
    this.disableButtons = 0;
    this.proposalId = id;
    this.proposalDataSingle = this.proposalData.find(item => item.id == this.proposalId)
    this.showStepView();
    this.proposalDataSingle.paymentOne = parseFloat(this.proposalDataSingle.paymentOne).toFixed(2);
    this.proposalDataSingle.paymentTwo = parseFloat(this.proposalDataSingle.paymentTwo).toFixed(2);
    this.proposalDataSingle.paymentThree = parseFloat(this.proposalDataSingle.paymentThree).toFixed(2);
    this.proposalDataSingle.paymentFour = parseFloat(this.proposalDataSingle.paymentFour).toFixed(2);
    this.proposalDataSingle.retailPrice = parseFloat(this.proposalDataSingle.retailPrice).toFixed(2);
    this.proposalDataSingle.subTotal = parseFloat(this.proposalDataSingle.subTotal).toFixed(2);
    this.proposalDataSingle.taxAmount = parseFloat(this.proposalDataSingle.taxAmount).toFixed(2);
    this.proposalDataSingle.total = parseFloat(this.proposalDataSingle.total).toFixed(2);
  }
  getClientData(id, cmp, code) {
    this.reqRes.getData('/Client/GetProposalData/' + id + "/" + cmp + "/" + code).subscribe(
      result => {
        this.proposalData = result;
        if (this.proposalData.length == 0) {
          this.warningMessage = "Opps Something Went Wrong !!!";
        }
        if (this.proposalData.length != 0) {
          this.clickProposal(this.proposalData[0].id);
        }
      },
      error => {
        console.log(error)
      }
    )
  }
  saveProposal(ope) {
    this.disableButtons = 1;
    this.proposalSaveObj.leadId = this.id;
    this.proposalSaveObj.proposalId = this.proposalId;
    this.proposalSaveObj.cmp = this.cmp;
    this.proposalSaveObj.code = this.code;
    this.proposalSaveObj.signature = "";
    this.proposalSaveObj.status = ope;
    this.reqRes.postData('/Client/ClientProposalSave', this.proposalSaveObj).subscribe(data => {
      this.proposalData = data;
      if (this.proposalData.length == 0) {
        this.warningMessage = "You have no active proposals";
      }
      else {
        this.clickProposal(this.proposalData[0].id);
      }
     
      this.disableButtons = 0;
      if (ope == 3) {
        toastr.success('Approved Successfully !!!', '', { timeOut: 1000 });
        this.proposalDataSingle.approvedOpe = 1;
      }
      else if (ope == 4) {
        toastr.success('Declined Successfully !!!', '', { timeOut: 1000 });
        this.proposalDataSingle.approvedOpe = 0;
        this.proposalDataSingle.status = 4;
      }
    }, error => { console.log(error); this.disableButtons = 0; toastr.error('Opps Something Went Wrong !!!', '', { timeOut: 1000 }); })
  }

  approveSignature: boolean = false;
  disableSignature: boolean = false;

  showSiqnatureModal() {
    this.approveSignature = false;
    this.disableSignature = false;
    $(".signature-pad canvas").attr("width", 466);
    $(".signature-pad canvas").attr("height", 156)
    $(".signature-Sign").attr('disabled', true);
    $('#modalSiqnature').modal('show');
  }

  closeSignatureModal() {
    $('#modalSiqnature').modal('hide');
  }

  showStepView() {
    this.proposalDataSingle.steps.forEach((val, ind) => {
      let i = 0;
      val.details.forEach((v, k) => {
        if (v.visibleOpe == false || v.qty==0) {
          i++;
        }
        if (val.details.length == i) {
          val.show = false;
        }
        else {
          val.show = true;
        }
      });
    })
  }

  agreeCondition() {
    if (this.disableSignature && this.approveSignature) {
      $(".signature-Sign").attr('disabled', false);
    }
    else {
      $(".signature-Sign").attr('disabled', true);
    }
  }

  showSignature(data) {
    this.proposalDataSingle.signatureImage = data
    this.proposalDataSingle.approvedOpe = 1;
    this.proposalDataSingle.status = 3;
    this.proposalDataSingle.approvedDate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substr(0, 8);

    this.proposalSaveObj.signatureImage = data
    this.proposalSaveObj.approvedOpe = 1;
    this.proposalSaveObj.status = 3;
    this.proposalSaveObj.approvedDate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substr(0, 8);

    this.saveProposal(3);
    $('#modalSiqnature').modal('hide');
  }
}
