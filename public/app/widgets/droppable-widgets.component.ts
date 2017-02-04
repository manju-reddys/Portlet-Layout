import { WidgetModel } from './widget.model';
import {
    Component,
    ElementRef,
    OnInit,
    AfterViewInit,
    Input
} from '@angular/core';
import * as interact from 'interactjs';

@Component({
    moduleId: module.id,
    selector: 'widgets',
    templateUrl: 'droppable-widgets.component.html',
    styleUrls: ['droppable-widgets.component.css']
})
export class WidgetsComponent implements OnInit, AfterViewInit {
    private _clone: HTMLElement;
    private _el: HTMLElement;
    private _wIPos: string = 'relative';

    @Input() widgets: WidgetModel[];    

    constructor(private element: ElementRef) { }

    ngOnInit() {
        this._el = this.element.nativeElement;
    }

    ngAfterViewInit() {
        interact('.droppable-widget', {
            context: this._el
        }).draggable({
            inertia: true,
            autoScroll: true,
            restrict: {
                restriction: '.portlet-container',
                endOnly: true,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            onstart: (event: any) => {
                this.onDragStart(event);
            },
            onmove: this.onDragMove,
            onend: (event: any) => {
                this.onDragEnd(event);
            }
        });

        interact(<HTMLElement>this._el.querySelector('.list-group'))
        .draggable({
            inertia: true,
            onmove: this.onDragMove
        })['allowFrom']('.w-m');
    }

    onDragStart(event: any) {
        let target = <HTMLElement>event.target;
        let parent = target.parentNode;
        this._clone = <HTMLElement>target.cloneNode(true);
        this._wIPos = target.style.position;        

        target.style.zIndex = '3000';
        target.style.position = 'absolute';        

        parent.insertBefore(this._clone, target.nextSibling);
        this._clone.style.transform = 'scale(0.8)';
    }

    onDragMove(event: any) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('dx')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('dy')) || (target.getAttribute('data-index') * 80)) + event.dy;

        // translate the element
        target.style.transform = `translate(${x}px, ${y}px)`;

        // update the posiion attributes
        target.setAttribute('dx', x);
        target.setAttribute('dy', y);
    }

    onDragEnd(event: any) {
        let target = event.target;
        target.style.transform = null;        
        target.style.zIndex = null;
        target.removeAttribute('dx');
        target.removeAttribute('dy');
        target.style.position = this._wIPos;

        let parent = this._clone.parentNode;
        parent.removeChild(this._clone);
        this._clone = null;
    }

    toggleWidgets(ev: any) {
        this._el.querySelector('.list-group').classList.toggle('hide-list');
    }

    setWidget(event: any, widget: WidgetModel) {
        event.currentTarget.__widget = widget;
    }
}
