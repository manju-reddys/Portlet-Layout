import { DpHostDirective } from './portlet/dp-placeholder.directive';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  ComponentFactoryResolver
} from '@angular/core';

import * as interact from 'interactjs';

import { WidgetModel } from './widgets/widget.model';
import { PortletComponent } from './portlet/portlet.component';

@Component({
  selector: 'body',
  templateUrl: './portlet-layout.component.html',
  styleUrls: ['./portlet-layout.component.css']
})
export class PortletLayoutComponent implements OnInit, AfterViewInit {

  @Output() chartDroped = new EventEmitter<any>();
  @Input() widgets: WidgetModel[] = [];

  @ViewChildren(DpHostDirective) placeholders: QueryList<DpHostDirective>;

  private _widgetClone: HTMLElement;
  private _wIPos: string = 'relative';
  private _layoutBody: HTMLElement;



  constructor(private _element: ElementRef,
    private cdr: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver) { }

  ngOnInit() {
    this.widgets.push(new WidgetModel('PIE', '<i class="material-icons">pie_chart</i>', null));
    this.widgets.push(new WidgetModel('BUBBLE', '<i class="material-icons">bubble_chart</i>', null));
    this.widgets.push(new WidgetModel('BAR', '<i class="material-icons">assessment</i>', null));

    this._layoutBody = <HTMLElement>this
      ._element
      .nativeElement
      .querySelector('.layout-body');

    Observable.fromEvent(window, 'resize')
      .debounceTime(800)
      .subscribe(this._setPLHeight.bind(this));

    this._setPLHeight();
    this.cdr.markForCheck();
  }

  ngAfterViewInit() {
    interact('.portlet-dropzone')
      .dropzone({
        accept: '.droppable-widget',
        ondrop: this.onChartTypeDrop.bind(this)
      })
  }

  _setPLHeight() {
    let rect = this._layoutBody.getBoundingClientRect();
    (<HTMLElement>this._layoutBody.firstElementChild).style.height = rect.height + 'px';
  }

  onChartTypeDrop(event: any) {
    let dropZone = <HTMLElement>event.target,
      widget = <HTMLElement>event.relatedTarget;

    let pc = this._layoutBody.querySelector('.portlet-container');
    let context = 'ROW_1_COL_1';

    let html = `<div class="row">
                  <div dp-host [name]="${context}"></div>
                </div>`;
    pc.innerHTML = html;
    debugger;
    this.cdr.markForCheck();

    let factroy = this.cfr.resolveComponentFactory(PortletComponent);

    let directive = this.placeholders.find(x => x.name === context);

    if (directive) {
      let vcr = directive.vcr;
      if (vcr) {
        console.log(vcr);
        vcr.clear();
        vcr.createComponent(factroy);
      }
    }
  }
}