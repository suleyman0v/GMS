import { Component, OnInit, HostListener, ViewChild, Input, Output, EventEmitter, ElementRef, TemplateRef } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PluginService } from '../../service/plugin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrimLeftDirective } from '../../directives/trim-left.directive';
declare var $: any;
declare var window: any;

@Component({
  selector: 'app-weblead',
  templateUrl: './weblead.component.html',
  styleUrls: ['./weblead.component.css']
})
export class WebleadComponent implements OnInit {
  webLeadObj: any = [];
  disableButton: number = 0;
  cmpn: number = 0;
  savedOpe: number = 0;
  fileUploadOpe: number = 1;
  constructor(private reqRes: ReqResService, private pluginservice: PluginService, private router: Router, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(paramMap => {
      this.cmpn = Number(paramMap.get('cmpn'));
    }); }
  ngOnInit(): void {
    this.getClientWebLead();
    window.Dropzone ? window.Dropzone.autoDiscover = false : '';
    this.setDropzone();
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
        url: '/Client/UploadFile/',
        //headers: {
        //  'Accept': 'application/json',
        //  'Content-Type': 'application/json'
        //},
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
          if (component.webLeadObj.fileObj) {
            $.each(component.webLeadObj.fileObj, function (index, item) {
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
            if (component.webLeadObj.fileObj) {
              component.webLeadObj.fileObj.forEach((val, key) => {
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
            formData.append('company', component.cmpn);
          });
          thisDropzone.on('success', function (file, response) {
            file.serverUrl = response[0].url;
            component.webLeadObj.fileObj.push(response[0]);
          });
          thisDropzone.on("removedfile", function (file) {
            component.webLeadObj.fileObj.forEach((val, key) => {
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
      },userOptions);
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
  getClientWebLead() {
    let url = '/Client/GetWebLeadData/' + this.cmpn;
    console.log(url)
    this.reqRes.getData(url).subscribe(
      result => {
        console.log(result)
        this.webLeadObj = result;
      },
      error => {
        console.log(error)
      }
    )
  }
  saveWebLead() {
    this.disableButton = 1;
    this.webLeadObj.cmpn = this.cmpn;
    if (this.webLeadObj.budget == "" || this.webLeadObj.budget == null) {
      this.webLeadObj.budget = 0;
    }
    this.reqRes.postData('/Client/ClientWebLeadData', this.webLeadObj).subscribe(data => {
      this.disableButton = 0;
      this.savedOpe = 1;
      setTimeout(function () { window.location.reload();}, 3000);
    }, error => { console.log(error); this.disableButton = 0; })
  }
  newLead() {
    this.savedOpe = 0;
    this.webLeadObj = [];
    this.getClientWebLead();
    window.Dropzone ? window.Dropzone.autoDiscover = false : '';
    this.setDropzone();
  }
}
