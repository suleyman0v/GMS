import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  loading = false;
  serviceData: any[];
  sortReverse: boolean;
  sortType: string;
  searchService: string;
  serviceObj: any = {};
  serviceObjTemp: any;

  //del variables
  delId: number;
  delType: string;
  delType2: string;
  delCount: number;
  delBulkArray: any = [];

  public serviceConfig: PaginationInstance = {
    id: 'service',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private reqRes: ReqResService, private pluginservice: PluginService) {
  }
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getServiceData();
  }
  //Item Group Data
  getServiceData() {
    this.loading = true;
    this.reqRes.getData('/Settings/GetSettingsViewData/service').subscribe(data => {
      this.loading = false;
      this.serviceData = data;
      this.pluginservice.setBulkActions('#serviceBulk');
    },
      error => { console.log(error); this.loading = false; })
  }
  //Item Group End Data
  editService(id) {
    this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/service').subscribe(data => {
      this.serviceObj = data;
      //Clone Service Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.serviceObj));
      this.serviceObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      $(`#${'serviceModal'}`).modal('show');
    },
      error => { console.log(error); })
  }
  modalServiceClose() {
    console.log(this.serviceObj)
    let result = this.pluginservice.compareObjects(this.serviceObj, this.serviceObjTemp, ["id", "unitList", "groupList"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#serviceModal').modal('hide');
      }
    }
    else {
      $('#serviceModal').modal('hide');
    }
  }
  saveService() {
    this.serviceObj.price = this.serviceObj.price.toString();
    $('#btnService').attr('disabled', 'disabled');
    this.reqRes.postData('/Settings/ServiceOperation', this.serviceObj).subscribe(data => {
      $('#btnService').removeAttr('disabled');
      let returnedObj = data;
      if (this.serviceObj.id == 0) {
        this.serviceData.push(data)
      }
      else {
        let index = this.serviceData.findIndex(item => item.id == returnedObj.id);
        this.serviceData[index].name = returnedObj.name;
        this.serviceData[index].group = returnedObj.group;
        this.serviceData[index].unit = returnedObj.unit;
        this.serviceData[index].price = returnedObj.price;
        this.serviceData[index].desc = returnedObj.desc;
      }
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $(`#${'serviceModal'}`).modal('hide');
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
      if (param == 'service' && status == -1) {
        let index = this.serviceData.findIndex(item => item.id == id);
        this.serviceData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'service') {
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
      if (type == "serviceStatus") {
        this.getServiceData();
      }
    }, error => { console.log(error) })
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
  disableCalc() {
    if (this.serviceObj.priceOnRequest) {
      this.serviceObj.calculation = false;
    }
  }
}

