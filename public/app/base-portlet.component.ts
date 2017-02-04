import { Type, OnChanges } from '@angular/core';

export interface BasePortletComponent extends OnChanges {    
    dimension?: any;
    group?: any;
    data: any;
}