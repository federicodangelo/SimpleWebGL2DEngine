module Simple2DEngine.Input {

    export class Touch {
        public id : number;
        public x : number;
        public y : number;
    }

    export class InputTouch {
        
        private engine : Simple2DEngine;

        private _touches : Array<Touch>;

        public get touches() {
            return this._touches;
        }

        constructor(engine : Simple2DEngine) {
            this.engine = engine;

            this._touches = new Array<Touch>();

            document.addEventListener("touchstart", this.onTouchStart, true);
            document.addEventListener("touchend", this.onTouchEnd, true);
            document.addEventListener("touchmove", this.onTouchMove, true);
            document.addEventListener("touchcancel", this.onTouchCancel, true);
        }

        private removeTouch(id : number) {
            for (var i = 0; i < this._touches.length; i++)
                if (this._touches[i].id === id)
                    this._touches.splice(i, 1);
        }

        private getOrCreateTouch(id : number) {
            for (var i = 0; i < this._touches.length; i++)
                if (this._touches[i].id === id)
                    return this._touches[i];

            var newTouch = new Touch();
            newTouch.id = id;
            
            this._touches.push(newTouch);

            return newTouch;
        }
        
        private updateLastPositions(ev: TouchEvent) {

            for (var i = 0; i < ev.changedTouches.length; i++) {

                var id = ev.changedTouches[i].identifier;
                var x = ev.changedTouches[i].clientX;
                var y = ev.changedTouches[i].clientY;

                var touch = this.getOrCreateTouch(id);

                if (x >= 0 && x < this.engine.renderer.screenWidth && y >= 0 && y < this.engine.renderer.screenHeight) {
                    touch.x = x;
                    touch.y = y;
                }
            }
        }

        private onTouchStart = (ev: TouchEvent) => {
            ev.preventDefault();
            this.updateLastPositions(ev);
        }

        private onTouchEnd = (ev: TouchEvent) => {
            ev.preventDefault();
            for (var i = 0; i < ev.changedTouches.length; i++)
                this.removeTouch(ev.changedTouches[i].identifier);            
        }

        private onTouchMove = (ev: TouchEvent) => {
            ev.preventDefault();
            this.updateLastPositions(ev);
        }

        private onTouchCancel = (ev: TouchEvent) => {
            ev.preventDefault();
            for (var i = 0; i < ev.changedTouches.length; i++)
                this.removeTouch(ev.changedTouches[i].identifier);            
        }
    }
}