import { DpHostDirective } from './portlet/dp-placeholder.directive';
import { PortletLayoutEventListener } from './portlet-layout.eventbus';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PortletLayoutComponent } from './portlet-layout.component';
import { PortletComponent } from './portlet/portlet.component';
import { WidgetsComponent } from './widgets/droppable-widgets.component';
import { BasePortletsModule } from './base-portlets.module';
import { SomeChartComponent } from './charts/some-chart.component';

@NgModule({
  declarations: [
    PortletLayoutComponent,
    WidgetsComponent,
    PortletComponent,
    DpHostDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BasePortletsModule.withComponents([PortletComponent])
  ],
  providers: [PortletLayoutEventListener],
  bootstrap: [PortletLayoutComponent]
})
export class PortletLayoutModule { }