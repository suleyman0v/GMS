import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';

declare var $: any;
declare var toastr: any;

@Component({
    selector: 'app-servicegroups',
    templateUrl: './servicegroups.component.html',
    styleUrls: ['./servicegroups.component.css']
})
export class ServicegroupsComponent implements OnInit {
    loading = false;
    serviceGroupData: any[];
    sortReverse: boolean;
    sortType: string;
    searchServiceGroup: string;
    serviceGroupObj: any = {};

    //del variables
    delId: number;
    delType: string;
    delType2: string;
    delCount: number;
    delBulkArray: any = [];

    public serviceGroupConfig: PaginationInstance = {
        id: 'serviceGroup',
        itemsPerPage: 10,
        currentPage: 1
    };
    constructor(private reqRes: ReqResService, private pluginservice: PluginService) {
    }

    ngOnInit(): void {
        this.sortReverse = true;
        this.sortType = 'createdate';
        this.getServiceGroupData();
    }
    //Item Group Data
    getServiceGroupData() {
        this.loading = true;
        this.reqRes.getData('/Settings/GetSettingsViewData/serviceGroup').subscribe(data => {
            this.loading = false;
            this.serviceGroupData = data;
            this.pluginservice.setBulkActions('#serviceGroupBulk');
        },
            error => { console.log(error); this.loading = false; })
    }
    //Item Group End Data
    editServiceGroup(id) {
        this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/serviceGroup').subscribe(data => {
            this.serviceGroupObj = data;
            $(`#${'serviceGroupModal'}`).modal('show');
        },
            error => { console.log(error); })
    }
    saveServiceGroup() {
        $('#btnServiceGroup').attr('disabled', 'disabled');
        this.reqRes.postData('/Settings/ServiceGroupOperation', this.serviceGroupObj).subscribe(data => {
            $('#btnServiceGroup').removeAttr('disabled');
            let returnedObj = data;
            if (this.serviceGroupObj.id == 0) {
                this.serviceGroupData.push(data)
            }
            else {
                let index = this.serviceGroupData.findIndex(item => item.id == returnedObj.id);
                this.serviceGroupData[index].name = returnedObj.name;
                this.serviceGroupData[index].desc = returnedObj.desc;
            }
            toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            $(`#${'serviceGroupModal'}`).modal('hide');
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
            if (param == 'serviceGroup' && status == -1) {
                let index = this.serviceGroupData.findIndex(item => item.id == id);
                this.serviceGroupData.splice(index, 1);
                toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
            }
            else if (param == 'serviceGroup') {
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
            if (type == "serviceGroupStatus") {
                this.getServiceGroupData();
            }
        }, error => { console.log(error) })
    }
    modalDelete(delId, delType, delType2, bulkArray) {
        console.log('asdas')
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

