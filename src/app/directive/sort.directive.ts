import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  HostListener,
} from '@angular/core';

import { Sort } from '../util/sort';

@Directive({
  selector: '[appSort]',
})
export class SortDirective {
  @Input() appSort!: Array<any>;

  constructor(private renderer: Renderer2, private targetElement: ElementRef) {}

  @HostListener('click')
  sortData() {
    const sort = new Sort();

    const elem = this.targetElement.nativeElement;

    const order = elem.getAttribute('data-order');

    const type = elem.getAttribute('data-type');

    const property = elem.getAttribute('data-name');

    const parent = elem.getAttribute('data-parent');

    this.appSort.sort(sort.startSort(parent, property, order, type));
    elem.parentNode.querySelectorAll('i').forEach((element: any) => {
      element.classList.add('d-none');
    });
    elem.querySelector('i')?.classList.remove('d-none');
/*
    if (order === 'desc') {
      elem.querySelector('i')?.classList.remove('fa-angle-up');
      elem.querySelector('i')?.classList.add('fa-angle-down');
      elem.setAttribute('data-order', 'asc');
    } else {
      elem.querySelector('i')?.classList.remove('fa-angle-down');
      elem.querySelector('i')?.classList.add('fa-angle-up');
      elem.setAttribute('data-order', 'desc');
    }
*/
  }
}
