import { PortletComponent } from './portlet.component';
import { PortletLayoutModule } from './../portlet-layout.module';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import {
    Component,
    Directive,
    NgModule,
    Input,
    ViewContainerRef,
    Compiler,
    ComponentFactory,
    ModuleWithComponentFactories,
    ViewChild,
    TemplateRef,
    ReflectiveInjector,
    Injector        
} from '@angular/core';

import { CommonModule } from '@angular/common';

export class DynamicPortletHelper {
    
    constructor(private compiler: Compiler,
        private vcr: Injector) { }

    createComponentFactor(html: string, ref: string): Observable<ComponentFactory<any>> {

        @Component({
            selector: `[dynamic-portlet-${ref}`,
            template: html
        })
        class DynamicPortletComp {
            @Input() data: any;
            @ViewChild(ref) _vcr: TemplateRef<any>;
        }

        @NgModule({
            imports: [CommonModule, PortletLayoutModule],
            declarations: [DynamicPortletComp, PortletComponent],
            entryComponents: [PortletComponent]
        })
        class DynamicPortletModule { }

        let p = this.compiler.compileModuleAndAllComponentsAsync(DynamicPortletModule)
            .then((mwcf: ModuleWithComponentFactories<any>) => {
                return mwcf.componentFactories.find(x => x.componentType === DynamicPortletComp);
            });

        return Observable.fromPromise(p);
    }
}