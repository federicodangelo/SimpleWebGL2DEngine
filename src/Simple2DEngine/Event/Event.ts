// C# like event dispatcher, based on ts-event library by Rogier Schouten<github@workingcode.ninja>
// original source code: https://github.com/rogierschouten/ts-events

module s2d {

    class Listener<T> {
        public deleted: boolean = false;
        public handler: (data: T) => void = null;
        public boundTo: Object = null;
        public fireOnlyOnce: boolean = false;

        constructor(handler: (data: T) => void, boundTo: Object, fireOnlyOnce: boolean) {
            this.handler = handler;
            this.boundTo = boundTo;
            this.fireOnlyOnce = fireOnlyOnce;
        }

        public equals(handler: (data: T) => void, boundTo: Object) {
            return handler === this.handler && boundTo === this.boundTo;
        }
    }

    export class Event<T> {

        /**
         * Maximum number of times that an event handler may cause the same event
         * recursively.
         */
        public static MAX_RECURSION_DEPTH: number = 10;

        /**
         * Recursive post() invocations
         */
        private _recursion: number = 0;

        /**
         * Attached listeners. NOTE: do not modify.
         * Instead, replace with a new array with possibly the same elements. This ensures
         * that any references to the array by events that are underway remain the same.
         */
        private _listeners: Array<Listener<T>> = null;

        /**
         * The number of attached listeners
         */
        public get listenerCount(): number {
            return (this._listeners !== null ? this._listeners.length : 0);
        }
        

        /**
         * Attach an event handler that will be called every time that this event is triggered.
         * @param handler The function to call. The this argument of the function will be this object.
         * @param boundTo The "this" context of the function. Can be null.
         */
        public attach(handler: (data: T) => void, boundTo: Object = null): void {

            if (this._listeners === null) {
                this._listeners = new Array<Listener<T>>();
            } else {
                if (this._recursion > 0) {
                    // make a copy of the array so events that are underway have a stable local copy
                    // of the listeners array at the time of post()
                    this._listeners = this._listeners.slice();
                }
            }
            
            this._listeners.push(new Listener<T>(handler, boundTo, false));
        }

        /**
         * Attach an event handler that will be called only once.
         * @param handler The function to call. The this argument of the function will be this object.
         * @param boundTo The "this" context of the function. Can be null.
         */
        public attachOnlyOnce(handler: (data: T) => void, boundTo: Object = null): void {

            if (this._listeners === null) {
                this._listeners = new Array<Listener<T>>();
            } else {
                if (this._recursion > 0) {
                    // make a copy of the array so events that are underway have a stable local copy
                    // of the listeners array at the time of post()
                    this._listeners = this._listeners.slice();
                }
            }
            
            this._listeners.push(new Listener<T>(handler, boundTo, true));
        }

        /**
         * Detach all listeners with the given handler function
         */
        public detach(handler: (data: T) => void, boundTo: Object = null): void {

            if (this.listenerCount === 0)
                return;

            // remove listeners AND mark them as deleted so subclasses don't send any more events to them
            let listeners = this._listeners;
            
            if (this._recursion > 0) {
                // make a copy of the array so events that are underway have a stable local copy
                // of the listeners array at the time of post()
                this._listeners = listeners.filter((listener: Listener<T>): boolean => {
                    if (listener.equals(handler, boundTo)) {
                        listener.deleted = true;
                        return false;
                    }
                    return true;
                });
            } else {

                //Not posting, no need to make a copy of the array
                for (let i = listeners.length - 1; i >= 0; i--) {
                    let listener = listeners[i];
                    if (listener.equals(handler, boundTo)) {
                        //listener.deleted = true; //no one is posting, no need to mark as deleted sine there is no other reference
                        listeners.splice(i, 1);
                    }
                }
            }

            if (this._listeners.length === 0)
                this._listeners = null;
        }

        /**
         * Send the event. Handlers are called immediately and synchronously.
         */
        public post(data: T): void {

            if (this.listenerCount === 0)
                return;

            if (Event.MAX_RECURSION_DEPTH > 0 && this._recursion + 1 > Event.MAX_RECURSION_DEPTH) {
                EngineConsole.error("Max recursion depth reached");
                return;
            }

            this._recursion++;
            
            let listeners = this._listeners;
            let listenersToRemove:Array<Listener<T>> = null;

            for (let i = 0; i < listeners.length; i++) {
                let listener = listeners[i];
                if (!listener.deleted) {
                    if (listener.fireOnlyOnce) {
                        listener.deleted = true; //mark as deleted so it won be fired again by another nested call
                        if (listenersToRemove === null)
                            listenersToRemove = new Array<Listener<T>>();
                        listenersToRemove.push(listener);
                    }
                    listener.handler.call(listener.boundTo, data);
                }
            }

            this._recursion--;

            //Remove any listener that was set as "fireOnlyOnce"
            if (listenersToRemove != null) {

                //Update listeners reference, could have been be updated in any of the callbacks
                listeners = this._listeners;

                if (this._recursion > 0 || listenersToRemove.length > 1) {
                    //Make a copy of the array so events that are underway have a stable local copy
                    //of the listeners array at the time of post()
                    //We also use this method if we need to remove more than one listener, to prevent multiple calls to splice()
                    this._listeners = listeners.filter((listener: Listener<T>): boolean => {
                        if (listenersToRemove.indexOf(listener) >= 0) {
                            listener.deleted = true;
                            return false;
                        }
                        return true;
                    });
                } else {
                    //Not posting, no need to make a copy of the array
                    for (let i = listeners.length - 1; i >= 0; i--) {
                        let listener = listeners[i];
                        if (listenersToRemove.indexOf(listener) >= 0) {
                            //listener.deleted = true; //no one is posting, no need to mark as deleted sine there is no other reference
                            listeners.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    /**
     * Convenience class for events without data
     */
    export class VoidEvent extends Event<void> {

        /**
         * Send the event.
         */
        public post(): void {
            super.post(undefined);
        }
    }

    /**
     * Similar to 'error' event on EventEmitter: throws when a post() occurs while no handlers set.
     */
    export class ErrorEvent extends Event<Error> {

        public post(data: Error): void {
            if (this.listenerCount === 0) {
                EngineConsole.error(`error event posted while no listeners attached. Error: ${data.message}`);
                return;
            }
            super.post(data);
        }
    }
}
