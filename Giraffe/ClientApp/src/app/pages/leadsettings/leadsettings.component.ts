import { OnInit, Component } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
declare var $: any;
declare var toastr: any;

@Component({
    selector: 'app-leadsettings',
    templateUrl: './leadsettings.component.html',
    styleUrls: ['./leadsettings.component.css']
})
export class LeadsettingsComponent implements OnInit {
    loading = false;
    leadSettingsData: any[];
    sortReverse: boolean;
    sortType: string;
    searchLeadSettings: string;

    projectTypeObj: any = {};
    sourceObj: any = {};
    activityObj: any = {};
    durationDay: any = [];
    durationHour: any = [];
    durationMinute: any = [];

    //del variables
    delId: number;
    delType: string;
    delCount: number;
    delBulkArray: any = [];
    delType2: string;

    public projectTypeConfig: PaginationInstance = {
        id: 'projectType',
        itemsPerPage: 10,
        currentPage: 1
    };
    public sourceConfig: PaginationInstance = {
        id: 'source',
        itemsPerPage: 10,
        currentPage: 1
    };
    public activityConfig: PaginationInstance = {
        id: 'activity',
        itemsPerPage: 10,
        currentPage: 1
    };
    constructor(private reqRes: ReqResService) {
    }
    ngOnInit(): void {
        this.getLeadSettingsData('projectType');
    }
    //================================================================
    changeStatus(param, id, status, param2): void {
        if (param2 == 'changeStatus') {
            status = status ? 1 : 0;
        }
        let statusObj: any = {};
        statusObj.param = param;
        statusObj.id = id;
        statusObj.status = status;
        this.reqRes.postData('/Global/ChangeStatus', statusObj).subscribe(data => {
            if (param == 'projectType' && param2 == 'delete') {
                let index = this.leadSettingsData.findIndex(item => item.id == id);
                this.leadSettingsData.splice(index, 1);
                toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
            }
            else if (param == 'projectType' && param2 == 'changeStatus') {
                toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            }
            if (param == 'source' && param2 == 'delete') {
                let index = this.leadSettingsData.findIndex(item => item.id == id);
                this.leadSettingsData.splice(index, 1);
                toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
            }
            else if (param == 'source' && param2 == 'changeStatus') {
                toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            }
            if (param == 'activity' && param2 == 'delete') {
                let index = this.leadSettingsData.findIndex(item => item.id == id);
                this.leadSettingsData.splice(index, 1);
                toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
            }
            else if (param == 'activity' && param2 == 'changeStatus') {
                toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            }
        }, error => { console.log(error) })
    }
    getLeadSettingsData(type) {
        this.searchLeadSettings = '';
        if (type == 'projectType') {
            this.sortReverse = false;
            this.sortType = 'orderby';
            this.projectTypeConfig.currentPage = 1;
        }
        else if (type == 'source') {
            this.sortReverse = false;
            this.sortType = 'orderby';
            this.sourceConfig.currentPage = 1;
        }
        else if (type == 'activity') {
            this.sortReverse = false;
            this.sortType = 'orderby';
            this.activityConfig.currentPage = 1;
        }
        this.loading = true;
        this.reqRes.getData('/Settings/GetSettingsViewData/' + type).subscribe(data => {
            this.loading = false;
            this.leadSettingsData = data;
        },
            error => { console.log(error); this.loading = false; })
    }
    modalDelete(delId, delType, delType2, bulkArray) {
        this.delId = delId;
        this.delType = delType;
        this.delType2 = delType2;
        this.delBulkArray = bulkArray;
        if (bulkArray.length == 0) {
            this.delCount = 1;
        } else {
            //let ids: any = this.pluginservice.getBulkActions('#' + bulkArray[0], bulkArray[1]);
            //var str = ids.toString();
            //this.delCount = str.split(",").length;
        }
        $('#modalDelete').modal('show');
    }
    deleteItem(id, type, type2, array) {
        $('#modalDelete').modal('hide');
        if (array.length == 0) {
            this.changeStatus(type, id, -1, type2);
        } else {
            //this.bulkActions(array[0], array[1], array[2])
        }
    }
    //================================================================
    //#region ProjectType
    editProjectType(id) {
        this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/projectType').subscribe(data => {
            this.projectTypeObj = data;
            $('#projectTypeModal').modal('show');
        },
            error => { console.log(error); })
    }
    saveProjectType() {
        $('#btnprojectType').attr('disabled', 'disabled');
        this.reqRes.postData('/Settings/ProjectTypeOperation', this.projectTypeObj).subscribe(data => {
            $('#btnprojectType').removeAttr('disabled');
            let returnedObj = data;
            if (this.projectTypeObj.id == 0) {
                this.leadSettingsData.push(data)
            }
            else {
                let index = this.leadSettingsData.findIndex(item => item.id == returnedObj.id);
                this.leadSettingsData[index].name = returnedObj.name;
            }
            toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            $('#projectTypeModal').modal('hide');
        },
            error => { console.log(error); })
    }
    //#endregion ProjectType
    //================================================================
    //#region Source
    editSource(id) {
        this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/source').subscribe(data => {
            this.sourceObj = data;
            $('#sourceModal').modal('show');
        },
            error => { console.log(error); })
    }
    saveSource() {
        $('#btnSource').attr('disabled', 'disabled');
        this.reqRes.postData('/Settings/SourceOperation', this.sourceObj).subscribe(data => {
            $('#btnSource').removeAttr('disabled');
            let returnedObj = data;
            if (this.sourceObj.id == 0) {
                this.leadSettingsData.push(data)
            }
            else {
                let index = this.leadSettingsData.findIndex(item => item.id == returnedObj.id);
                this.leadSettingsData[index].name = returnedObj.name;
            }
            toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            $('#sourceModal').modal('hide');
        },
            error => { console.log(error); })
    }
    //#endregion Source
    //================================================================
    //#region Activity
    bindDuration() {
        this.durationDay = [];
        this.durationHour = [];
        this.durationMinute = [];
        for (var i = 0; i < 21; i++) {
            this.durationDay.push({ id: i, name: i + (i <= 1 ? ' day' : ' days') })
        }
        for (var i = 0; i < 24; i++) {
            this.durationHour.push({ id: i, name: i + ' h' })
        }
        for (var i = 0; i < 4; i++) {
            this.durationMinute.push({ id: i * 15, name: i * 15 + ' m' })
        }
    }
    editActivity(id) {
        this.bindDuration();
        this.reqRes.getData('/Settings/GetSettingsEditData/' + id + '/activity').subscribe(data => {
            this.activityObj = data;
            $('#activityModal').modal('show');
        },
            error => { console.log(error); })
    }
    saveActivity() {
        $('#btnActivity').attr('disabled', 'disabled');
        this.reqRes.postData('/Settings/ActivityOperation', this.activityObj).subscribe(data => {
            $('#btnActivity').removeAttr('disabled');
            let returnedObj = data;
            if (this.activityObj.id == 0) {
                this.leadSettingsData.push(data)
            }
            else {
                let index = this.leadSettingsData.findIndex(item => item.id == returnedObj.id);
                this.leadSettingsData[index].name = returnedObj.name;
                this.leadSettingsData[index].color = returnedObj.color;
                this.leadSettingsData[index].defaultDurationDay = returnedObj.defaultDurationDay;
                this.leadSettingsData[index].defaultDurationHour = returnedObj.defaultDurationHour;
                this.leadSettingsData[index].defaultDurationMinute = returnedObj.defaultDurationMinute;
                this.leadSettingsData[index].defaultReminder = returnedObj.defaultReminder;
            }
            toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
            $('#activityModal').modal('hide');
        },
            error => { console.log(error); })
    }
    //#endregion Activity
    //================================================================

}
