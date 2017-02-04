import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


export interface IEventSubscription<T> {
    add(key: string, value: T);
    containsKey(key: string): boolean;
    getHandler(key: string): T;
    keys(): string[];
    remove(key: string);
}

export class EventSubscription<T> implements IEventSubscription<T> {
    private items: { [index: string]: T } = {};
    private count: number = 0;

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public add(key: string, value: T) {
        if (this.items[key]) {
            this.items[key] = value;
        } else {
            this.items[key] = value;
            this.count++;
        }
    }

    public remove(key: string) {
        delete this.items[key];
        this.count--;
    }

    public getHandler(key: string): T {
        return name ? this.items[key] : null;
    }

    public keys(): string[] {
        var keySet: string[] = [];

        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }
}

@Injectable()
export class PortletLayoutEventListener {
    private _listener = new EventSubscription<ReplaySubject<any>>();

    /**
     * Register a emitter that emit the events to which others can subscribe.
     * any space in the name will be reeplaced with _ but maintains the case.
     * @param {string} name Name of the event. If there is listner already exist
     * with the same name it will be returned.
     * @param {number} [bufferSize] history of the events to be emit to the subscribe
     * when it subscribe for the first time.
     * @returns {ReplaySubject<any>} use this to emit the events;
     * 
     * @memberOf PortletLayoutEventListener
     */
    emitter(name: string, bufferSize?: number): ReplaySubject<any> {
        if (name) {
            name = name.replace(/\s+/g, '_');
            if (this._listener.containsKey(name)) {
                return this._listener.getHandler(name);
            } else {
                let subject = new ReplaySubject(bufferSize > 0 ? bufferSize : 0);
                this._listener.add(name, subject);
                return subject;
            }
        } else {
            return null;
        }
    }


    /**
     * Subscribe to the event emittor. Depending on buffer size, on subscribe will 
     * recive the history events also. After first events then after recieves only
     * current EventSubscription.
     * 
     * @param {string} name Event name to be be subscribe
     * @param {(value: any) => {}} handler Must be Function which will be get called
     * on event.
     * @returns {Subscription} Use this to unsubscribe to prevent memory leaks. If name
     * of the event is not found then this will be NULL
     * @memberOf PortletLayoutEventListener
     */
    listen(name: string, handler: (value: any) => {}): Subscription {
        let subscribe: ReplaySubject<any>;
        if (name) {
            name = name.replace(/\s+/g, '_');
            if ((subscribe = this._listener.getHandler(name))) {
                return subscribe.subscribe(handler);
            }
        }
        return null;
    }

    /**
     * remove the listner
     * 
     * @param {string} name Name of the event listener to be removed;
     * 
     * @memberOf PortletLayoutEventListener
     */
    off(name: string): void {
        if (name) {
            name = name.replace(/\s+/g, '_');
            let subscribe: ReplaySubject<any>;
            if ((subscribe = this._listener.getHandler(name))) {
                subscribe.unsubscribe();
                this._listener.remove(name);
            }
        }
    }
}