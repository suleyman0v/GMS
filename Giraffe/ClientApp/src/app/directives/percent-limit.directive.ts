import { Directive, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
declare var $: any;

@Directive({
    selector: '[appPercentLimit]'
})
export class PercentLimitDirective {

    constructor(private element: ElementRef, private ngModel: NgModel) { }
    ngOnInit() {
        let that = this;
        $(that.element.nativeElement).bind("keyup", function () {
            if (that.ngModel.value > 100) {
                that.ngModel.update.emit(100);
            }
        });
    }

}
