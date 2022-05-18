import { Directive, ElementRef, Input, Renderer2, SimpleChanges } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[maxLength]',
  host: { "(input)": 'onInputChange($event)' }
})
export class MaxLengthDirective {
  @Input('maxLength') maxLength: number;
  constructor(private renderer: Renderer2, private element: ElementRef) { }
  ngOnInit() {
    this.renderer.setAttribute(this.element.nativeElement, 'maxLength', this.maxLength.toString());
    let modelLength = this.element.nativeElement.value == null ? 0 : this.element.nativeElement.value.length;
    this.element.nativeElement.insertAdjacentHTML('afterend', '<div class="col-lg-12 text-right"><span id="' + this.element.nativeElement.id + 'Span" style="color: #989696;" >' + modelLength + '/' + this.maxLength + '</span></div>');
  }
  onInputChange(event) {
    let modelLength = this.element.nativeElement.value == null ? 0 : this.element.nativeElement.value.length;
    $('#' + this.element.nativeElement.id + 'Span').html(modelLength + '/' + this.maxLength);
  }
}

