import { Directive, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';
declare var $: any;

@Directive({
    selector: '[appTrimLeft]'
})
export class TrimLeftDirective {
    constructor(private element: ElementRef, private ngModel: NgModel) {}
    ngOnInit() {
        let that = this;
        $(that.element.nativeElement).bind("keyup", function () {
            that.ngModel.update.emit(that.ngModel.value.trimLeft());
        });
    }
}
