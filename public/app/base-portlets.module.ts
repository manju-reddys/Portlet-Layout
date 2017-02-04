import { NgModule, ANALYZE_FOR_ENTRY_COMPONENTS} from '@angular/core';
import { BasePortletComponent } from './base-portlet.component';

@NgModule({})
export class BasePortletsModule {
    static withComponents(components: any[]) {
        return {
            ngModule: BasePortletsModule,
            providers: [{
                provide: ANALYZE_FOR_ENTRY_COMPONENTS, 
                useValue: components, 
                multi: true
            }]
        }
    }
}