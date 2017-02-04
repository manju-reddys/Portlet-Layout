import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
    selector: '[dp-host]'
})

export class DpHostDirective {
    @Input() name: string;
    constructor(public vcr: ViewContainerRef) {}
}