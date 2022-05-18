import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';
import { AuthService } from '../../service/auth/auth.service'
import * as moment from 'moment';
import { OrderPipe } from 'ngx-order-pipe';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  loading = false;
  tabid: number = 1;
  sortReverse: boolean;
  sortType: string;
  searchCustomer: string;
  customerData: any[];
  customersObj: any = {
    customerObj: {},
  }
  customersTemp: any;
  statusObj: any = {};
  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delType2: string;
  delBulkArray: any = [];
  public listviewconfig: PaginationInstance = {
    id: 'listview',
    itemsPerPage: 10,
    currentPage: 1
  };
  public _authService;
  constructor(private router: Router, private route: ActivatedRoute, private reqRes: ReqResService, private pluginservice: PluginService, private authService: AuthService, private orderPipe: OrderPipe) {
    this.route.paramMap.subscribe(paramMap => {
      this.tabid = Number(paramMap.get('id'));
      this.changeTab(this.tabid);
     this.getCustomersData(this.tabid);
    });
    this._authService = this.authService;
  }
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
  }
  changeTab(id) {
    this.tabid = Number(id);
    if (this.tabid == 1) {
      this.searchCustomer = '';
      this.listviewconfig.currentPage = 1;
    }
    this.router.navigate(['/customer', this.tabid]);
  }
  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
  }
  getCustomersData(tab) {
    this.loading = true;
    this.reqRes.getData('/Customer/GetCustomersData/' + tab).subscribe(data => {
      this.loading = false;
      this.customerData = data;
      this.pluginservice.setBulkActions('#customerBulk');
    },
      error => {
        console.log(error)
      })
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
      if (param == 'customerList' && status == -1) {
        let index = this.customerData.findIndex(item => item.id == id);
        this.customerData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'customerList') {
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
      if (type == "customerStatus") {
        this.getCustomersData(1); 
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
