import {
    Component,
    ElementRef,
    Input,
    Output,
    HostBinding,
    AfterViewInit,
    Renderer,
    EventEmitter
} from '@angular/core';
import * as interact from 'interactjs';
import { PortletLayoutEventListener } from '../portlet-layout.eventbus';

@Component({
    moduleId: module.id,
    selector: 'portlet',
    templateUrl: 'portlet.component.html',
    styleUrls: ['portlet.component.css']
})
export class PortletComponent implements AfterViewInit {

    @Input() pid: string;
    
    private ix: number;
    private iy: number;
    private iWidth: string;
    private iHeight: string;
    private iDisplay: string;
    private clone: HTMLElement;
    private _el: HTMLElement;
    
    @HostBinding('class') _cssClass: string = 'col-12';

    @Output() resizeStart = new EventEmitter<any>();
    @Output() onResizing = new EventEmitter<any>();
    @Output() resizeEnd = new EventEmitter<any>();

    @Output() dragStart = new EventEmitter<any>();
    @Output() drag = new EventEmitter<any>();
    @Output() dragEnd = new EventEmitter<any>();

    constructor(
        private _element: ElementRef,
        private _eb: PortletLayoutEventListener,
        private _renderer: Renderer) { }

    @Input()
    cssClass(size: number) {
        this._cssClass = `col-12 col-sm-${size}`;
    }

    ngAfterViewInit() {
        this._el = this._element.nativeElement.querySelector('.rs-widget');

        interact(this._el)
            .draggable({
                inertia: true,
                autoScroll: true,
                onstart: this.onDragStart.bind(this),
                onmove: this.onDrag.bind(this),
                onend: this.onDragEnd.bind(this)
            })
            ['allowFrom']('.drag-handler');
        interact(this._el).resizable({
            edges: {
                left: false,
                right: true,
                bottom: '.resize-s',
                top: false
            }
        })
        ['allowFrom'](this._el)
        .on('resizemove', this.onResize.bind(this));
    }

    onDragStart(event: any) {
        //let target = event.target;
        //this.clone = target.cloneNode(true);
        //this.clone.style.transform = 'scale(0.9)';
        //DomUtils.after(this.clone, target);
        let rect = this._el.getBoundingClientRect();
        //target.__threat = this.threat;
        this.ix = (parseFloat(this._el.getAttribute('dx')) || 0) + event.dx;
        this.iy = (parseFloat(this._el.getAttribute('dy')) || 0) + event.dy;
        this.iDisplay = this._el.style.position;
        //this.iHeight = this._el.style.height;
        this.iWidth = this._el.style.width;
        this._setElementStyle('width', `${rect.width}px`);
        this._setElementStyle('height', `${rect.height}px`);
        this._setElementStyle('top', `${rect.top - 50}px`);
        this._setElementStyle('position', 'absolute');
        this._setElementStyle('zIndex', '3000');
    }

    onDrag(event: any) {
        let target = this._el;
        let x = (parseFloat(target.getAttribute('dx')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('dy')) || 0) + event.dy;
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('dx', x);
        target.setAttribute('dy', y);
    }

    onDragEnd(event: any) {

        //this.clone.style.visibility = 'hidden';
        this._el.addEventListener('transitionend', this, false);
        this._setElementStyle('transform', `translate(${this.ix}px, ${this.iy}px)`);
    }

    onResizeStart(event: any) {
        this.resizeStart.emit(this._el);
    }

    onResize(event: any) {
        var target = this._el,
            x = (parseFloat(target.getAttribute('dx')) || 0),
            y = (parseFloat(target.getAttribute('dy')) || 0);

        // update the element's style
        this._setElementStyle('width', `${event.rect.width}px`);
        //this._setElementStyle('height', `${event.rect.height}px`);

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        this._setElementStyle('transform', `translate(${x}px,${y}px)`);
        this._setElementStyle('dx', `${x}`);
        this._setElementStyle('dy', `${y}`);
    }

    onResizeEnd(event: any) {
        this.resizeEnd.emit(this._el);
    }

    handleEvent(event: any, no?: boolean) {
        //DomUtils.remove(this.clone);        
        this._el.removeEventListener('transitionend', this);
        this._setElementStyle('height', null);
        this._setElementStyle('width', this.iWidth);
        this._setElementStyle('transform', null);
        this._setElementStyle('zIndex', null);
        this._setElementStyle('top', null);
        this._setElementStyle('position', this.iDisplay);
        this._el.removeAttribute('dx');
        this._el.removeAttribute('dy');
    }

    _setElementStyle(prop: string, value: string) {
        this._renderer.setElementStyle(this._el, prop, value);
    }
}