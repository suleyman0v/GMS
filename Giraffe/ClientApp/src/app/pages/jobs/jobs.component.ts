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
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  loading = false;
  tabid: number = 1;
  sortReverse: boolean;
  sortType: string;
  searchJob: string;
  jobData: any[];
  jobsObj: any = {}
  jobsObjTemp: any;
  statusObj: any = {};
  disableButton: number = 0;
  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delType2: string;
  delBulkArray: any = [];
  public jobconfig: PaginationInstance = {
    id: 'jobs',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private router: Router, private route: ActivatedRoute, private reqRes: ReqResService, private pluginservice: PluginService) {}
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getJobsData(1);
  }
  modalJobsClose() {
    let result = this.pluginservice.compareObjects(this.jobsObj, this.jobsObjTemp, ["id", "jobs"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#jobModal').modal('hide');
      }
    }
    else {
      $('#jobModal').modal('hide');
    }
  }
  getJobsData(tab) {
    this.loading = true;
    this.reqRes.getData('/Job/GetJobsData/' + tab).subscribe(data => {
      this.loading = false;
      this.jobData = data;
      this.pluginservice.setBulkActions('#jobBulk');
    },
      error => {
        console.log(error)
      })
  }

  editJob(id) {
    this.reqRes.getData('/Job/GetJobDetail/' + id).subscribe(data => {
      this.jobsObj = data;
      //Clone User Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.jobsObj));
      this.jobsObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      this.pluginservice.setBulkActions('#jobBulk');
      $("#jobModal").modal('show');
    },
      error => {
        console.log(error)
      })
  }
  saveJob() {
    this.disableButton = 1;
    this.reqRes.postData('/Job/JobOperation', this.jobsObj).subscribe(data => {
      this.disableButton = 0;
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $("#jobModal").modal('hide');
      this.getJobsData(1);
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
      if (param == 'job' && status == -1) {
        let index = this.jobData.findIndex(item => item.id == id);
        this.jobData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'job') {
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
      if (type == "jobStatus") {
        this.getJobsData(1);
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
