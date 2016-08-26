/// <reference path="InputMouse.ts" />
/// <reference path="InputTouch.ts" />

module s2d {

    export class InputManager {

        private inputTouch : Input.InputTouch;
        private inputMouse : Input.InputMouse;

        public get pointerDown() : boolean {
            return this.inputMouse.isDown || this.inputTouch.touches.length > 0;
        }

        public get pointerX() : number {
            if (this.inputMouse.isDown)
                return this.inputMouse.x;

            if (this.inputTouch.touches.length > 0)
                return this.inputTouch.touches[0].x;

            return 0;
        }

        public get pointerY() : number {
            if (this.inputMouse.isDown)
                return this.inputMouse.y;

            if (this.inputTouch.touches.length > 0)
                return this.inputTouch.touches[0].y;

            return 0;
        }

        constructor() {
        }

        public init() {
            this.inputTouch = new Input.InputTouch();
            this.inputMouse = new Input.InputMouse();
        }

        public update() : void {
            //Nothing to do..
        }
    }
}