import { Component, OnInit, HostListener, ViewChild, Input, Output, EventEmitter, ElementRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';
import { AuthService } from '../../service/auth/auth.service'
import * as moment from 'moment';
import { OrderPipe } from 'ngx-order-pipe';

declare var $: any;
declare var window: any;
declare var toastr: any;
declare var renderCalendar: any;
declare var tinymce: any;

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  @HostListener('scroll', ['$event'])
  @ViewChild('focusInput') searchElement;
  @ViewChild('filteredDataowner') ownersElement;
  loading = false;
  leadData: any[];
  needCareCount: number;
  sortReverse: boolean;
  sortType: string;
  tabid: number = 1;
  cusId: number;
  leadObj: any = {
    customerObj: {},
    generalObj: {},
    projectObj: {},
    ownerObj: {},
    activityObj: [],
    proposalObj: [],
    fileObj: [],
  }
  leadObjTemp: any;
  activityObjTemp: any;
  proposalObjTemp: any;
  customerOpeType: number;
  CustomerOpeTypeOld: number;
  countCustomer: number = 0;
  customerData: any = [];
  customerViewOpe: number = 1;
  customerTempObj: any = {};
  modalActionType: string;
  leadSearchModalActionType: string;

  countLeadSearch: number = 0;
  LeadSearch: any = [];

  searchLead: string;
  searchLeadTxt: string;
  searchCustomer: string;
  searchAct: string;
  searchProp: string;
  searchOwnAssginer: string;
  searchActAssigner: string;

  statusObj: any = {};
  fileUploadOpe: number = 1;
  dateType: number = 0;;

  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delBulkArray: any = [];

  prevBtn: number = 1;
  //disabledNextOrPrev: number = 0;

  filterModalData: any = [];
  filteredData: any = [];
  filteredDataOwners: any = [];
  filteredDataStatuses: any = [];
  filteredDataProjects: any = [];
  filteredDataSources: any = [];
  dateFilterType: number = 0;
  leadFilteredOpe: number = 0;
  leadFilteredBgOpe: number = 0;

  calendarEventData: any = {};
  newActivityOpe: number = 1;

  //siqnature variables
  points: any = [];
  public listviewconfig: PaginationInstance = {
    id: 'listview',
    itemsPerPage: 10,
    currentPage: 1
  };
  public needcareconfig: PaginationInstance = {
    id: 'needcare',
    itemsPerPage: 10,
    currentPage: 1
  };
  public activityConfig: PaginationInstance = {
    id: 'tbl-activity',
    itemsPerPage: 10,
    currentPage: 1
  };
  public proposalConfig: PaginationInstance = {
    id: 'tbl-proposal',
    itemsPerPage: 10,
    currentPage: 1
  };
  public _authService;
  constructor(private router: Router, private route: ActivatedRoute, private reqRes: ReqResService, private pluginservice: PluginService, private authService: AuthService, private orderPipe: OrderPipe) {
    this.route.paramMap.subscribe(paramMap => {
      this.tabid = Number(paramMap.get('id'));
      this.changeTab(this.tabid);
      if (this.tabid == 1) {
        this.getFilterModalData_('Lead');
      } else {
        this.getLeadData(this.tabid);
      }
    });
    this._authService = this.authService;
  }
  filteredDataOwnersChangeOpe: number = 0;
  filteredDataProjectsChangeOpe: number = 0;
  filteredDataStatusesChangeOpe: number = 0;
  filteredDataSourcesChangeOpe: number = 0;

  ngOnInit(): void {
    window.Dropzone ? window.Dropzone.autoDiscover = false : '';
    $('.selectpicker').select2()
    $('#filteredDataowner').on('change', (e) => { this.fid = 0; this.filteredDataOwnersChangeOpe = e.target.value.split(': ')[1] });
    $('#filteredDataProjects').on('change', (e) => { this.fid = 0; this.filteredDataProjectsChangeOpe = e.target.value.split(': ')[1] });
    $('#filteredDataStatuses').on('change', (e) => { this.fid = 0; this.filteredDataStatusesChangeOpe = e.target.value.split(': ')[1] });
    $('#filteredDataSources').on('change', (e) => { this.fid = 0; this.filteredDataSourcesChangeOpe = e.target.value.split(': ')[1] });
    $('#begTime').pickatime({
      min: [8, 0],
      max: [20, 0],
      interval: 15
    });
  }

  ngAfterViewChecked() {
    $('[data-toggle="tooltip"]').tooltip();
    $('.signature-pad').mouseup(() => {
      this.disableSignature = true;
      this.agreeCondition();
    });
    $('.signature-Clear').click(() => {
      this.approveSignature = false;
      this.disableSignature = false;
      $(".signature-Sign").attr('disabled', true);
    });
    $(".picker__holder").css("max-width", $('#begTime').outerWidth());
  }

  changeTab(id) {
    this.tabid = Number(id);
    if (this.tabid == 1) {
      this.searchLead = '';
      //this.sortReverse = true;
      //this.sortType = 'createDate';
      this.listviewconfig.currentPage = 1;
    }
    else if (this.tabid == 2) {
      this.searchLead = '';
      //this.sortReverse = true;
      //this.sortType = 'createDate';
      this.needcareconfig.currentPage = 1;
    }
    else if (this.tabid == 3) {
      this.searchLead = '';
      //this.sortReverse = false;
      //this.sortType = 'begDateOrderBy';
      this.activityConfig.currentPage = 1;
    }
    else if (this.tabid == 5) {
      this.searchLead = '';
      //this.sortReverse = true;
      //this.sortType = 'createDate';
      this.proposalConfig.currentPage = 1;
    }
    this.router.navigate(['/leads', this.tabid]);
  }

  changeStatus(param, id, status, param2): void {
    this.statusObj.param = param;
    this.statusObj.id = id;
    this.statusObj.status = status;
    this.reqRes.postData('/Global/ChangeStatus', this.statusObj).subscribe(data => {
      if (param == 'lead') {
        let index = this.leadData.findIndex(item => item.id == id);
        this.leadData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadCare') {
        let index = this.leadData.findIndex(item => item.id == id);
        this.leadData.splice(index, 1);
        if (status == 1) {
          this.needCareCount++;
          toastr.success('Moved to Special Successfully !', '', { timeOut: 1000 });
        }
        else {
          this.needCareCount--;
          toastr.success('Removed from Special Successfully !', '', { timeOut: 1000 });
        }
      }
      else if (param == 'leadActivity' && param2 != 'leadActivityGrid') {
        let index = this.leadObj.activityObj.findIndex(item => item.id == id);
        this.leadObj.activityObj.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadActivity' && param2 == 'leadActivityGrid') {
        let index = this.leadData.findIndex(item => item.id == id);
        this.leadData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadActivityStatus' && param2 == 'leadActivityGrid') {
        let index = this.leadData.findIndex(item => item.id == id);
        this.leadData.splice(index, 1);
        toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadActivityCalendar' && param2 == 'leadActivityCalendar') {
        $('#eventDetails').modal('hide');
        this.getLeadData(4)
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadProposal' && param2 == 'leadProposalGrid') {
        let index = this.leadData.findIndex(item => item.id == id);
        this.leadData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadProposal' && param2 != 'leadProposalGrid') {
        let index = this.leadObj.proposalObj.findIndex(item => item.id == id);
        this.leadObj.proposalObj.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'leadProposalStatus') {
        this.reqRes.getData('/Lead/GetLeadReturnProposal/' + this.leadObj.id + "/0").subscribe(
          result => {

            this.leadObj.proposalObj = result;
            this.disableButtons = 0;
          },
          error => {
            console.log(error)
          }
        )
        toastr.success('Changed Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'filterStatus') {
        let index = this.filterModalData.filterObj.findIndex(item => item.id == id);

        let DefaultData = this.filterModalData.filterObj.findIndex(item => item.id == id && item.isDefault == 1)
        this.filterModalData.filterObj.splice(index, 1);
        if (this.fid == id) {
          $("#filteredDataowner").val('').trigger('change');
          $("#filteredDataStatuses").val('').trigger('change');
          $("#filteredDataProjects").val('').trigger('change');
          $("#filteredDataSources").val('').trigger('change');
          this.dateFilterType = 0;
          this.filteredData.startDate = '';
          this.filteredData.endDate = '';
        }

        if (DefaultData.length > 0) {
          this.leadFilteredBgOpe = 0;
        }
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
    }, error => { console.log(error) })
  }
  //Lead Data
  filteredProperties: string;
  getLeadData(id) {
    this.loading = true;
    let filter = '';
    filter = (id != 1 || this.leadFilteredBgOpe == 0) ? '' : this.filteredProperties;
    this.reqRes.getData('/Lead/GetLeadData/' + id + '/' + filter).subscribe(data => {
      this.loading = false;
      this.leadData = data.leadData;
      this.needCareCount = data.needCareCount;
      if (this.tabid == 1) {
        this.masterSelectedRefresh('listviewBulk');
      }
      else if (this.tabid == 2) {
        this.masterSelectedRefresh('needcareBulk');
      }
      else if (this.tabid == 3) {
        this.activityMasterSelectedRefresh('activityBulk');
      }
      else if (this.tabid == 4) {
        this.calendarSelectedDate = new Date();
        this.setCalendar(this.leadData);
      }
      else if (this.tabid == 5) {
        this.proposalMasterSelectedRefresh('proposalBulk');
      }
    },
      error => { console.log(error); this.loading = false; })
  }
  // Lead Data End
  setNote(note) {
    this.note = note;
    $('#modalNote').modal('show');
  }
  bulkObj: any = {};
  bulkActions(type): void {
    let ids;
    if (type == "listviewToNeedcare" || type == "listviewStatus" || type == "needcareToListview" ||
      type == "needcareStatus" || type == "activityListStatus" || type == "activityListCompleted" || type == "proposalListStatus") {
      ids = this.checkedList.map(function (item) {
        return item['id'];
      });
    }
    else if (type == "activityStatus" || type == "activityCompleted") {
      ids = this.activityCheckedList.map(function (item) {
        return item['id'];
      });
    }
    else if (type == "proposalStatus") {
      ids = this.proposalCheckedList.map(function (item) {
        return item['id'];
      });
    }

    var str = ids.toString();
    this.bulkObj.ids = str;
    this.bulkObj.type = type;
    this.reqRes.postData('/Global/SetBulkActions', this.bulkObj).subscribe(data => {
      toastr.success(data.result, '', { timeOut: 1000 });
      if (type == "activityStatus" || type == "activityCompleted") {
        this.reqRes.getData('/Lead/GetLeadReturnActivities/' + this.leadObj.id).subscribe(
          result => {
            this.leadObj.activityObj = result;
            this.activityMasterSelectedRefresh('activityBulk');
            this.activityCheckedList = [];
          },
          error => {
            console.log(error)
          }
        )
      }
      if (type == "proposalStatus") {
        this.reqRes.getData('/Lead/GetLeadReturnProposal/' + this.leadObj.id + "/0").subscribe(
          result => {
            this.leadObj.proposalObj = result;
            this.proposalMasterSelectedRefresh('ldProposalBulk');
            this.proposalCheckedList = [];
          },
          error => {
            console.log(error)
          }
        )
      }
      else if (type == "listviewToNeedcare" || type == "listviewStatus" || type == "needcareToListview" ||
        type == "needcareStatus" || type == "activityListStatus" || type == "activityListCompleted" || type == "proposalListStatus") {
        this.getLeadData(this.tabid);
        if (type == "listviewToNeedcare" || type == "listviewStatus") {
          this.masterSelectedRefresh('listviewBulk');
        }
        else if (type == "needcareToListview" || type == "needcareStatus") {
          this.masterSelectedRefresh('needcareBulk');
        }
        else if (type == "activityListStatus" || type == "activityListCompleted") {
          this.masterSelectedRefresh('lActivityBulk');
        }
        else if (type == "proposalListStatus") {
          this.masterSelectedRefresh('proposalBulk');
        }
        this.checkedList = [];

      }
    }, error => { console.log(error) })
  }
  delType2: string;
  //Activity End
  //Dinamic delete method(open PopUp)
  //delId must be zero if you want delete one more items by bulk and bulkArray accept dinamic bulk parametr by bulkArray ,type is not required here send '' instead of delType
  //bulkArray must be empty if you want to delete one items and accept  delId and must be delType
  modalDelete(delId, delType, delType2, bulkArray, modalActionType) {
    this.delId = delId;
    this.delType = delType;
    this.delType2 = delType2;
    this.delBulkArray = bulkArray;
    this.modalActionType = modalActionType;
    if (bulkArray.length == 0) {
      this.delCount = 1;
    } else {
      let ids = this.checkedList.map(function (item) {
        return item['id'];
      });
      var str = ids.toString();
      this.delCount = str.split(",").length;
    }
    if (this.modalActionType == 'leadActivityCalendar') {
      $('#eventDetails').modal('hide');
    }
    else if (this.modalActionType == 'leadActivity' || this.modalActionType == 'leadProposal'
      || this.modalActionType == 'leadActivityBulk' || this.modalActionType == 'leadProposalBulk') {
      $('#leadModal').modal('hide');
    }

    $('#modalDelete').modal('show');
  }
  deleteItem(id, type, type2, array) {
    $('#modalDelete').modal('hide');
    if (this.modalActionType != '' && this.modalActionType != 'leadActivityCalendar') {
      this.modalDeleteClose(this.modalActionType);
    }
    if (array.length == 0) {
      this.changeStatus(type, id, -1, type2);
    } else {
      this.bulkActions(array[0]);
    }
  }
  modalDeleteClose(type) {
    $('#modalDelete').modal('hide');
    if (type == 'leadActivityCalendar') {
      $('#eventDetails').modal('show');
    }
    else if (type == 'leadActivity' || this.modalActionType == 'leadProposal'
      || this.modalActionType == 'leadActivityBulk' || this.modalActionType == 'leadProposalBulk') {
      $('#leadModal').modal('show');
    }
  }
  //================================================================================//
  //#region Bulk Select
  masterSelected: boolean = false;
  checkedList: any = [];

  checkUncheckAll(currentPage, itemsPerPage) {
    let component = this;
    let start = (currentPage * itemsPerPage) - itemsPerPage;
    let end = (currentPage * itemsPerPage);
    this.orderPipe.transform(this.leadData, this.sortType, this.sortReverse).forEach(function (val, key) {
      if (start < (key + 1) && (key + 1) <= end) {
        val.checkboxOpe = component.masterSelected;
      }
    });
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.leadData.every(function (item: any) {
      return item.checkboxOpe == true;
    })
    this.getCheckedItemList();
  }
  masterSelectedRefresh(id) {
    $("#" + id).removeAttr("checked");
    this.masterSelected = false; //uncheck
  }

  getCheckedItemList() {
    let component = this;
    this.checkedList = [];
    this.leadData.forEach(function (val, key) {
      if (val.checkboxOpe)
        component.checkedList.push({ id: val.id });
    });
  }
  //#endregion Bulk Select
  //#region Bulk Select Activity Modal
  activityMasterSelected: boolean = false;
  activityCheckedList: any = [];

  activityCheckUncheckAll() {
    let component = this;
    this.leadObj.activityObj.forEach(function (val, key) {
      val.checkboxOpe = component.activityMasterSelected;
    });
    this.activityGetCheckedItemList();
  }
  activityIsAllSelected() {
    this.activityMasterSelected = this.leadObj.activityObj.every(function (item: any) {
      return item.checkboxOpe == true;
    })
    this.activityGetCheckedItemList();
  }
  activityMasterSelectedRefresh(id) {
    $("#" + id).removeAttr("checked");
    this.activityMasterSelected = false; //uncheck
  }

  activityGetCheckedItemList() {
    let component = this;
    this.activityCheckedList = [];
    this.leadObj.activityObj.forEach(function (val, key) {
      if (val.checkboxOpe)
        component.activityCheckedList.push({ id: val.id, statusId: val.statusId });
    });
  }
  //#endregion Bulk Select Activity Modal
  //#region Bulk Select Proposal Modal
  proposalMasterSelected: boolean = false;
  proposalCheckedList: any = [];

  proposalCheckUncheckAll() {
    let component = this;
    this.leadObj.proposalObj.forEach(function (val, key) {
      val.checkboxOpe = component.proposalMasterSelected;
    });
    this.proposalGetCheckedItemList();
  }
  proposalIsAllSelected() {
    this.proposalMasterSelected = this.leadObj.proposalObj.every(function (item: any) {
      return item.checkboxOpe == true;
    })
    this.proposalGetCheckedItemList();
  }
  proposalMasterSelectedRefresh(id) {
    $("#" + id).removeAttr("checked");
    this.proposalMasterSelected = false; //uncheck
  }

  proposalGetCheckedItemList() {
    let component = this;
    this.proposalCheckedList = [];
    this.leadObj.proposalObj.forEach(function (val, key) {
      if (val.checkboxOpe)
        component.proposalCheckedList.push({ id: val.id });
    });
  }
  //#endregion Bulk Select Actvity Modal
  //================================================================================//
  //#region Lead Modal
  assignerChange(index, obj, ope) {
    if (ope == "add") {
      this.leadObj.ownerObj.assigner.push(obj);
      this.leadObj.ownerObj.assignerList.splice(index, 1);

      this.leadObj.ownerObj.ownerList.forEach((val, key) => {
        if (obj.id == val.id) {
          val.disabledOwner = 1;
        }
      });

    }
    else if (ope == "remove") {
      this.leadObj.ownerObj.assignerList.push(obj);
      this.leadObj.ownerObj.assigner.splice(index, 1);

      this.leadObj.ownerObj.ownerList.forEach((val, key) => {
        if (obj.id == val.id) {
          val.disabledOwner = 0;
        }
      });

    }
  }
  ownerChange(owner) {
    this.leadObj.ownerObj.assignerList.forEach((val, key) => {
      if (owner == val.id) {
        val.disabledAssigner = 1;
      }
      else {
        val.disabledAssigner = 0;
      }
    });
  };
  checkboxSelectCustomer(customerId, customerOpe) {
    this.customerData.forEach((val, key) => {
      if (customerId == val.id) {
        if (val.ope == false) {
          val.ope = true;
        }
        else {
          val.ope = false;
        }
      }
      else {
        val.ope = false;
      }
    });
  }
  selectCustomer() {
    let customerInfo = this.customerData.find(item => item.ope == true)
    this.leadObj.customerObj.id = customerInfo.id;
    this.leadObj.customerObj.firstName = customerInfo.name;
    this.leadObj.customerObj.lastName = customerInfo.surname;
    this.leadObj.customerObj.company = customerInfo.company;
    this.leadObj.customerObj.email = customerInfo.email;
    this.leadObj.customerObj.phone = customerInfo.phone;
    this.leadObj.customerObj.cellPhone = customerInfo.cellPhone;
    this.leadObj.customerObj.street = customerInfo.street;
    this.leadObj.customerObj.zipCode = customerInfo.zip;
    this.leadObj.customerObj.city = customerInfo.city.replace(',', '');
    this.leadObj.customerObj.stateProvince = customerInfo.state;
    this.leadObj.customerObj.createDate = customerInfo.createDate;
    $('#modalCustomer').modal('hide');
    $('#leadModal').modal('show');
  }
  copyFromProjectAddress(): void {
    this.leadObj.customerObj.street = this.leadObj.generalObj.projectStreet;
    this.leadObj.customerObj.zipCode = this.leadObj.generalObj.projectZipCode;
    this.leadObj.customerObj.city = this.leadObj.generalObj.projectCityTown;
    this.leadObj.customerObj.stateProvince = this.leadObj.generalObj.projectStateProvince;
  }
  copyFromCustomerAddress(): void {
    this.leadObj.generalObj.projectStreet = this.leadObj.customerObj.street;
    this.leadObj.generalObj.projectZipCode = this.leadObj.customerObj.zipCode;
    this.leadObj.generalObj.projectCityTown = this.leadObj.customerObj.city;
    this.leadObj.generalObj.projectStateProvince = this.leadObj.customerObj.stateProvince;
  }
  getHasFiles(): number {
    let cnt: number = 0;
    this.leadObj.fileObj.forEach((val, key) => {
      if (val.ope != -1) {
        cnt++;
      }
    });
    return cnt;
  }
  setDropzone() {
    let component = this;
    let template = '<div class="media align-items-center mb-3 pb-3 border-bottom btn-reveal-trigger"><img class="dz-image" style="cursor: pointer;" src = "" alt = "" data-dz-thumbnail><div class="media-body d-flex flex-between-center"><div><a style="cursor: pointer" href="#!" data-dz-name data-dz-download></a><div class="d-flex align-items-center" ><p class="mb-0 fs--1 text-400 line-height-1" data-dz-size> </p><div class="dz-progress"> <span class="dz-upload" data-dz-uploadprogress=""> </span></div></div></div><div class="dropdown text-sans-serif"><button class="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type = "button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <span class="fas fa-ellipsis-h"> </span></button><div class="dropdown-menu dropdown-menu-right border py-0" ><div class="bg-white py-2"> <a class="dropdown-item" href = "#!" data-dz-download> Download </a> <a class="dropdown-item" href = "#!" data-dz-remove > Remove File </a></div></div></div></div></div>';
    var dropzones = $('#dropzone');
    !!dropzones.length && dropzones.each(function (index, value) {
      var element = value;
      if (element.dropzone) {
        element.dropzone.destroy();
      }
      var $this = $(element);
      var userOptions = $this.data('options');
      userOptions = userOptions || {};
      var data = userOptions.data ? userOptions.data : {};
      var options = $.extend({
        url: '/Global/UploadFile/',
        headers: { "Authorization": 'Bearer ' + localStorage.getItem('authToken') },
        paramName: "file",
        addRemoveLinks: false,
        previewsContainer: element.querySelector('.dz-preview'),
        previewTemplate: template,
        thumbnailWidth: null,
        thumbnailHeight: null,
        maxFilesize: 50, // MB
        preventDuplicates: true,
        dictDuplicateFile: "Duplicate Files Cannot Be Uploaded",
        init: function init() {
          var thisDropzone = this;
          if (component.leadObj.fileObj) {
            $.each(component.leadObj.fileObj, function (index, item) {
              var mockFile = {
                name: item.name,
                size: item.size,
                type: item.type,
                serverUrl: item.serverUrl
              };
              thisDropzone.emit("addedfile", mockFile);
              thisDropzone.emit("thumbnail", mockFile, item.url);
            });
          }
          thisDropzone.on('addedfile', function (file) {
            if (file.type != "image/png" || file.type != "image/jpg" || file.type != "image/jpeg") {
              file.previewElement.querySelector("img").src = 'assets/img/icons/docs.png';
            }
            if (component.leadObj.fileObj) {
              component.leadObj.fileObj.forEach((val, key) => {
                if (val.name == file.name && val.size == file.size && val.ope != -1) {
                  alert("Duplicate Files Cannot Be Uploaded")
                  this.removeFile(file);
                }
              });
            }

          });
          thisDropzone.on("processing", function (file) {
            component.fileUploadOpe = 0;
          });
          thisDropzone.on('sending', function (file, xhr, formData) {
            formData.append('type', 'Lead');
          });
          thisDropzone.on('success', function (file, response) {
            file.serverUrl = response[0].url;
            component.leadObj.fileObj.push(response[0]);
          });
          thisDropzone.on("removedfile", function (file) {
            component.leadObj.fileObj.forEach((val, key) => {
              if (val.name == file.name && file.status != "added") {
                val.ope = -1;
              }
            });
          })
          thisDropzone.on("error", function (file, message) {
            alert(message);
            this.removeFile(file);
          });
          thisDropzone.on("maxfilesexceeded", function (file) {
            thisDropzone.removeAllFiles();
            thisDropzone.addFile(file);
          });
        },
      }, userOptions);
      element.querySelector('.dz-preview').innerHTML = '';
      var dropzone = new window.Dropzone(value, options);
      dropzone.on('addedfile', function () {
        $this.find('.dz-preview .dz-preview-cover').removeClass('dz-file-complete');
        $this.addClass('dz-file-processing');
      });
      dropzone.on('complete', function () {
        component.fileUploadOpe = 1;
        $this.find('.dz-preview .dz-preview-cover').removeClass('dz-processing');
        $this.addClass('dz-file-complete');
      });
      dropzone.on("fileclicked", function (file) {
        component.pluginservice.openFile(file.serverUrl, file.name, file.type);
      });
      dropzone.on("filedownload", function (file) {
        component.pluginservice.downloadFile(file.serverUrl, file.name);
      });
    });
  }
  editLead(leadid, type) {
    this.modalActionType = type;
    $('[href="#tab-general"]').tab('show');
    $('[href="#tab-contact-information"]').tab('show');
    this.reqRes.getData('/Lead/GetLeadDetail/' + leadid).subscribe(data => {
      this.leadObj = data;
      this.leadObj.id = leadid;
      if (this.leadObj.customerObj.id == 0) {
        this.customerOpeType = 2;
        this.CustomerOpeTypeOld = 2;
      }
      else {
        this.customerOpeType = 1;
        this.CustomerOpeTypeOld = 1;
        this.customerViewOpe = 1;
      }
      //Clone Lead Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.leadObj));
      this.leadObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      this.activityMasterSelectedRefresh('activityBulk');
      this.proposalMasterSelectedRefresh('ldProposalBulk');
      this.customerTempObj = Object.assign({}, this.leadObj.customerObj)
      this.pluginservice.setRaty('saleProbality', this.leadObj.generalObj.saleProbality);

      tinymce.init({
        selector: '#leadNote',
        height: '30vh',
        menubar: false,
        mobile: {
          theme: 'silver',
          menubar: true,
          toolbar: 'undo redo bold italic underline styleselect'
        },
        statusbar: false,
        plugins: 'link,image,lists,table,media',
        toolbar: 'styleselect | bold italic link bullist numlist image blockquote table media undo redo',
        setup: function (editor) {
          editor.on('init', function (e) {
            editor.setContent(this.leadObj.generalObj.note);
          });
        }
      });
      tinymce.get('leadNote').setContent(this.leadObj.generalObj.note);
      this.setDropzone();
      $('#leadModal').modal('show');
    },
      error => {
        console.log(error)
      })
  }
  modalLeadClose() {
    this.leadObj.generalObj.saleProbality = $('#saleProbality').raty('score') == undefined ? 0 : $('#saleProbality').raty('score');
    this.leadObj.generalObj.note = tinymce.get('leadNote').getContent();
    this.leadObj.generalObj.estSaleRevenue = parseInt(this.leadObj.generalObj.estSaleRevenue);
    let result = this.pluginservice.compareObjects(this.leadObj, this.leadObjTemp, ["id", "activityObj", "proposalObj"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#leadModal').modal('hide');
      }
    }
    else {
      $('#leadModal').modal('hide');
    }
  }
  saveLead() {
    $('#btnLeadSave').attr('disabled', 'disabled');
    this.leadObj.generalObj.saleProbality = $('#saleProbality').raty('score') == undefined ? 0 : $('#saleProbality').raty('score');
    this.leadObj.generalObj.note = tinymce.get('leadNote').getContent();
    this.leadObj.generalObj.estSaleRevenue = parseInt(this.leadObj.generalObj.estSaleRevenue);
    this.reqRes.postData('/Lead/LeadOperation', this.leadObj).subscribe(data => {
      $('#btnLeadSave').removeAttr('disabled');
      let returnedObj = data;
      if (this.modalActionType == "listview" || this.modalActionType == "needcare") {
        if (this.leadObj.id == 0) {
          this.leadObj.id = returnedObj.id;
          this.leadData.push(returnedObj)
        }
        else {
          let index = this.leadData.findIndex(item => item.id == returnedObj.id);
          this.leadData[index].customer = returnedObj.customer;
          this.leadData[index].date = returnedObj.date;
          this.leadData[index].owner = returnedObj.owner;
          this.leadData[index].revenue = returnedObj.revenue;
          this.leadData[index].status = returnedObj.status;
          this.leadData[index].statusColor = returnedObj.statusColor;
          this.leadData[index].title = returnedObj.title;
          this.leadData[index].rate = returnedObj.rate;
          this.leadData[index].projectType = returnedObj.projectType;
          this.leadData[index].age = returnedObj.age;
          this.leadData[index].ownerId = returnedObj.ownerId;
          this.leadData[index].ownerImage = returnedObj.ownerImage;
          this.leadData[index].lastContacted = returnedObj.lastContacted;
          this.leadData[index].sourceName = returnedObj.sourceName;
        }
      }
      else if (this.modalActionType == "calendarIns" || this.modalActionType == "calendarEdit") {
        this.getCalendarEventData(this.calendarEventData.id);
        this.getLeadData(this.tabid);
        $('#leadModal').modal('hide');
      }
      else {
        this.getLeadData(this.tabid);
      }

      this.leadObj.customerObj.id = returnedObj.customerid;
      this.leadObj.customerObj.createDate = returnedObj.customerCreateDate;

      this.customerTempObj = Object.assign({}, this.leadObj.customerObj);
      if (this.leadObj.customerObj.id == 0) {
        this.customerOpeType = 2;
        this.CustomerOpeTypeOld = 2;
      }
      else {
        this.customerOpeType = 1;
        this.CustomerOpeTypeOld = 1;
        this.customerViewOpe = 1;
      }
      this.leadObj.fileObj.forEach((val, key) => {
        if (val.ope == 1) {
          val.ope = 0;
        }
      });
      this.leadObj.fileObj.forEach((val, key) => {
        if (val.ope == -1) {
          this.leadObj.fileObj.splice(key, 1);
        }
      });
      //Clone Lead Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.leadObj));
      this.leadObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
    }, error => { console.log(error); $('#btnLeadSave').removeAttr('disabled'); })
  }
  //#endregion Lead Modal
  //================================================================================//
  //#region Activity Modal
  activityObj: any = [];
  cloneActivityObj: any = [];
  durationDay: any = [];
  durationHour: any = [];
  durationMinute: any = [];
  note: string;
  editActivity(id, type, leadId) {
    this.modalActionType = type;
    $('[href="#tab-activity-general"]').tab('show');
    this.bindDuration();
    this.reqRes.getData('/Lead/GetActivityDetail/' + id).subscribe(data => {
      this.activityObj = data;
      if (id == 0) {
        //var date = new Date();
        //let currentDate = date.toISOString().slice(0, 10);
        //let currentTime = (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' + date.getMinutes().toString();
        this.activityObj.begTime = moment(new Date()).format('hh:mm A');
        this.activityObj.begDate = moment(new Date()).format('YYYY-MM-DD');
      }
      if (this.newActivityOpe == 2) {
        this.activityObj.begTime = this.calendarSelectedTime;
        this.activityObj.begDate = moment(this.calendarSelectedDate).format('YYYY-MM-DD');
        this.activityObj.durationDay = this.calendarSelectedDurationDay;
        this.activityObj.durationHour = this.calendarSelectedDurationHour;
        this.activityObj.durationMinute = this.calendarSelectedDurationMinute;
      }
      const constCloneActivityObj = JSON.parse(JSON.stringify(this.activityObj));
      this.cloneActivityObj = constCloneActivityObj;

      const cloneOfObject = JSON.parse(JSON.stringify(this.activityObj));
      this.activityObjTemp = cloneOfObject;
      this.activityObj.leadId = leadId;
      if (this.modalActionType == "activity") {
        $("#leadModal").modal('hide');
        $("#modal_activity").modal('show');
      }
      else if (this.modalActionType == "actitityList") {
        $("#modal_activity").modal('show');
      }
      else if (this.modalActionType == "calendarIns" || this.modalActionType == "calendarEdit") {
        $("#eventDetails").modal('hide');
        $("#modal_activity").modal('show');
      }
      else if (this.modalActionType == "leadSearch") {
        $("#modalLeadSearch").modal('hide');
        $("#modal_activity").modal('show');
        //this.modalActionType = this.leadSearchModalActionType == "calendarIns" ? "calendarIns" : this.modalActionType;
        //this.modalActionType = this.leadSearchModalActionType == "calendarEdit" ? "calendarEdit" : this.modalActionType;
        this.modalActionType = this.leadSearchModalActionType == "calendarIns" ? "calendarIns" : this.leadSearchModalActionType == "calendarEdit" ? "calendarEdit" : this.modalActionType;
      }
    },
      error => {
        console.log(error)
      })
  }
  modalActivityClose() {
    if (this.modalActionType == "leadSearch") {
      let result = this.pluginservice.compareObjects(this.activityObj, this.activityObjTemp, ["followUpActivityType", "id", "leadId", "createDate", "createdBy", "createdByName"])
      if (result) {
        if (confirm('Close without saving??')) {
          $("#modal_activity").modal('hide');
          $("#modalLeadSearch").modal('show');
          this.modalActionType = "activityList";
        }
      }
      else {
        $("#modal_activity").modal('hide');
        $("#modalLeadSearch").modal('show');
        this.modalActionType = "activityList";
      }
    }
    else if (this.modalActionType == "activity") {
      let result = this.pluginservice.compareObjects(this.activityObj, this.activityObjTemp, ["followUpActivityType", "id", "leadId", "createDate", "createdBy", "createdByName"])
      if (result) {
        if (confirm('Close without saving??')) {
          $("#modal_activity").modal('hide');
          $("#leadModal").modal('show');
        }
      }
      else {
        $("#modal_activity").modal('hide');
        $("#leadModal").modal('show');
      }
    }
    else if (this.modalActionType == "actitityList") {
      let result = this.pluginservice.compareObjects(this.activityObj, this.activityObjTemp, ["followUpActivityType", "id", "leadId", "createDate", "createdBy", "createdByName"])
      if (result) {
        if (confirm('Close without saving??')) {
          $("#modal_activity").modal('hide');
        }
      }
      else {
        $("#modal_activity").modal('hide');
      }
    }
    else if (this.modalActionType == "calendarEdit" || this.modalActionType == "calendarIns") {
      let result = this.pluginservice.compareObjects(this.activityObj, this.activityObjTemp, ["followUpActivityType", "id", "leadId", "createDate", "createdBy", "createdByName"])
      if (result) {
        if (confirm('Close without saving??')) {
          if (this.modalActionType == "calendarEdit") {
            $("#modal_activity").modal('hide');
            $("#eventDetails").modal('show');
          }
          else {
            $("#modal_activity").modal('hide');
            $("#modalLeadSearch").modal('show');
          }
        }
      }
      else {
        if (this.modalActionType == "calendarEdit") {
          $("#modal_activity").modal('hide');
          $("#eventDetails").modal('show');
        }
        else {
          $("#modal_activity").modal('hide');
          $("#modalLeadSearch").modal('show');
        }
      }
    }
  }
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
  activityAssignerChange(index, obj, ope) {
    if (ope == "add") {
      this.activityObj.assigner.push(obj);
      this.activityObj.assignerList.splice(index, 1);
    }
    else if (ope == "remove") {
      this.activityObj.assignerList.push(obj);
      this.activityObj.assigner.splice(index, 1);
    }
  }
  activityTypeChange(activityTypeId, type) {
    if (type == 'activity') {
      this.activityObj.activityTypeList.forEach((val, index) => {
        if (val.id == activityTypeId) {
          this.activityObj.durationDay = val.defaultDurationDay;
          this.activityObj.durationHour = val.defaultDurationHour;
          this.activityObj.durationMinute = val.defaultDurationMinute;
        }
      });
      const constCloneActivityObj = JSON.parse(JSON.stringify(this.activityObj));
      this.cloneActivityObj = constCloneActivityObj;
    }
    else if (type == 'followUp') {
      this.activityObj.activityTypeList.forEach((val, index) => {
        if (val.id == activityTypeId) {
          this.activityObj.followUpDurationDay = val.defaultDurationDay;
          this.activityObj.followUpDurationHour = val.defaultDurationHour;
          this.activityObj.followUpDurationMinute = val.defaultDurationMinute;
        }
      });
    }
  }
  activityCheckBegDate: string;
  activityCheckDuration: number;
  activitySaveType: string;
  chkActivityOpe: number;
  checkEvent: boolean;
  checkACtivity(type, activityObj) {
    if ((!activityObj.begTime || !activityObj.begDate) || (activityObj.durationDay == 0 && activityObj.durationHour == 0 && activityObj.durationMinute == 0)
      || (activityObj.id != 0 && this.cloneActivityObj.begTime == activityObj.begTime && this.cloneActivityObj.begDate == activityObj.begDate && this.cloneActivityObj.durationDay == activityObj.durationDay
        && this.cloneActivityObj.durationHour == activityObj.durationHour && this.cloneActivityObj.durationMinute == activityObj.durationMinute)
    ) {
      this.chkActivityOpe = 0;
      this.saveActivity(type);
    }
    else {
      this.checkedActivityData(type, activityObj)
    }
  }
  checkedActivityData(type, activityObj) {
    this.activityCheckBegDate = activityObj.begDate + ' ' + activityObj.begTime;
    this.activityCheckDuration = (activityObj.durationDay * 24 + activityObj.durationHour) * 60 + activityObj.durationMinute;
    this.reqRes.getData('/Lead/LeadCheckActivity/' + this.activityCheckBegDate + '/' + this.activityCheckDuration + '/' + activityObj.id).subscribe(
      result => {
        if (result[0].cnt == 0) {
          this.chkActivityOpe = 0;
          this.saveActivity(type);
        } else {
          this.activitySaveType = type;
          $('#modal_activity').modal('hide');
          $('#modal_check_activity').modal('show');
          this.chkActivityOpe = 1;
        }
      },
      error => {
        console.log(error)
      }
    )
  }
  checkCalendarActivity(begDate, endDate, acid) {
    this.reqRes.getData("/Lead/LeadCheckCalendarActivity/" + begDate + "/" + endDate + "/" + acid).subscribe(
      result => {
        if (result[0].cnt != 0) {
          this.checkEvent = true;
        }
        else {
          this.checkEvent = false;
        }
      },
      error => {
        console.log(error)
        this.checkEvent = false;
      }
    )
  }
  activityDateChange(date, type): void {
    if (type == 'activity') {
      if (!date) {
        this.activityObj.begTime = null;
      }
    }
    else if (type == 'followUp') {
      if (!date) {
        this.activityObj.followUpBegTime = null;
      }
    }
  }
  saveActivity(type) {
    this.disableButtons = 1;
    let activityId = this.activityObj.id;
    this.activityObj.actionType = this.modalActionType;
    this.activityObj.begTime = $('#begTime').val();
    this.reqRes.postData('/Lead/LeadActivityOperation', this.activityObj).subscribe(result => {
      let returnActivityObj = result.activityObj;
      this.disableButtons = 0;
      const cloneOfObject = JSON.parse(JSON.stringify(this.activityObj));
      this.activityObjTemp = cloneOfObject;
      if (this.modalActionType == "activity") {
        this.leadObj.activityObj = [];
        returnActivityObj.forEach((val, index) => {
          this.leadObj.activityObj.push(val);
        });
        toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        if (type == 'save') {
          if (this.chkActivityOpe == 0) {
            $('#modal_activity').modal('hide');
            $('#leadModal').modal('show');
          } else {
            $('#modal_check_activity').modal('hide');
            $('#leadModal').modal('show');
          }
          let index = this.leadData.findIndex(item => item.id == this.activityObj.leadId);
          this.leadData[index].lastContacted = result.lastContacted;
        }
        else if (type == 'saveNew') {
          if (this.chkActivityOpe == 0) {
            this.editActivity(0, this.modalActionType, this.activityObj.leadId);
          } else {
            $('[href="#tab-activity-general"]').tab('show');
            this.bindDuration();
            this.reqRes.getData('/Lead/GetActivityDetail/' + 0).subscribe(data => {
              this.activityObj = data;
              var date = new Date();
              let currentDate = date.toISOString().slice(0, 10);
              let currentTime = (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' + date.getMinutes().toString();
              this.activityObj.begTime = currentTime;
              this.activityObj.begDate = currentDate;
              if (this.newActivityOpe == 2) {
                this.activityObj.begTime = this.calendarSelectedTime;
                this.activityObj.begDate = moment(this.calendarSelectedDate).format('YYYY-MM-DD');
                this.activityObj.durationDay = this.calendarSelectedDurationDay;
                this.activityObj.durationHour = this.calendarSelectedDurationHour;
                this.activityObj.durationMinute = this.calendarSelectedDurationMinute;
              }
              const cloneOfObject = JSON.parse(JSON.stringify(this.activityObj));
              this.activityObjTemp = cloneOfObject;
            },
              error => {
                console.log(error)
              })
            $('#modal_activity').modal('hide');
            $('#modal_check_activity').modal('show');
          }
          let index = this.leadData.findIndex(item => item.id == this.activityObj.leadId);
          this.leadData[index].lastContacted = result.lastContacted;
        }
      }
      else if (this.modalActionType == "leadSearch") {
        this.getLeadData(this.tabid);
        toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        if (type == 'save') {
          if (this.chkActivityOpe == 0) {
            $('#modal_activity').modal('hide');
          } else {
            $('#modal_check_activity').modal('hide');
          }
        }
        else if (type == 'saveNew') {
          if (this.chkActivityOpe == 0) {
            this.editActivity(0, this.modalActionType, this.activityObj.leadId);
          } else {
            $('[href="#tab-activity-general"]').tab('show');
            this.bindDuration();
            this.reqRes.getData('/Lead/GetActivityDetail/' + 0).subscribe(data => {
              this.activityObj = data;
              var date = new Date();
              let currentDate = date.toISOString().slice(0, 10);
              let currentTime = (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' + date.getMinutes().toString();
              this.activityObj.begTime = currentTime;
              this.activityObj.begDate = currentDate;
              if (this.newActivityOpe == 2) {
                this.activityObj.begTime = this.calendarSelectedTime;
                this.activityObj.begDate = moment(this.calendarSelectedDate).format('YYYY-MM-DD');
                this.activityObj.durationDay = this.calendarSelectedDurationDay;
                this.activityObj.durationHour = this.calendarSelectedDurationHour;
                this.activityObj.durationMinute = this.calendarSelectedDurationMinute;
              }
              const cloneOfObject = JSON.parse(JSON.stringify(this.activityObj));
              this.activityObjTemp = cloneOfObject;
            },
              error => {
                console.log(error)
              })
            $('#modal_check_activity').modal('hide');
            $('#modal_activity').modal('show');
          }
        }
      }
      else if (this.modalActionType == "actitityList") {
        this.getLeadData(this.tabid);
        toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        if (type == 'save') {
          if (this.chkActivityOpe == 0) {
            $('#modal_activity').modal('hide');
          }
          else {
            $('#modal_check_activity').modal('hide');
          }
        }
        else if (type == 'saveNew') {
          if (this.chkActivityOpe == 0) {
            this.editActivity(0, this.modalActionType, this.activityObj.leadId);
          }
          else {
            $('[href="#tab-activity-general"]').tab('show');
            this.bindDuration();
            this.reqRes.getData('/Lead/GetActivityDetail/' + 0).subscribe(data => {
              this.activityObj = data;
              var date = new Date();
              let currentDate = date.toISOString().slice(0, 10);
              let currentTime = (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' + date.getMinutes().toString();
              this.activityObj.begTime = currentTime;
              this.activityObj.begDate = currentDate;
              if (this.newActivityOpe == 2) {
                this.activityObj.begTime = this.calendarSelectedTime;
                this.activityObj.begDate = moment(this.calendarSelectedDate).format('YYYY-MM-DD');
                this.activityObj.durationDay = this.calendarSelectedDurationDay;
                this.activityObj.durationHour = this.calendarSelectedDurationHour;
                this.activityObj.durationMinute = this.calendarSelectedDurationMinute;
              }
              const cloneOfObject = JSON.parse(JSON.stringify(this.activityObj));
              this.activityObjTemp = cloneOfObject;
            },
              error => {
                console.log(error)
              })
            $('#modal_check_activity').modal('hide');
            $('#modal_activity').modal('show');
          }
        }
      }
      else if (this.modalActionType == "calendarIns" || this.modalActionType == "calendarEdit") {
        toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        if (type == 'save') {
          if (this.chkActivityOpe == 0) {
            $(`#${'modal_activity'}`).modal('hide');
          } else {
            $('#modal_check_activity').modal('hide');
          }
          if (activityId == 0) {
            $(`#${'modal_activity'}`).modal('hide');
            returnActivityObj.forEach((val, index) => {
              this.leadData.push(val)
            });
            this.setCalendar(this.leadData);
          }
          else {
            let index = this.leadData.findIndex(item => item.id == returnActivityObj[0].id)
            this.leadData.splice(index, 1);

            returnActivityObj.forEach((val, index) => {
              this.leadData.push(val)
            });
            this.setCalendar(this.leadData);
            this.getCalendarEventData(activityId);
            $(`#${'modal_activity'}`).modal('hide');
          }
        }
        else if (type == 'saveNew') {
          if (this.chkActivityOpe == 0) {
            this.editActivity(0, this.modalActionType, this.activityObj.leadId);
          } else {
            $('[href="#tab-activity-general"]').tab('show');
            this.bindDuration();
            this.reqRes.getData('/Lead/GetActivityDetail/' + 0).subscribe(data => {
              this.activityObj = data;
              var date = new Date();
              let currentDate = date.toISOString().slice(0, 10);
              let currentTime = (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':' + date.getMinutes().toString();
              this.activityObj.begTime = currentTime;
              this.activityObj.begDate = currentDate;
              if (this.newActivityOpe == 2) {
                this.activityObj.begTime = this.calendarSelectedTime;
                this.activityObj.begDate = moment(this.calendarSelectedDate).format('YYYY-MM-DD');
                this.activityObj.durationDay = this.calendarSelectedDurationDay;
                this.activityObj.durationHour = this.calendarSelectedDurationHour;
                this.activityObj.durationMinute = this.calendarSelectedDurationMinute;
              }
              const cloneOfObject = JSON.parse(JSON.stringify(this.activityObj));
              this.activityObjTemp = cloneOfObject;
            },
              error => {
                console.log(error)
              })
            $('#modal_check_activity').modal('hide');
            $('#modal_activity').modal('show');
          }
        }
      }
    }, error => { console.log(error) })
  }

  activityAllCompleted() {
    let bool = false;
    this.activityCheckedList.forEach(function (val, key) {
      if (val.statusId != 2) {
        bool = true;
      }
    });
    return bool;
  }
  //#endregion Activity Modal
  //================================================================================//
  //#region Proposal Modal
  proposalObj: any = {
    steps: []
  };

  changeFactor() {
    this.calcTotals();
    let i = 0;
    this.proposalObj.steps.forEach((val, index) => {
      if (val.factorValue == 0 && val.factors.length != 0) {
        i++;
      }
      if (i == 0) {
        this.disableButtons = 0;
      }
      else {
        this.disableButtons = 1;
      }
    });
  }
  toDay: any = new Date();
  editProposal(id, type, leadId) {
    this.modalActionType = type;
    this.toDay = moment(new Date()).format('YYYY-MM-DD');
    this.reqRes.getData('/Lead/GetProposalDetail/' + id + '/' + leadId).subscribe(data => {
      data.steps.forEach((val, index) => {
        if (val.factors.length != 0) {
          val.factors = JSON.parse(val.factors);
        }
      });

      this.proposalObj = data;
      this.proposalObj.leadId = leadId;
      this.leadObj.customerObj.email = this.proposalObj.customerEmail;
      this.calcTotals();

      $("#pill-proposal .active").removeClass("active");
      $("#myProposalContent .active").removeClass("active show");
      $("#detail-tab").addClass('active');
      $("#tab-detail").addClass('active show');

      setTimeout(() => {
        const cloneOfObject = JSON.parse(JSON.stringify(this.proposalObj));
        this.proposalObjTemp = cloneOfObject;
        if (this.modalActionType == "proposal") {
          $("#leadModal").modal('hide');
          $("#modal_proposal").modal('show');
        }
        else if (this.modalActionType == "proposalList") {
          $("#modal_proposal").modal('show');
        }
        else if (this.modalActionType == "leadSearch") {
          $("#modalLeadSearch").modal('hide');
          $("#modal_proposal").modal('show');
        }
      }, 500);
      //if (this.modalActionType != 'afterSave') {
      $('#tab-widzard-header a[href="#bootstrap-wizard-tab1"]').tab('show');;
      $('#tab-widzard-header li').find('.nav-link').removeClass('done active').first().addClass('active');
      //}
    },
      error => {
        console.log(error)
      })
  }
  savedNewProposalOpe: number = 0;
  modalProposalClose() {
    if (this.modalActionType == "leadSearch") {
      let result = this.pluginservice.compareObjects(this.proposalObj, this.proposalObjTemp, ["createDate", "customerName", "date", "id", "leadId", "user", "discountReasonArray", "status", "templateArray", "paymentFour", "paymentOne", "paymentThree", "paymentTwo", "total", "taxAmount"])
      if (result) {
        if (confirm('Close without saving??')) {
          $('#modal_proposal').modal('hide');
          if (this.savedNewProposalOpe == 0) {
            $('#modalLeadSearch').modal('show');
          }
        }
      }
      else {
        $('#modal_proposal').modal('hide');
        if (this.savedNewProposalOpe == 0) {
          $('#modalLeadSearch').modal('show');
        }
      }
      this.modalActionType = "proposalList";
    }
    else if (this.modalActionType == "proposal") {
      let result = this.pluginservice.compareObjects(this.proposalObj, this.proposalObjTemp, ["createDate", "customerName", "date", "id", "leadId", "user", "discountReasonArray", "status", "templateArray", "paymentFour", "paymentOne", "paymentThree", "paymentTwo", "total", "taxAmount"])
      if (result) {
        if (confirm('Close without saving??')) {
          $('#modal_proposal').modal('hide');
          $('#leadModal').modal('show');
        }
      }
      else {
        $('#modal_proposal').modal('hide');
        $('#leadModal').modal('show');
      }
    }
    else if (this.modalActionType == "proposalList") {
      let result = this.pluginservice.compareObjects(this.proposalObj, this.proposalObjTemp, ["createDate", "customerName", "date", "id", "leadId", "user", "discountReasonArray", "status", "templateArray", "paymentFour", "paymentOne", "paymentThree", "paymentTwo", "total", "taxAmount"])
      if (result) {
        if (confirm('Close without saving??')) {
          $('#modal_proposal').modal('hide');
        }
      }
      else {
        $('#modal_proposal').modal('hide');
      }
    }
  }
  sendProposalMailObj: any = {};
  disableButtons: number = 0;

  mailTo: string = "";
  mailSubject: string = "";
  mailCc: string = "";
  mailBody: string = "";
  leadId: number = 0;
  proposalId: number = 0;

  openMailModal(type) {
    this.reqRes.getData('/Global/GetMailTemplate/' + type + '/' + this.proposalObj.id).subscribe(data => {
      $('#modalLeadEmail').modal('show');
      this.mailTo = this.leadObj.customerObj.email;
      this.mailSubject = data[0].subject;
      this.mailBody = data[0].template;


      tinymce.init({
        selector: '#mailBody',
        height: '30vh',
        menubar: false,
        mobile: {
          theme: 'silver',
          menubar: true,
          toolbar: 'undo redo bold italic underline styleselect'
        },
        statusbar: false,
        plugins: 'link,image,lists,table,media',
        toolbar: 'styleselect | bold italic link bullist numlist image blockquote table media undo redo',
        setup: function (editor) {
          editor.on('init', function (e) {
            editor.setContent(this.mailBody);
          });
        }
      });
      tinymce.get('mailBody').setContent(this.mailBody);
      this.leadId = this.proposalObj.leadId;
      this.proposalId = this.proposalObj.id;
      this.mailCc = '';
    });
  }

  sendMail() {
    this.disableButtons = 1;
    this.sendProposalMailObj = {
      leadId: this.leadId,
      proposalId: this.proposalId,
      subject: this.mailSubject,
      message: tinymce.get('mailBody').getContent(),
      to: this.mailTo,
      cc: this.mailCc
    }
    if (this.mailTo == "" || this.mailTo == null) {
      toastr.error('Opps Something went wrong !!!', '', { timeOut: 1000 });
      $('#modalLeadEmail').modal('hide');
      this.disableButtons = 0;
    }
    else {
      this.reqRes.postData('/Lead/SendProposalMail', this.sendProposalMailObj).subscribe(data => {
        this.leadObj.proposalObj = JSON.parse(data);
        this.disableButtons = 0;
        toastr.success('Sent Successfully !!!', '', { timeOut: 1000 });
        $('#modalLeadEmail').modal('hide');
      });
    }
  }
  saveProposal(ope) {
    this.disableButtons = 1;
    this.proposalObj.ope = ope;
    this.proposalObj.discount = this.proposalObj.discount.toString();
    this.proposalObj.taxRate = this.proposalObj.taxRate.toString();
    this.proposalObj.total = parseFloat(this.proposalObj.total);
    this.proposalObj.steps.forEach((val, index) => {
      val.factorSave = JSON.stringify(val.factors);
    });
    let oldId = this.proposalObj.id;
    this.reqRes.postData('/Lead/LeadProposalOperation', this.proposalObj).subscribe(data => {
      //data.steps.forEach((val, index) => {
      //  val.factors = JSON.parse(val.factors); 
      //});

      if (this.modalActionType == "proposal") {
        this.leadObj.proposalObj = [];
        data.forEach((val, index) => {
          if (val.newSavedOpe == 1) {
            this.proposalObj.id = val.id;
          }
          this.leadObj.proposalObj.push(val);
        });
        if (ope == 'save') {
          toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        }
      }
      else if (this.modalActionType == "leadSearch") {
        this.savedNewProposalOpe = 0;
        data.forEach((val, index) => {
          if (val.newSavedOpe == 1) {
            this.savedNewProposalOpe = 1;
            this.proposalObj.id = val.id;
          }
        });
        this.disableButtons = 0;
        this.getLeadData(this.tabid);
        if (ope == 'save') {
          this.disableButtons = 0;
          toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        }
        //$('#modal_proposal').modal('hide');
      }
      else if (this.modalActionType == "proposalList") {
        data.forEach((val, index) => {
          if (val.newSavedOpe == 1) {
            this.proposalObj.id = val.id;
          }
        });
        this.disableButtons = 0;
        this.getLeadData(this.tabid);
        if (ope == 'save') {
          toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
        }
      }
      if (ope == 'approve') {
        this.changeStatus('leadProposalStatus', this.proposalObj.id, 3, '');
        this.proposalObj.status = 'Approve';
        this.proposalObj.statusColor = 'success';
        this.proposalObj.approvedOpe = 1;
        this.proposalObj.statusId = 3
      }
      else if (ope == 'decline') {
        this.changeStatus('leadProposalStatus', this.proposalObj.id, 4, '');
        this.proposalObj.declineDate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substr(0, 8);
        this.proposalObj.status = 'Decline';
        this.proposalObj.statusColor = 'danger';
        this.proposalObj.approvedOpe = 0;
        this.proposalObj.statusId = 4
      }
      else if (ope == 'send') {
        this.sendMail()
      }

      const cloneOfObject = JSON.parse(JSON.stringify(this.proposalObj));
      this.proposalObjTemp = cloneOfObject;

      if (oldId == 0) {
        this.reqRes.getData('/Lead/GetProposalDetail/' + this.proposalObj.id + '/' + this.proposalObj.leadId).subscribe(data => {
          data.steps.forEach((val, index) => {
            if (val.factors.length != 0) {
              val.factors = JSON.parse(val.factors);
            }
          });

          this.proposalObj = data;
          this.proposalObj.leadId = data.leadId;
          this.leadObj.customerObj.email = this.proposalObj.customerEmail;
          this.calcTotals();
          setTimeout(() => {
            const cloneOfObject = JSON.parse(JSON.stringify(this.proposalObj));
            this.proposalObjTemp = cloneOfObject;
          }, 500);
          //$('#tab-widzard-header a[href="#bootstrap-wizard-tab1"]').tab('show');;
          //$('#tab-widzard-header li').find('.nav-link').removeClass('done active').first().addClass('active');
        },
          error => {
            console.log(error)
          })
      }
      this.disableButtons = 0;

    }, error => { console.log(error) })
  }
  wizardTab(tab) {
    this.prevBtn = tab;
    $("#" + tab).prevAll().find('.nav-link').removeClass('active').addClass('done');
    $("#" + tab).find('.nav-link').removeClass('done').addClass('active');
    $("#" + tab).nextAll().find('.nav-link').removeClass('done active');
    $('#tab-widzard-body  div').removeClass('active');
    $(`#bootstrap-wizard-tab${tab}`).addClass('active');
  }
  prevOrNextWizard(ope) {
    if (ope == 1) {
      $('#tab-widzard-body').find('.active').removeClass('active').prev().addClass('active');
      $('#tab-widzard-header').find('.active').removeClass('active').parent().prev().children().removeClass('done').addClass('active');
    } else {
      $('#tab-widzard-body').find('.active').removeClass('active').next().addClass('active');
      $('#tab-widzard-header').find('.active').removeClass('active').addClass('done').parent().next().children().addClass('active');
    }
    this.prevBtn = $('#tab-widzard-header').find('.active').parent().attr('id');
  }
  changeProposalTemplate(id) {
    this.proposalObj.steps = [];


    this.proposalObj.templateArray.forEach((val, index) => {
      if (val.id == id) {
        this.proposalObj.pricingTemplateOpe = val.pricingOpe;
        this.proposalObj.pricingOpe = val.pricingOpe;
      }
    });

    this.reqRes.getData('/Lead/GetProposalTemplateData/' + id).subscribe(data => {

      data.forEach((val, index) => {
        val.factors = JSON.parse(val.factors)
      });
      this.proposalObj.steps = data;

      this.calcTotals();


      let i = 0;
      this.proposalObj.steps.forEach((val, index) => {
        if (val.factorValue == 0 && val.factors.length != 0) {
          i++;
        }
        if (i == 0) {
          this.disableButtons = 0;
        }
        else {
          this.disableButtons = 1;
        }
      });
    },
      error => {
      })
  }
  calcTotals() {
    this.showStepView();
    this.proposalObj.retailPrice = 0;
    this.proposalObj.subTotal = 0;
    this.proposalObj.taxAmount = 0;
    this.proposalObj.total = 0;
    this.proposalObj.paymentOne = 0;
    this.proposalObj.paymentTwo = 0;
    this.proposalObj.paymentThree = 0;
    this.proposalObj.paymentFour = 0;
    let stepTotal = 0;
    this.proposalObj.steps.forEach((val, key) => {
      stepTotal = 0;
      if (val.factorValue == 0) {
        val.details.forEach((v, k) => {
          this.proposalObj.retailPrice += Number((v.price * parseFloat(v.qty)).toFixed(2));
          stepTotal += Number((v.price * parseFloat(v.qty)).toFixed(2));
        });
        val.total = Number(stepTotal).toFixed(2);
      }
      else {
        val.details.forEach((v, k) => {
          this.proposalObj.retailPrice += Number((v.price * parseFloat(v.qty) * parseFloat(val.factorValue)).toFixed(2));
          stepTotal += Number((v.price * parseFloat(v.qty) * parseFloat(val.factorValue)).toFixed(2));
        });
        val.total = Number(stepTotal).toFixed(2);
      }
    });
    this.proposalObj.subTotal = Number((parseFloat(this.proposalObj.retailPrice) - (parseFloat(this.proposalObj.retailPrice) / 100 * parseFloat(this.proposalObj.discount))).toFixed(2)).toFixed(2);
    this.proposalObj.taxAmount = Number(parseFloat(this.proposalObj.subTotal) / 100 * parseFloat(this.proposalObj.taxRate)).toFixed(2);
    this.proposalObj.total = Number(parseFloat(this.proposalObj.subTotal) + parseFloat(this.proposalObj.taxAmount)).toFixed(2);
    this.proposalObj.paymentOne = Number(parseFloat(this.proposalObj.total) / 100 * 20).toFixed(2);
    this.proposalObj.paymentTwo = Number(parseFloat(this.proposalObj.total) / 100 * 30).toFixed(2);
    this.proposalObj.paymentThree = Number(parseFloat(this.proposalObj.total) / 100 * 30).toFixed(2);
    this.proposalObj.paymentFour = Number(parseFloat(this.proposalObj.total) / 100 * 20).toFixed(2);
    this.proposalObj.retailPrice = Number(this.proposalObj.retailPrice).toFixed(2);
  }
  showStepView() {
    this.proposalObj.steps.forEach((val, ind) => {
      let i = 0;
      val.details.forEach((v, k) => {
        if (v.visibleOpe == false || v.qty == 0 || v.price == 0) {
          i++;
        }
        if (val.details.length == i) {
          val.show = false;
        }
        else {
          val.show = true;
        }
      });
    })
  }
  changeDiscountResultText(id) {
    this.proposalObj.discountReasonArray.forEach((val, key) => {
      if (val.id == id) {
        this.proposalObj.discountReasonText = val.name;
      }
      if (id == 0) {
        this.proposalObj.discountReasonText = '';
      }
    });
  }
  calcObj: any = {
    lnftOpe: false,
    sqftOpe: false,
    details: []
  };
  proposalStepIndex: number;
  proposalDetailIndex: number;
  itemCalculate(proposalStepIndex, proposalDetailIndex) {
    this.proposalStepIndex = proposalStepIndex;
    this.proposalDetailIndex = proposalDetailIndex;
    this.calcObj = JSON.parse(this.proposalObj.steps[proposalStepIndex].details[proposalDetailIndex].calcObj);
    $('#modalProposalCalc').modal('show');
  }
  addItemSquareDetail() {
    this.calcObj.details.push({ height: 0, length: 0 });
  }
  removeItemSquareDetail(i) {
    this.calcObj.details.splice(i, 1);
  }
  applyItemSquare() {
    if (this.calcObj.lnftOpe) {
      this.proposalObj.steps[this.proposalStepIndex].details[this.proposalDetailIndex].qty = this.getTotalLnft();
    }
    else if (this.calcObj.sqftOpe) {
      this.proposalObj.steps[this.proposalStepIndex].details[this.proposalDetailIndex].qty = this.getTotalSqft();
    }
    this.proposalObj.steps[this.proposalStepIndex].details[this.proposalDetailIndex].calcObj = JSON.stringify(this.calcObj);
    this.calcTotals();
    $('#modalProposalCalc').modal('hide');
  }
  getTotalSquare() {
    let sum = 0;
    this.calcObj.details.forEach(function (val, key) {
      sum += parseFloat(val.height == null ? 0 : val.height) + parseFloat(val.length == null ? 0 : val.length);
    });
    return parseFloat(sum.toFixed(2));
  }
  getTotalLnft() {
    let sum = 0;
    this.calcObj.details.forEach(function (val, key) {
      sum += (parseFloat(val.height == null ? 0 : val.height) + parseFloat(val.length == null ? 0 : val.length)) * 2 / 12;
    });
    return parseFloat(sum.toFixed(2));
  }
  getTotalSqft() {
    let sum = 0;
    this.calcObj.details.forEach(function (val, key) {
      sum += parseFloat(val.height == null ? 0 : val.height) * parseFloat(val.length == null ? 0 : val.length) / 144;
    });
    return parseFloat(sum.toFixed(2));
  }
  printProposal(lpId, leadId) {
    let result = this.pluginservice.compareObjects(this.proposalObj, this.proposalObjTemp, ["createDate", "customerName", "date", "id", "leadId", "user", "discountReasonArray", "status", "templateArray", "paymentFour", "paymentOne", "paymentThree", "paymentTwo", "total", "taxAmount"])
    if (result) {
      $('#modalProposalPrintWarning').modal('show');
    }
    else {
      $('#printProposalBtn').attr('disabled', 'disabled');
      let htmlPdf: any = {};
      htmlPdf.type = 'proposal';
      htmlPdf.parameters = '{"lpId":' + lpId + ',"leadId":' + leadId + '}';
      this.reqRes.postData('/Global/HtmlToPdf', htmlPdf).subscribe(data => {
        this.pluginservice.viewPDF(data, 650, 840);
        $('#printProposalBtn').removeAttr('disabled');
      });
    }
  }
  //#endregion Proposal Modal
  //================================================================================//
  //#region Lead Search Modal
  newLeadSearch(ope, type) {
    this.leadSearchModalActionType = type;
    this.modalActionType = type;
    this.newActivityOpe = ope;///???????
    this.countLeadSearch = 0;
    this.searchLeadTxt = "";
    this.LeadSearch = [];
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 500);
    this.getLeadSearch(1);
    $("#modalLeadSearch").modal('show');
  }
  onScrollLeadSearch(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
      this.countLeadSearch = this.countLeadSearch + 15;
      this.getLeadSearch(2);
    }
  }
  onSearchLead() {
    this.countLeadSearch = 0;
    this.searchLeadTxt = this.searchLeadTxt.trim();
    this.getLeadSearch(1);
  }
  getLeadSearch(timeOpe) {
    this.reqRes.getData('/Lead/GetSearchLead/15/' + this.countLeadSearch + '/' + this.searchLeadTxt).subscribe(data => {
      this.LeadSearch = (timeOpe == 1) ? this.LeadSearch = data : this.LeadSearch.concat(data);
      window.dispatchEvent(new Event('resize'));
    },
      error => {
        console.log(error)
      })
  }
  checkboxSelectLeadSearch(leadid) {
    this.LeadSearch.forEach((val, key) => {
      if (leadid == val.id) {
        if (val.ope == false) {
          val.ope = true;
        }
        else {
          val.ope = false;
        }
      }
      else {
        val.ope = false;

      }
    });
  }
  selectLead() {
    if (this.modalActionType == "activityList" || this.modalActionType == "calendarIns" || this.modalActionType == "calendarEdit") {
      let leadInfo = this.LeadSearch.find(item => item.ope == true)
      this.leadObj.id = leadInfo.id;
      $('[href="#tab-activity-general"]').tab('show');
      this.bindDuration();
      this.editActivity(0, 'leadSearch', this.leadObj.id);
    }
    else if (this.modalActionType == "proposalList") {
      let leadInfo = this.LeadSearch.find(item => item.ope == true)
      this.leadObj.id = leadInfo.id;
      this.editProposal(0, 'leadSearch', this.leadObj.id);
      $('#tab-widzard-header a[href="#bootstrap-wizard-tab1"]').tab('show');
    }
  }
  checkLeadDetail(): boolean {
    let checkedLeadSearch = this.LeadSearch.filter(function (obj) {
      return obj.ope === true;
    });
    return checkedLeadSearch.length === 0 ? true : false;
  }
  //#endregion Lead Search Modal
  //================================================================================//
  //#region Customer Search Modal
  chooseCustomerOpeType(ope) {
    this.customerOpeType = ope;
    if (ope == 1) {
      this.leadObj.customerObj = Object.assign({}, this.customerTempObj)
      this.customerViewOpe = 1;
    }
    else if (ope == 2) {
      this.customerViewOpe = 0;
      this.leadObj.customerObj.id = 0;
      this.leadObj.customerObj.firstName = '';
      this.leadObj.customerObj.lastName = '';
      this.leadObj.customerObj.company = '';
      this.leadObj.customerObj.email = '';
      this.leadObj.customerObj.phone = '';
      this.leadObj.customerObj.cellPhone = '';
      this.leadObj.customerObj.street = '';
      this.leadObj.customerObj.zipCode = '';
      this.leadObj.customerObj.city = '';
      this.leadObj.customerObj.stateProvince = '';
    }
    else if (ope == 3) {
      this.customerViewOpe = 0;
      this.leadObj.customerObj.id = 0;
      this.leadObj.customerObj.firstName = '';
      this.leadObj.customerObj.lastName = '';
      this.leadObj.customerObj.company = '';
      this.leadObj.customerObj.email = '';
      this.leadObj.customerObj.phone = '';
      this.leadObj.customerObj.cellPhone = '';
      this.leadObj.customerObj.street = '';
      this.leadObj.customerObj.zipCode = '';
      this.leadObj.customerObj.city = '';
      this.leadObj.customerObj.stateProvince = '';
    }
    if (ope == 4) {
      this.cusId = 0;
      this.customerViewOpe = 0;
      this.countCustomer = 0;
      this.searchCustomer = "";
      this.customerData = [];
      setTimeout(() => {
        this.searchElement.nativeElement.focus();
      }, 500);
      this.searchCustomer = '';
      this.getCustomerData(1);
      $('#leadModal').modal('hide');
      $('#modalCustomer').modal('show');
    }
  }
  modalCustomerClose() {
    $('#modalCustomer').modal('hide');
    $('#leadModal').modal('show');
  }
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop + 1 >= event.target.scrollHeight) {
      this.countCustomer = this.countCustomer + 15;
      this.getCustomerData(2);
    }
  }
  onSearchCustomer() {
    this.countCustomer = 0;
    this.searchCustomer = this.searchCustomer.trim();
    this.getCustomerData(1);
  }
  getCustomerData(timeOpe) {
    this.reqRes.getData('/Lead/GetCustomerData/' + this.countCustomer + '/' + this.searchCustomer.toString()).subscribe(data => {
      this.customerData = (timeOpe == 1) ? this.customerData = data : this.customerData.concat(data);
    },
      error => {
        console.log(error)
      })
  }
  checkCustomerDetail(): boolean {
    let checkedCustomer = this.customerData.filter(function (obj) {
      return obj.ope === true;
    });
    return checkedCustomer.length === 0 ? true : false;
  }
  //#endregion Customer Search Modal
  //================================================================================//
  //#region Calendar
  calendarUpd: any = {};
  calendarView: string = 'dayGridMonth';
  calendarDate: string = moment(new Date()).format('YYYY-MM-DD')
  calendarSelectedDate: any = new Date();
  calendarSelectedTime: string = '';
  calendarSelectedDurationDay: number = 0;
  calendarSelectedDurationHour: number = 0;
  calendarSelectedDurationMinute: number = 0;
  getCalendarEventData(id) {
    this.reqRes.getData('/Lead/GetLeadCalendarEvent/' + id).subscribe(data => {
      this.calendarEventData = data;
      window.dispatchEvent(new Event('resize'));
      $('#eventDetails').modal('show');
    },
      error => { console.log(error) })
  }

  setCalendar(events): void {
    var eventArray = events;
    var updateTitle = function updateTitle(title) {
      return $('.calendar-title').text(title);
    };
    var calendarEl = document.getElementById('appCalendar');
    if (calendarEl) {
      var $this = this;
      var calendar = renderCalendar(calendarEl, {
        headerToolbar: false,
        height: 800,
        initialView: $this.calendarView,
        initialDate: $this.calendarDate,
        stickyHeaderDates: true,
        views: {
          month: {
            dayMaxEvents: 2
          },
          week: {
            dayMaxEvents: 20
          },
        },
        businessHours: {
          daysOfWeek: [1, 2, 3, 4, 5, 6],
          startTime: '08:00',
          endTime: '20:00',
        },
        nowIndicator: true,
        events: eventArray,
        slotMinTime: '08:00',
        slotMaxTime: '20:00',
        selectable: true,
        eventDisplay: 'block',
        selectMirror: true,
        eventContent: function (arg) {
          $this.calendarView = arg.view.type;
          $('span').remove('.fc-list-event-dot')
          $('div').remove('.fc-daygrid-event-dot');

          let arrayOfDomNodes = []
          let eventOverdue = document.createElement('span')
          if (arg.event._def.extendedProps.overdueOpe == 1) {
            eventOverdue.classList.add('fas', 'fa-exclamation-circle', 'fs-10', 'float-left', 'cursor-pointer', 'mr-2', 'text-danger');
            eventOverdue.setAttribute("title", "Overdue activity");
          }
          else if (arg.event._def.extendedProps.status == 2) {
            eventOverdue.classList.add('fas', 'fa-check-circle', 'fs-10', 'float-left', 'cursor-pointer', 'mr-2', 'text-success');
            eventOverdue.setAttribute("title", "Completed activity");
          }

          let titleEvent = document.createElement('span')

          if (arg.event._def.title) {
            titleEvent.innerHTML = arg.event._def.title
          }
          setTimeout(function () { $('.fc-event-main').addClass('fc-event-title') })
          let leadNameEvent = document.createElement('span')
          leadNameEvent = document.createElement('span')
          if (arg.event.extendedProps.leadName) {
            leadNameEvent.innerHTML = arg.event.extendedProps.leadName;
            leadNameEvent.setAttribute("style", "  font-size: 11px !important;font-weight: 400;color: #000 !important;display: flex;");
          }
          arrayOfDomNodes = [eventOverdue, titleEvent, leadNameEvent]
          return { domNodes: arrayOfDomNodes }
        },
        eventDidMount: function (info) {
          if (info.view.type == 'listWeek') {
            info.el.getElementsByClassName("fc-list-event-time")[0].innerHTML = moment(info.event.start).format('HH:mm A');
          }
        },
        eventDataTransform: function (eventData) {
          var dur = (new Date(eventData.end)).getTime() - (new Date(eventData.start)).getTime(); //total event duration
          if (dur >= 86400000 || eventData.end == null) {
            eventData.allDay = true;
          }

          return (eventData);
        },
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: true
        },
        datesSet: function (e) {
          setTimeout(function () {
            $('div').remove('.fc-event-time');
            $('div').remove('.fc-daygrid-event-dot');
            $('span').remove('.fc-list-event-dot')
          })
        },
        eventClick: function eventClick(info) {
          $this.newActivityOpe = 0;
          $this.getCalendarEventData(info.event.id)
          window.dispatchEvent(new Event('resize'));
        },
        eventResize: function (info) {
          if (confirm("Do you confirm these changes?")) {
            $this.calendarUpd.id = parseInt(info.event.id);
            var start = new Date(info.event.start);
            var end = new Date(info.event.end);
            $this.calendarUpd.begdate = moment(start, "M/DD/YYYY hh:mm:ss A").format("MM/DD/YYYY HH:mm:ss")
            $this.calendarUpd.enddate = moment(end, "M/DD/YYYY hh:mm:ss A").format("MM/DD/YYYY HH:mm:ss")
            $this.calendarUpd.ope = 'lead';
            $this.reqRes.postData('/Global/CalendarDateUpd', $this.calendarUpd).subscribe(data => {
              let index = eventArray.findIndex(item => item.id == JSON.parse(data)[0].id)
              eventArray.splice(index, 1);
              eventArray.push(JSON.parse(data)[0])
              $this.setCalendar(eventArray)
              toastr.success('Moved successfully', '', { timeOut: 1000 });
            }, error => { console.log(error) })
          }
          else {
            info.revert();
          }
        },
        eventDrop: function (info, dayDelta, minuteDelta, allDay, revertFunc) {
          var start = new Date(info.event.start);
          var end = new Date(info.event.end);
          $this.calendarUpd.id = parseInt(info.event.id);
          $this.calendarUpd.begdate = moment(start, "M/DD/YYYY hh:mm:ss A").format("MM/DD/YYYY HH:mm:ss");
          $this.calendarUpd.enddate = moment(end, "M/DD/YYYY hh:mm:ss A").format("M/DD/YYYY HH:mm:ss");
          $this.calendarUpd.ope = 'lead';
          $this.checkCalendarActivity(moment(start, "M/DD/YYYY hh:mm:ss A").format("MM-DD-YYYY HH:mm:ss"), moment(end, "M/DD/YYYY hh:mm:ss A").format("MM-DD-YYYY HH:mm:ss"), info.event.id);

          setTimeout(function () {
            if (confirm("Do you confirm these changes?")) {
              if (calendar.currentData.currentViewType == 'dayGridMonth' || calendar.currentData.currentViewType == 'dayGridWeek') {

                if ($this.checkEvent) {
                  if (confirm("You have activity this interval!Do you want to save?")) {
                    $this.reqRes.postData('/Global/CalendarDateUpd', $this.calendarUpd).subscribe(data => {
                      let index = eventArray.findIndex(item => item.id == JSON.parse(data)[0].id)
                      eventArray.splice(index, 1);
                      eventArray.push(JSON.parse(data)[0])
                      $this.setCalendar(eventArray)
                      toastr.success('Moved successfully', '', { timeOut: 1000 });
                    }, error => { console.log(error) })
                  }
                  else {
                    info.revert();
                  }
                }
                else {
                  $this.reqRes.postData('/Global/CalendarDateUpd', $this.calendarUpd).subscribe(data => {
                    let index = eventArray.findIndex(item => item.id == JSON.parse(data)[0].id)
                    eventArray.splice(index, 1);
                    eventArray.push(JSON.parse(data)[0])
                    $this.setCalendar(eventArray)
                    toastr.success('Moved successfully', '', { timeOut: 1000 });
                  }, error => { console.log(error) })
                }
              }
              else {
                $this.reqRes.postData('/Global/CalendarDateUpd', $this.calendarUpd).subscribe(data => {
                  let index = eventArray.findIndex(item => item.id == JSON.parse(data)[0].id)
                  eventArray.splice(index, 1);
                  eventArray.push(JSON.parse(data)[0])
                  $this.setCalendar(eventArray)
                  toastr.success('Moved successfully', '', { timeOut: 1000 });
                }, error => { console.log(error) })
              }

            }
            else {
              info.revert();
            }
            if (calendar.currentData.currentViewType == 'dayGridMonth' || calendar.currentData.currentViewType == 'dayGridWeek') {
              $('div').remove('.fc-event-time')
              $('div').remove('.fc-daygrid-event-dot')
            }
            else if (calendar.currentData.currentViewType == 'listWeek') {
              $('div').remove('.fc-list-event-dot')
              $('span').remove('.fc-list-event-dot')
            }
          }, 100)


        },
        select: function (date) { 
          var start = new Date(date.start);
          var end = new Date(date.end);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          const diffHour = Math.floor(diffTime / (1000 * 60 * 60)) % 24;
          const diffMinute = Math.round(((diffTime % 86400000) % 3600000) / 60000);
          let startDate = start.toLocaleString('en-GB').split(", ")[0];
          let startTime;
          if (calendar.currentData.currentViewType == 'timeGridDay') {
            startTime = moment(start).format('hh:mm A');
          }
          else {
            startTime = moment(new Date()).format('hh:mm A');
          }
          $this.calendarSelectedDate = start;
          $this.calendarSelectedTime = startTime;
          $this.calendarSelectedDurationDay = diffDays;
          $this.calendarSelectedDurationHour = diffHour;
          $this.calendarSelectedDurationMinute = diffMinute;
          $this.newLeadSearch(2, "calendarIns");
        },
      });
      if (calendar.currentData.currentViewType == 'dayGridMonth') {
        $('div').remove('.fc-event-time')
        $('div').remove('.fc-daygrid-event-dot')
      }
      updateTitle(calendar.currentData.viewTitle);
      $(document).on('click', '[data-event]', function (_ref) {
        var currentTarget = _ref.currentTarget;
        var type = $(currentTarget).data('event');
        var calendarGetDate = new Date(calendar.getDate().setMonth(calendar.getDate().getMonth() + 1));

        $this.calendarDate = moment(calendarGetDate).format('YYYY-MM-DD');
        switch (type) {
          case 'prev':
            calendar.prev();
            $this.calendarDate = moment(calendar.currentData.currentDate).format('YYYY-MM-DD');
            updateTitle(calendar.currentData.viewTitle);
            break;
          case 'next':
            calendar.next();
            $this.calendarDate = moment(calendar.currentData.currentDate).format('YYYY-MM-DD');
            updateTitle(calendar.currentData.viewTitle);
            break;
          case 'today':
            $this.calendarDate = moment(new Date()).format('YYYY-MM-DD');
            calendar.today();
            updateTitle(calendar.currentData.viewTitle);
            break;
          default:
            calendar.today();
            break;
        }
      });
      $(document).on('click', '[data-fc-view]', function (e) {
        e.preventDefault();
        var el = $(e.currentTarget);
        var text = el.text();
        el.parent().find('.active').removeClass('active');
        el.addClass('active');
        $('[data-view-title]').text(text);
        calendar.changeView(el.data('fc-view'));
        if (calendar.currentData.currentViewType == 'dayGridMonth' || calendar.currentData.currentViewType == 'dayGridWeek') {
          $('div').remove('.fc-event-time')
          $('div').remove('.fc-daygrid-event-dot')
        }
        else if (calendar.currentData.currentViewType == 'listWeek') {
          $('div').remove('.fc-list-event-dot')
        }
        updateTitle(calendar.currentData.viewTitle);
      });
    }
  }
  //#endregion Calendar
  //================================================================================//
  //#region Filter Lead
  //filter variable
  leadSelectedFilterData: any = {};
  selectedFilterData_: any = {};
  leadFilterSavedModalData: any = [];
  fid: number = 0;
  defaultFiter: number;
  defaultFilterItem: any;
  allFilterItems: any
  //
  getFilterModalData_(type) {
    this.reqRes.getData('/Lead/GetFilterModalData/' + type).subscribe(data => {
      this.filterModalData = data;
      this.allFilterItems = this.filterModalData.filterObj;
      this.defaultFilterItem = this.allFilterItems?.find(item => item.isDefault == 1);
      this.leadFilteredBgOpe = (this.defaultFilterItem /*&& this.defaultFiter != 0*/) ? 1 : 0;
      this.defaultFiter = (this.defaultFilterItem) ? this.defaultFilterItem.id : 0;
      this.filteredProperties = (this.defaultFilterItem) ? JSON.stringify(Object.assign({}, JSON.parse(this.defaultFilterItem.filters))[0]) : '';
      this.getLeadData(1);
    },
      error => {
        console.log(error)
      })
  }

  getFilterModalData(type) {
    this.reqRes.getData('/Lead/GetFilterModalData/' + type).subscribe(data => {
      this.filterModalData = data;
      if (this.leadFilteredBgOpe == 1) {
        this.filteredDataOwners = JSON.parse(this.filteredProperties).Owners.split(',').map(i => Number(i));
        this.filteredDataStatuses = JSON.parse(this.filteredProperties).Statuses.split(',').map(i => Number(i));
        this.filteredDataProjects = JSON.parse(this.filteredProperties).Projects.split(',').map(i => Number(i));
        this.filteredDataSources = JSON.parse(this.filteredProperties).Sources.split(',').map(i => Number(i));
        this.dateFilterType = JSON.parse(this.filteredProperties).dateType.split(',').map(i => Number(i));
        if (JSON.parse(this.filteredProperties).startDate) {
          this.filteredData.startDate = JSON.parse(this.filteredProperties).startDate.split(',').map(i => Number(i));
        }
        if (JSON.parse(this.filteredProperties).endDate) {
          this.filteredData.endDate = JSON.parse(this.filteredProperties).endDate.split(',').map(i => Number(i));
        }
        if (this.defaultFiter != 0) {
          this.fid = this.defaultFiter;
        }
      }
      else {
        this.filteredDataOwners = [];
        this.filteredDataStatuses = [];
        this.filteredDataProjects = [];
        this.filteredDataSources = [];
        this.fid = 0;
      }
    },
      error => {
        console.log(error)
      })
  }

  filterOption(type) {
    //filter method for all filter operation...type is  where process is stuated
    if (type == 'Lead') {
      this.getFilterModalData(type);
      $('.select2-container--default').addClass('select2-container--bootstrap4');
      $('#modalLeadFilter').modal('show');
    }
  }

  onChangeFilterDateType() {
    if (this.dateFilterType != 1 || (this.filteredData.endDate.length == 1 && this.filteredData.startDate.length == 1)) {
      this.filteredData.startDate = '';
      this.filteredData.endDate = '';
    }
  }

  saveModalTypeOpe: number = 0;
  editLeadFilterName(id) {
    this.saveModalTypeOpe = id;
    this.reqRes.getData('/Lead/GetFilterSavedModalData/' + id + "/Lead").subscribe(data => {
      this.leadFilterSavedModalData = data[0];
    },
      error => {
        console.log(error)
      })
    $("#modalLeadFilter").modal("hide");
    $("#saveLeadFilter").modal("show");
  }

  closeModalLeadFilter() {
    $("#saveLeadFilter").modal("hide");
    $("#modalLeadFilter").modal("show");
  }

  saveLeadFilter() {
    this.filteredDataOwners = [];
    this.filteredDataStatuses = [];
    this.filteredDataProjects = [];
    this.filteredDataSources = [];

    $('#filteredDataowner').val().forEach((val, key) => { this.filteredDataOwners.push(val.split(': ')[1]) });
    $('#filteredDataStatuses').val().forEach((val, key) => { this.filteredDataStatuses.push(val.split(': ')[1]) });
    $('#filteredDataProjects').val().forEach((val, key) => { this.filteredDataProjects.push(val.split(': ')[1]) });
    $('#filteredDataSources').val().forEach((val, key) => { this.filteredDataSources.push(val.split(': ')[1]) });

    let arrayCollectData = [{
      "Owners": this.filteredDataOwners.toString(),
      "Statuses": this.filteredDataStatuses.toString(),
      "Projects": this.filteredDataProjects.toString(),
      "Sources": this.filteredDataSources.toString(),
      "dateType": this.dateFilterType.toString(),
      "startDate": (this.filteredData.startDate) ? this.filteredData.startDate.toString() : "",
      "endDate": (this.filteredData.endDate) ? this.filteredData.endDate.toString() : ""
    }];

    this.selectedFilterData_["filters"] = JSON.stringify(arrayCollectData);
    this.selectedFilterData_["name"] = this.leadFilterSavedModalData.name;
    this.selectedFilterData_["isDefault"] = (this.leadFilterSavedModalData.isDefault) ? 1 : 0;
    this.selectedFilterData_["id"] = this.leadFilterSavedModalData.id;
    this.reqRes.postData('/Lead/LeadFilterOperation', this.selectedFilterData_).subscribe(data => {
      this.closeModalLeadFilter();
      this.filteredDataOwners = JSON.parse(data[0].filters)[0].Owners.split(',').map(i => Number(i))
      this.filteredDataStatuses = JSON.parse(data[0].filters)[0].Statuses.split(',').map(i => Number(i))
      this.filteredDataProjects = JSON.parse(data[0].filters)[0].Projects.split(',').map(i => Number(i))
      this.filteredDataSources = JSON.parse(data[0].filters)[0].Sources.split(',').map(i => Number(i));
      if (this.fid == 0) {
        if (this.filterModalData.filterObj && this.saveModalTypeOpe == 0) {
          this.filterModalData.filterObj[this.filterModalData.filterObj.length] = data[0];
        } else if (!this.filterModalData.filterObj && this.saveModalTypeOpe == 0) {
          this.filterModalData.filterObj = [];
          this.filterModalData.filterObj[0] = data[0];
        }
        else {
          this.getFilterModalData('Lead');
        }
      } else {
        this.filterModalData.filterObj.find(item => item.id == this.saveModalTypeOpe).name = data[0].name
      }
      if (data[0].isDefault == 1) {
        if (this.filterModalData.filterObj) {
          if (this.filterModalData.filterObj.find(item => item.isDefault == 1)) {
            this.filterModalData.filterObj.find(item => item.isDefault == 1).isDefault = 0
          }
          this.filterModalData.filterObj.find(item => item.id == data[0].id).isDefault = 1
        } else {
          this.getFilterModalData('Lead');
        }
        //this.defaultFiter = data[0].id;
      } else {
        if (this.filterModalData.filterObj) {
          this.filterModalData.filterObj.find(item => item.id == this.saveModalTypeOpe).isDefault = 0
        }
      }
      this.fid = data[0].id;

      if (this.filterModalData.filterObj) {
        this.showSavedFiltersDetails(data[0].id)
      }
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
    }, error => { console.log(error) })
  }

  showSavedFiltersDetails(id) {
    let filters = JSON.parse(this.filterModalData.filterObj.find(item => item.id == id).filters);
    this.filteredDataOwners = filters[0].Owners.split(',').map(i => Number(i));
    this.filteredDataStatuses = filters[0].Statuses.split(',').map(i => Number(i));
    this.filteredDataProjects = filters[0].Projects.split(',').map(i => Number(i));
    this.filteredDataSources = filters[0].Sources.split(',').map(i => Number(i));
    this.dateFilterType = filters[0].dateType
    this.filteredData.startDate = filters[0].startDate
    this.filteredData.endDate = filters[0].endDate
    setTimeout(() => {
      $('#filteredDataSources').trigger('change');
      $('#filteredDataowner').trigger('change');
      $('#filteredDataProjects').trigger('change');
      $('#filteredDataStatuses').trigger('change');
      this.fid = id;
    }, 100)
    // this.filteredProperties = JSON.stringify(filters[0]);
  }

  getLeadFilterResult() {
    this.filteredDataOwners = [];
    this.filteredDataStatuses = [];
    this.filteredDataProjects = [];
    this.filteredDataSources = [];

    $('#filteredDataowner').val().forEach((val, key) => { this.filteredDataOwners.push(val.split(': ')[1]) });
    $('#filteredDataStatuses').val().forEach((val, key) => { this.filteredDataStatuses.push(val.split(': ')[1]) });
    $('#filteredDataProjects').val().forEach((val, key) => { this.filteredDataProjects.push(val.split(': ')[1]) });
    $('#filteredDataSources').val().forEach((val, key) => { this.filteredDataSources.push(val.split(': ')[1]) });

    this.leadSelectedFilterData["Owners"] = this.filteredDataOwners.toString();
    this.leadSelectedFilterData["Statuses"] = this.filteredDataStatuses.toString();
    this.leadSelectedFilterData["Projects"] = this.filteredDataProjects.toString();
    this.leadSelectedFilterData["Sources"] = this.filteredDataSources.toString();
    this.leadSelectedFilterData["dateType"] = this.dateFilterType.toString();

    if (this.filteredData.startDate) {
      this.leadSelectedFilterData["startDate"] = (this.filteredData.startDate.length == 1) ? '' : this.filteredData.startDate.toString();
    }
    if (this.filteredData.endDate) {
      this.leadSelectedFilterData["endDate"] = (this.filteredData.endDate.length == 1) ? '' : this.filteredData.endDate.toString();
    }
    //LeadFilteredBgOpe is button backgroundOpe
    if (this.filteredDataOwners.length != 0 || this.filteredDataStatuses.length != 0
      || this.filteredDataProjects.length != 0 || this.filteredDataSources.length != 0
      || this.dateFilterType != 0
    ) {
      this.leadFilteredBgOpe = 1
      this.leadFilteredOpe = 1;
    } else {
      this.leadFilteredBgOpe = 0
      this.leadFilteredOpe = 0;
    }
    this.filteredProperties = JSON.stringify(this.leadSelectedFilterData);
    this.getLeadData(1);
    this.defaultFiter = (this.fid != 0) ? this.fid : 0;
    $('#modalLeadFilter').modal('hide');
  }

  resetFilterSelect() {
    //resert selectpicker
    $("#filteredDataowner").val('').trigger('change');
    $("#filteredDataStatuses").val('').trigger('change');
    $("#filteredDataProjects").val('').trigger('change');
    $("#filteredDataSources").val('').trigger('change');
    //
    this.dateFilterType = 0;
    this.filteredData.startDate = '';
    this.filteredData.endDate = '';
    this.leadFilteredOpe = 0;
    this.leadFilteredBgOpe = 0;
    this.fid = 0;
    this.filteredProperties = '';
    //this.defaultFiter = 0;
    this.getLeadData(1);
  }

  //chooseSavedFilters() {
  //  this.leadFilteredBgOpe = (this.defaultFiter != 0) ? 1 : 0;
  //  let filter;
  //  if (this.defaultFiter != 0) {
  //    filter = Object.assign({}, JSON.parse(this.filterModalData.filterObj.find(item => item.id == this.defaultFiter).filters));
  //  }
  //  this.filteredProperties = (this.defaultFiter != 0) ? JSON.stringify(filter[0]) : '';
  //  this.getLeadData(1);
  //  this.fid = this.defaultFiter
  //}
  //#endregion Filter Lead
  //================================================================================//
  //#region Signature
  approveSignature: boolean = false;
  disableSignature: boolean = false;
  showSiqnatureModal() {
    this.approveSignature = false;
    this.disableSignature = false;
    $(".signature-pad canvas").attr("width", 466);
    $(".signature-pad canvas").attr("height", 156);
    $(".signature-Sign").attr('disabled', true);
    $('#modal_proposal').modal('hide');
    $('#modalSiqnature').modal('show');
  }

  closeSignatureModal() {
    $('#modalSiqnature').modal('hide');
    $('#modal_proposal').modal('show');
  }

  showSignature(data) {
    this.proposalObj.signatureImage = data
    this.proposalObj.approvedOpe = 1;
    this.proposalObj.statusId = 3;
    this.proposalObj.approvedDate = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().substr(0, 8);
    this.saveProposal('approve');
    this.closeSignatureModal();
  }

  agreeCondition() {
    if (this.disableSignature && this.approveSignature) {
      $(".signature-Sign").attr('disabled', false);
    }
    else {
      $(".signature-Sign").attr('disabled', true);
    }
  }
  //#endregion Signature
  //================================================================================//

}
