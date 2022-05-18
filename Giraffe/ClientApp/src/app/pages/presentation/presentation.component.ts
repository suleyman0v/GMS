import { Component, OnInit } from '@angular/core';
import { ReqResService } from '../../service/req-res.service';
import { PaginationInstance } from 'ngx-pagination';

declare var $: any;
declare var toastr: any;

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
  loading = false;
  presentationData: any = [];
  sortReverse: boolean;
  sortType: string;
  searchPresentation: string;
  presentationObj: any = {};
  pdfViewSrc: string = '';
  fullScreenOpe: number = 0;
  public presentationConfig: PaginationInstance = {
    id: 'presentations',
    itemsPerPage: 10,
    currentPage: 1
  };s
  constructor(private reqRes: ReqResService) { }
  ngOnInit(): void {
    this.sortReverse = true;
    this.sortType = 'createdate';
    this.getPresentationData();
  }
  getPresentationData() {
    this.loading = true;
    this.reqRes.getData('/Global/GetPresentations/Lead').subscribe(data => {
      this.loading = false;
      this.presentationData = data
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
  presentationView(file) {
    this.fullScreenOpe = 0;
    this.pdfViewSrc = file;
    $('#presentationView').modal('show');
    window.dispatchEvent(new Event('resize'));
  }

  afterRenderPresentation() {
    window.dispatchEvent(new Event('resize'));
  }
}
