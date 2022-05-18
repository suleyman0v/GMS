import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';
import { AuthService } from '../../service/auth/auth.service'

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loading = false;
  userData: any = [];
  sortReverse: boolean;
  sortType: string;
  searchUser: string;
  userObj: any = {};
  userObjTemp: any;
  userLimit: number = 0;
  modalType: number = 0
  chkOpe: number = 0;
  disableButton: number = 0;
  changePasswordOpe: boolean = false;
  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delBulkArray: any = [];
  delType2: string;
  public userConfig: PaginationInstance = {
    id: 'users',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private reqRes: ReqResService, private pluginservice: PluginService, private authService: AuthService,) { }
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getUserData(2);
  }
  getUserLimit() {
    this.reqRes.getData('/User/GetUserStaticData/UserLimit').subscribe(data => {
      this.userLimit = data[0].userLimit;
    },
      error => {
        console.log(error)
      })
  }
  resetchkOpe() {
    this.chkOpe = 0;
  }
  checkUserEmail() {
    this.reqRes.getData('/User/GetUserStaticData/UserEmail/' + this.userObj.id + '/' + this.userObj.email).subscribe(data => {
      this.chkOpe = data[0].chkOpe;
      if (this.chkOpe == 0) {
        this.saveUser();
      }
    },
      error => {
        console.log(error)
      })
  }
  modalUserClose() {
    let result = this.pluginservice.compareObjects(this.userObj, this.userObjTemp, ["id", "userRoles"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#userModal').modal('hide');
      }
    }
    else {
      $('#userModal').modal('hide');
    }
  }
  saveUser() {
    this.disableButton = 1;
    this.reqRes.postData('/User/SaveUser', this.userObj).subscribe(data => {
      this.disableButton = 0;
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $("#userModal").modal('hide');
      this.getUserData(2)
      if (data.length != 0) {
        let localStorage = data;
        localStorage[0].companyImage = this.authService.companyImage();
        localStorage[0].companyName = this.authService.companyName();
        this.authService.setUserData(localStorage);
      }
    }, error => { console.log(error) })
  }
  getUserData(type) {
    this.loading = true;
    this.reqRes.getData('/Settings/GetUserData/' + type).subscribe(data => {
      this.loading = false;
      this.userData = data;
      this.pluginservice.setBulkActions('#userBulk');
    },
      error => {
        console.log(error)
      })
  }
  chagenPasswordPermission() {
    this.userObj.password = ''
    this.userObj.confirmationPassword = ''
  }
  editUser(id) {
    this.chkOpe = 0;
    this.modalType = id;
    this.changePasswordOpe = (this.modalType == 0) ? true : false;
    this.reqRes.getData('/User/GetUserEditData/' + id + '/user').subscribe(data => {
      this.userObj = data;
      //Clone User Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.userObj));
      this.userObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      $("#userModal").modal('show');
    },
      error => { console.log(error); })
    this.getUserLimit();
  }
  changeStatus(param, id, status, param2): void {
    if (param2 == 'changeStatus') {
      status = status ? 1 : 0;
    }
    let statusObj: any = {};
    statusObj.param = param;
    statusObj.id = id;
    statusObj.status = status;
    this.reqRes.postData('/User/ChangeUserStatus', statusObj).subscribe(data => {
      if (param == 'user' && status == -1) {
        let index = this.userData.findIndex(item => item.id == id);
        this.userData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'user') {
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
    this.reqRes.postData('/User/SetUserBulkActions', bulkObj).subscribe(data => {
      toastr.success(data.result, '', { timeOut: 1000 });
      if (type == "userStatus") {
        this.getUserData(2);
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
}
