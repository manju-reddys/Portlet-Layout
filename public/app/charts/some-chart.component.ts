import {Component, Input, ElementRef, SimpleChanges} from '@angular/core';
import { BasePortletComponent } from '../base-portlet.component';

@Component({
    moduleId: module.id,
    templateUrl: 'some-chart.component.html',
    styleUrls: ['some-chart.component.css']
})

export class SomeChartComponent implements BasePortletComponent {    
    @Input() dimension: any;
    @Input() group: any;
    @Input() data: any;

    constructor(private element: ElementRef) {}

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);        
    }
}