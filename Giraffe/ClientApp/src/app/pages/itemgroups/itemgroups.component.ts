import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';

declare var $: any;
declare var toastr: any;

@Component({
    selector: 'app-itemgroups',
    templateUrl: './itemgroups.component.html',
    styleUrls: ['./itemgroups.component.css']
})
export class ItemgroupsComponent implements OnInit {
    loading = false;
    itemGroupData: any[];
    sortReverse: boolean;
    sortType: string;
    searchItemGroup: string;
    itemGroupObj: any = {};

    //del variables
    delId: number;
    delType: string;
    delCount: number;
    delBulkArray: any = [];
    delType2: string; 

    public itemGroupConfig: PaginationInstance = {
        id: 'itemGroup',
        itemsPerPage: 10,
        currentPage: 1
    };
    constructor(private reqRes: ReqResService, private pluginservice: PluginService) {
    }

    ngOnInit(): void {
        this.sortReverse = true;
        this.sortType = 'createdate';
        this.getItemGroupData();
    }
    //Item Group Data
    getItemGroupData() {
        this.loading = true;
        this.reqRes.getData('/Settings/GetSettingsViewData/itemGroup').subscribe(data => {
            this.loading = false;
            this.itemGroupData = data;
            this.pluginservice.setBulkActions('#itemGroupBulk');
        },
            error => { console.log(error); this.loading = false; })
    }
    //Item Group End Data
    editItemGroup(id) {
        this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/itemGroup').subscribe(data => {
            this.itemGroupObj = data;
            $(`#${'itemGroupModal'}`).modal('show');
        },
            error => { console.log(error); })
    }
    saveItemGroup() {
        $('#btnItemGroup').attr('disabled', 'disabled');
        this.reqRes.postData('/Settings/ItemGroupOperation', this.itemGroupObj).subscribe(data => {
            $('#btnItemGroup').removeAttr('disabled');
            let returnedObj = data;
            if (this.itemGroupObj.id == 0) {
                this.itemGroupData.push(data)
            }
            else {
                let index = this.itemGroupData.findIndex(item => item.id == returnedObj.id);
                this.itemGroupData[index].name = returnedObj.name;
                this.itemGroupData[index].desc = returnedObj.desc;
            }
            toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            $(`#${'itemGroupModal'}`).modal('hide');
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
            if (param == 'itemGroup' && status == -1) {
                let index = this.itemGroupData.findIndex(item => item.id == id);
                this.itemGroupData.splice(index, 1);
                toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
            }
            else if (param == 'itemGroup') {
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
            if (type == "itemGroupStatus") {
                this.getItemGroupData();
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
