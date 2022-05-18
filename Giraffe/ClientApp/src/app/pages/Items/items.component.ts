import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  loading = false;
  itemData: any[];
  sortReverse: boolean;
  sortType: string;
  searchItem: string;
  itemObj: any = {};
  itemObjTemp: any;

  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delBulkArray: any = [];
  delType2: string;

  public itemConfig: PaginationInstance = {
    id: 'item',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private reqRes: ReqResService, private pluginservice: PluginService) {
  }

  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getItemData();
  }
  //Item Group Data
  getItemData() {
    this.loading = true;
    this.reqRes.getData('/Settings/GetSettingsViewData/item').subscribe(data => {
      this.loading = false;
      this.itemData = data;
      this.pluginservice.setBulkActions('#itemBulk');
    },
      error => { console.log(error); this.loading = false; })
  }
  //Item Group End Data
  editItem(id) {
    this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/item').subscribe(data => {
      this.itemObj = data;
      //Clone Item Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.itemObj));
      this.itemObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      $(`#${'itemModal'}`).modal('show');
    },
      error => { console.log(error); })
  }
  modalItemClose() {
    let result = this.pluginservice.compareObjects(this.itemObj, this.itemObjTemp, ["id", "unitList", "groupList"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#itemModal').modal('hide');
      }
    }
    else {
      $('#itemModal').modal('hide');
    }
  }
  saveItem() {
    this.itemObj.price = this.itemObj.price.toString();
    $('#btnItem').attr('disabled', 'disabled');
    this.reqRes.postData('/Settings/ItemOperation', this.itemObj).subscribe(data => {
      $('#btnItem').removeAttr('disabled');
      let returnedObj = data;
      if (this.itemObj.id == 0) {
        this.itemData.push(data)
      }
      else {
        let index = this.itemData.findIndex(item => item.id == returnedObj.id);
        this.itemData[index].name = returnedObj.name;
        this.itemData[index].group = returnedObj.group;
        this.itemData[index].unit = returnedObj.unit;
        this.itemData[index].price = returnedObj.price;
        this.itemData[index].desc = returnedObj.desc;
      }
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $(`#${'itemModal'}`).modal('hide');
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
      if (param == 'item' && status == -1) {
        let index = this.itemData.findIndex(item => item.id == id);
        this.itemData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'item') {
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
      if (type == "itemStatus") {
        this.getItemData();
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
    if (this.itemObj.priceOnRequest) {
      this.itemObj.calculation = false;
    }
  }
}
