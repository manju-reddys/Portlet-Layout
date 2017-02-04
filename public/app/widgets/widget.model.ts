import {Type} from '@angular/core';

export class WidgetModel {

    constructor(private type: string,
                private iconHtml: string,
                private component?: Type<any>,
                private data?: any){}

    getType(): string {
        return this.type;
    }

    getIconHtml(): string {
        return this.iconHtml;
    }

    getComponent(): Type<any> {
        return this.component;
    }

    setData(data: any) {
        this.data = data;
    }

    getData(): any {
        return this.data;
    }
}