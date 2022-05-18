import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { ReqResService } from '../../service/req-res.service';
import { PluginService } from '../../service/plugin.service';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  loading = false;
  roleData: any = [];
  sortReverse: boolean;
  sortType: string;
  searchRole: string;
  roleObj: any = {};
  roleObjTemp: any;
  disableButton: number = 0;
  modalType: number = 0;
  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delBulkArray: any = [];
  delType2: string;
  public roleConfig: PaginationInstance = {
    id: 'users',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private reqRes: ReqResService, private pluginservice: PluginService) { }
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getRoleData(3);
  }
  getRoleData(type) {
    this.loading = true;
    this.reqRes.getData('/Settings/GetSettingsViewData/role').subscribe(data => {
      this.loading = false;
      this.roleData = data;
      this.pluginservice.setBulkActions('#roleBulk');
    },
      error => { console.log(error); this.loading = false; })
  }
  editRole(id) {
    this.modalType = id;
    this.roleObj.id = id
    this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/role').subscribe(data => {
      this.roleObj = data;
      //Clone Role Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.roleObj));
      this.roleObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      $("#roleModal").modal('show');
    },
      error => { console.log(error); })
  }
  modalRoleClose() {
    let result = this.pluginservice.compareObjects(this.roleObj, this.roleObjTemp, ["id"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#roleModal').modal('hide');
      }
    }
    else {
      $('#roleModal').modal('hide');
    }
  }
  saveRole() {
    this.disableButton = 1;
    this.reqRes.postData('/Settings/SaveRole', this.roleObj).subscribe(data => {
      this.disableButton = 0;
      let returnedObj = data;
      if (this.roleObj.id == 0) {
        this.roleData.push(data)
      }
      else {
        let index = this.roleData.findIndex(item => item.id == returnedObj.id);
        this.roleData[index].name = returnedObj.name;
        this.roleData[index].count = returnedObj.count;
      }
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $("#roleModal").modal('hide');
      this.getRoleData(3);
    }, error => { console.log(error) })
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
      if (param == 'role' && status == -1) {
        let index = this.roleData.findIndex(item => item.id == id);
        this.roleData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'role') {
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
      if (type == "roleStatus") {
        this.getRoleData(3)
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
  changeMenuStatus(index, ope) {
    if (ope) {
      this.roleObj.menus[index].subMenus.forEach(function (val, key) {
        val.seeOwn = true;
        val.seeAll = false;
      });
    }
  }
  changeSeeOwn(menuindex, submenuindex, ope) {
    this.roleObj.menus[menuindex].subMenus[submenuindex].seeAll = ope ? false : true;
  }
  changeSeeAll(menuindex, submenuindex, ope) {
    this.roleObj.menus[menuindex].subMenus[submenuindex].seeOwn = ope ? false : true;
  }
}
