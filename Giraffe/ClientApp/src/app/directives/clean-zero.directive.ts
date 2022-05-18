import { Directive, ElementRef} from '@angular/core';
import { NgModel } from '@angular/forms';
declare var $: any;

@Directive({
  selector: '[appCleanZero]'
})
export class CleanZeroDirective {
  constructor(private element: ElementRef, private ngModel: NgModel) { }
  ngOnInit() {
    let that = this;
    $(that.element.nativeElement).bind("click", function () {
      if (that.ngModel.value == 0) {
        that.ngModel.update.emit('');
      } else {
        $(that.element.nativeElement).select();
      }
    });
    $(that.element.nativeElement).bind("focusout", function () {
      if (!that.ngModel.value) {
        that.ngModel.update.emit(0);
      }
    });
    $(that.element.nativeElement).bind("keyup", function () {
      if (that.ngModel.value < 0) {
        that.ngModel.update.emit(0);
      }
    });
  }

}
