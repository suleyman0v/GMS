import { Component, OnInit, HostListener } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';
declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-proposaltemplate',
  templateUrl: './proposaltemplate.component.html',
  styleUrls: ['./proposaltemplate.component.css']
})
export class ProposaltemplateComponent implements OnInit {
  @HostListener('scroll', ['$event'])

  loading = false;
  proposalTemplateData: any[];

  itemServiceGroupList: any[];
  itemServiceTypeId: number;
  itemServiceGroupId: number;
  itemService: any[] = [];
  countItemService: number;
  searchItemService: string;
  selectAll: boolean;
  index: number;

  sortReverse: boolean;
  sortType: string;
  searchProposalTemplate: string;
  proposalTemplateObj: any = {};
  proposalTemplateObjTemp: any;

  //del variables
  delId: number;
  delType: string;
  delType2: string;
  delCount: number;
  delBulkArray: any = [];
  minHeightOpe: number = 0;

  stepOptions: any;
  stepDetailOptions: any;

  public proposalTemplateConfig: PaginationInstance = {
    id: 'proposalTemplate',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private reqRes: ReqResService, private pluginservice: PluginService) {
  }

  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getProposalTemplateData();

    this.stepOptions = {
      onUpdate: (event: any) => {
        this.proposalTemplateObj.steps.forEach(function (val, key) {
          val.orderby = key + 1;
        });
      }
    };
    this.stepDetailOptions = {
      onUpdate: (event: any) => {
        this.proposalTemplateObj.steps.forEach(function (val, key) {
          val.stepdetails.forEach(function (val2, key2) {
            val2.orderby = key2 + 1;
          });
        });
      }
    };

  }
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
  }
  modalOperation(modalOpen, modalClose) {
    $(`#${modalClose}`).modal('hide');
    $(`#${modalOpen}`).modal('show');
  }
  //Item Group Data
  getProposalTemplateData() {
    this.loading = true;
    this.reqRes.getData('/Settings/GetSettingsViewData/proposalTemplate').subscribe(data => {
      this.loading = false;
      this.proposalTemplateData = data;
      this.pluginservice.setBulkActions('#proposalTemplateBulk');
    },
      error => { console.log(error); this.loading = false; })
  }
  //Item Group End Data
  editProposalTemplate(id) {
    this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/proposalTemplate').subscribe(data => {
      this.proposalTemplateObj = data;
      //Clone Proposal Template Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.proposalTemplateObj));
      this.proposalTemplateObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      $(`#${'proposalTemplateModal'}`).modal('show');
    },
      error => { console.log(error); })
    this.minHeightOpe = (id == 0) ? 0 : 1;
  }
  modalProposalTemplateClose() {
    let result = this.pluginservice.compareObjects(this.proposalTemplateObj, this.proposalTemplateObjTemp, ["id"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#proposalTemplateModal').modal('hide');
      }
    }
    else {
      $('#proposalTemplateModal').modal('hide');
    }
  }
  saveProposalTemplate() {
    this.proposalTemplateObj.groupPricing = (this.proposalTemplateObj.groupPricing) ? 1 : 0;
    $('#btnProposalTemplate').attr('disabled', 'disabled');
    this.reqRes.postData('/Settings/ProposalTemplateOperation', this.proposalTemplateObj).subscribe(data => {
      $('#btnProposalTemplate').removeAttr('disabled');
      let returnedObj = data;
      if (this.proposalTemplateObj.id == 0) {
        this.proposalTemplateData.push(data)
      }
      else {
        let index = this.proposalTemplateData.findIndex(item => item.id == returnedObj.id);
        this.proposalTemplateData[index].title = returnedObj.title;
      }
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $(`#${'proposalTemplateModal'}`).modal('hide');
    },
      error => { console.log(error); })
  }
  changeStatus(param, id, status, param2): void {
    if (param2 == 'changeStatus') {
      status = status ? 1 : 0;
    }
    let statusObj: any = {};
    statusObj.param = param;
    statusObj.id = id;
    statusObj.status = status;
    this.reqRes.postData('/Global/ChangeStatus', statusObj).subscribe(data => {
      if (param == 'proposalTemplate' && status == -1) {
        let index = this.proposalTemplateData.findIndex(item => item.id == id);
        this.proposalTemplateData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'proposalTemplate') {
        toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      }
    }, error => { console.log(error) })
  }
  bulkActions(bulkid, bulkpar, type): void {
    let ids: any = this.pluginservice.getBulkActions('#' + bulkid, bulkpar);
    var str = ids.toString();
    let bulkObj: any = {};
    bulkObj.ids = str;
    bulkObj.type = type;
    this.reqRes.postData('/Global/SetBulkActions', bulkObj).subscribe(data => {
      toastr.success(data.result, '', { timeOut: 1000 });
      if (type == "proposalTemplateStatus") {
        this.getProposalTemplateData();
      }
    }, error => { console.log(error) })
  }

  addStep() {
    this.minHeightOpe = 1;
    this.proposalTemplateObj.steps.push({
      id: 0, name: 'Step ' + (this.proposalTemplateObj.steps.length + 1), stepName: 'Step ' + (this.proposalTemplateObj.steps.length + 1), orderby: 0, status: 1, stepdetails: [], factors: '[]'
    })
  }

  removeStep(index) {
    let deleteCount = 0;
    $('#collapse' + index).hide();
    this.proposalTemplateObj.steps[index].status = -1;
    $(".tooltip").tooltip("hide");
    this.proposalTemplateObj.steps.forEach((val, key) => {
      if (this.proposalTemplateObj.steps[key].status == -1) {
        deleteCount++
      }
    });
    this.minHeightOpe = (deleteCount == this.proposalTemplateObj.steps.length) ? 0 : 1;
  }

  renameStepName(index) {
    $('#spanStepName' + index).show();
    $('#idStepName' + index).hide();
    $(".tooltip").tooltip("hide");
  }

  changeStepName(index) {
    this.proposalTemplateObj.steps[index].name = this.proposalTemplateObj.steps[index].stepName;
    $('#spanStepName' + index).hide();
    $('#idStepName' + index).show();
    $(".tooltip").tooltip("hide");
  }

  cancelStepName(index) {
    this.proposalTemplateObj.steps[index].stepName = this.proposalTemplateObj.steps[index].name;
    $('#spanStepName' + index).hide();
    $('#idStepName' + index).show();
    $(".tooltip").tooltip("hide");
  }
  getStepDetailCount(stepDetailArray): number {
    let stepdetails = stepDetailArray.filter(function (obj) {
      return obj.status !== -1;
    });
    return stepdetails.length;
  }
  getItemServiceGroup(type) {
    this.reqRes.getData('/Settings/GetItemServiceGroup/' + type).subscribe(data => {
      this.itemServiceGroupList = data;
      this.itemServiceGroupId = 0;
    },
      error => { console.log(error); })
  }
  addItemService(i) {
    this.index = i;
    this.countItemService = 0;
    this.searchItemService = '';
    this.itemServiceTypeId = 0;
    this.itemServiceGroupId = 0;
    this.itemService = [];
    this.selectAll = false;
    this.modalOperation('itemServicesModal', 'proposalTemplateModal');
  }
  getItemService(timeOpe) {
    if (timeOpe == 1) {
      this.countItemService = 0;
    }
    this.reqRes.getData('/Settings/GetItemService/10/' + this.countItemService + '/' + this.itemServiceTypeId + '/' + this.itemServiceGroupId + '/' + this.searchItemService).subscribe(data => {
      this.itemService = (timeOpe == 1) ? this.itemService = data : this.itemService.concat(data);
    },
      error => { console.log(error); })
  }
  onScrollItemService(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
      this.countItemService = this.countItemService + 10;
      this.getItemService(2);
    }
  }
  onSearchItemService() {
    this.countItemService = 0;
    this.getItemService(1);
  }
  selectAllItemService() {
    let selectAll = !this.selectAll;
    this.itemService.forEach(function (val, key) {
      val.ope = selectAll;
    });
  }
  checkStepDetail(): boolean {
    let checkeditemservices = this.itemService.filter(function (obj) {
      return obj.ope === true;
    });
    return checkeditemservices.length === 0 ? true : false;
  }
  addStepDetail() {
    let checkeditemservices = this.itemService.filter(function (obj) {
      return obj.ope === true;
    });
    let component = this;
    checkeditemservices.forEach(function (val, key) {
      component.proposalTemplateObj.steps[component.index].stepdetails.push({ id: 0, type: component.itemServiceTypeId, itemservice: val.id, name: val.name, qtyope: false, visibleope: false, status: 1, orderby: 0 })
    });
    this.modalOperation('proposalTemplateModal', 'itemServicesModal');
  }
  collapceIconChange(index) {
    setTimeout(() => {
      if ($(`#plus${index}`).text() == '+') {
        $(`#plus${index}`).text('-')
      } else {
        $(`#plus${index}`).text('+')
      }
    }, 250)
  }
  unCheckQtyOpe(index, index2, visibleope) {
    if (!visibleope == false) {
      this.proposalTemplateObj.steps[index].stepdetails[index2].qtyope = false;
    }
  }

  checkboxSelectService(serviceId, serviceOpe) {
    this.itemService.forEach((val, key) => {
      if (serviceId == val.id) {
        if (val.ope == 0) {
          val.ope = true;
        }
        else {
          val.ope = false;
        }
      }
    });
  }
  removeStepDetail(index, index2) {
    this.proposalTemplateObj.steps[index].stepdetails[index2].status = -1;
  }
  modalDelete(delId, delType, delType2, bulkArray) {
    this.delId = delId;
    this.delType = delType;
    this.delType2 = delType2;
    this.delBulkArray = bulkArray;
    if (bulkArray.length == 0) {
      this.delCount = 1;
    } else {
      let ids: any = this.pluginservice.getBulkActions('#' + bulkArray[0], bulkArray[1]);
      var str = ids.toString();
      this.delCount = str.split(",").length;
    }
    $('#modalDelete').modal('show');
  }
  deleteItem(id, type, type2, array) {
    $('#modalDelete').modal('hide');
    if (array.length == 0) {
      this.changeStatus(type, id, -1, type2);
    } else {
      this.bulkActions(array[0], array[1], array[2])
    }
  }

  //Factor
  factorObj: any = [];
  stepIndex: number = 0;
  disableFactorButton: boolean = false;
  disableButtonControl() {
    let i = 0;
    this.factorObj.forEach((val, key) => {
      if (val.label == '') {
        i++;
      }
    })
    if (i == 0) {
      this.disableFactorButton = false;
    }
    else {
      this.disableFactorButton = true;
    }
  }
  addFactor(index): void {
    this.stepIndex = index;
    if (this.proposalTemplateObj.steps[index].factors == "[]") {
      this.factorObj = JSON.parse('[{"label": "", "value": 1}]');
    }
    else {
      this.factorObj = JSON.parse(this.proposalTemplateObj.steps[index].factors);
    }
    this.disableButtonControl();
    $('#proposalTemplateModal').modal('hide');
    $('#modaFactor').modal('show');
  }
  closeFactor(): void {
    if (this.proposalTemplateObj.steps[this.stepIndex].factors == "[]") {
      this.factorObj = JSON.parse('[]');
    }
    else {
      this.factorObj = JSON.parse(this.proposalTemplateObj.steps[this.stepIndex].factors);
    }
    $('#proposalTemplateModal').modal('show');
    $('#modaFactor').modal('hide');
  }
  addFactorDetail(): void {
    this.factorObj.push({ label: '', value: 1 });
    this.disableFactorButton = true;
  }
  removeFactorDetail(i): void {
    this.factorObj.splice(i, 1);
    this.disableButtonControl();
  }
  saveFactor(): void {
    this.proposalTemplateObj.steps[this.stepIndex].factors = JSON.stringify(this.factorObj);
    this.closeFactor();
  }
  factorValueChange(val, i): void {
    if (val < 1 && val.length != 0) {
      this.factorObj[i].value = 1;
    }
  }
  changeLabel() {
    this.disableButtonControl();
  }
}
