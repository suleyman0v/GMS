import { Component, OnInit, ViewChild } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';
import { PluginService } from '../../service/plugin.service';
import { AuthService } from '../../service/auth/auth.service'
declare var $: any;
declare var toastr: any;
@Component({
  selector: 'app-presentation-setting',
  templateUrl: './presentation-setting.component.html',
  styleUrls: ['./presentation-setting.component.css']
})
export class PresentationSettingComponent implements OnInit {
  loading = false;
  presentationData: any = [];
  sortReverse: boolean;
  sortType: string;
  searchPresentation: string;
  presentationObj: any = {};
  presentationObjTemp: any;
  disableButton: number = 0;
  fileToUpload: File = null;
  presentationFile: string = '';
  fileType: number = 0;
  presentationFileOpe: number = 0;
  fileUpload: any = {};
  fullScreenOpe: number = 0;
  //del variables
  delId: number;
  delType: string;
  delCount: number;
  delBulkArray: any = [];
  delType2: string;
  public presentationConfig: PaginationInstance = {
    id: 'presentations',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(private reqRes: ReqResService, private pluginservice: PluginService, private authService: AuthService,) { }
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getPresentationData();
  }
  handleFileInput(files: FileList) {
    if (files) {
      this.fileToUpload = files.item(0);
    }
    if (this.fileToUpload.type == "application/pdf") {
      //Centilmens , file upload working  -Only- formdata in Angular
      const formData: FormData = new FormData();
      formData.append('type', "Pdf");
      formData.append('company', '1');
      formData.append('collection', files.item(0), files.item(0).name);
      //
      this.reqRes.postData('/Global/UploadFile', formData).subscribe(data => {
        this.presentationObj.file = data[0].url
      }, error => { console.log(error) })
    }
    else {
      this.presentationObj.file = '';
      this.presentationFileOpe = 0;
    }
    this.fileType = (this.fileToUpload.type == "application/pdf") ? 0 : 1;
  }
  modalPresentationClose() {
    let result = this.pluginservice.compareObjects(this.presentationObj, this.presentationObjTemp, ["id", "userRoles"])
    if (result) {
      if (confirm('Close without saving??')) {
        $('#presentationModal').modal('hide');
      }
    }
    else {
      $('#presentationModal').modal('hide');
    }
  }
  getPresentationData() {
    this.loading = true;
    this.fileType = 0;
    this.reqRes.getData('/Global/GetPresentations/').subscribe(data => {
      this.loading = false;
      this.presentationData = data
      this.pluginservice.setBulkActions('#presentationBulk');
    },
      error => {
        console.log(error)
      })
  }
  fullScreenOperation(ope) {
    if (ope == 1) {
      $(".pdf-container").css("height", "70vh");
      $("#presentationView .modal-dialog").removeClass("max-w-100 m-0").addClass("pdf-view-modal-width");
      $("#presentationView .presentation-modal-content").addClass("presentation-normal-size-border");
      this.fullScreenOpe = 0
    } else {
      $(".pdf-container").css("height", "auto");
      $("#presentationView .modal-dialog").removeClass("pdf-view-modal-width").addClass("max-w-100 m-0");
      $("#presentationView .presentation-modal-content").removeClass("presentation-normal-size-border");
      this.fullScreenOpe = 1;
    }
    window.dispatchEvent(new Event('resize'));
  }
  savePresentation() {
    this.disableButton = 1;
    this.reqRes.postData('/Settings/SavePresentationOperation', this.presentationObj).subscribe(data => {
      this.disableButton = 0;
      toastr.success('Saved Successfully !!!', '', { timeOut: 1000 });
      $("#presentationModal").modal('hide');
      this.getPresentationData()
    }, error => { console.log(error) })
  }
  editPresentation(id) {
    this.fullScreenOpe = 0;
    this.reqRes.getData('/Settings/GetPresentationEditData/' + id).subscribe(data => {
      this.presentationObj = data;
      this.presentationFile = this.presentationObj.file
      this.presentationFileOpe = (this.presentationObj.file) ? 1 : 0;
      //Clone User Modal Information to Temp Obj //
      const cloneOfObject = JSON.parse(JSON.stringify(this.presentationObj));
      this.presentationObjTemp = cloneOfObject;
      /////////////////////////////////////////////
      $("#presentationModal").modal('show');
    },
      error => { console.log(error); })
  }
  pdfViewSrc: string = '';
  presentationView(file) {
    this.pdfViewSrc = file;
    console.log(this.pdfViewSrc)
    $('#presentationView').modal('show');
    window.dispatchEvent(new Event('resize'));
  }
  afterRenderPresentation() {
    window.dispatchEvent(new Event('resize'));
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
      if (param == 'presentation' && status == -1) {
        let index = this.presentationData.findIndex(item => item.id == id);
        this.presentationData.splice(index, 1);
        toastr.success('Deleted Successfully !!!', '', { timeOut: 1000 });
      }
      else if (param == 'presentation') {
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
      if (type == "presentationStatus") {
        this.getPresentationData();
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
