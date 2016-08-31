/// <reference path="InputMouse.ts" />
/// <reference path="InputTouch.ts" />

module s2d {

    export class InputManager {

        private _inputTouch: InputTouch;
        private _inputMouse: InputMouse;
        private _inputPointer: InputPointer;

        private _lastInteractableDown: Interactable = null;

        public get pointerDown(): boolean {
            return this._inputMouse.isDown || this._inputTouch.touches.length > 0;
        }

        public get pointerX(): number {
            if (this._inputMouse.isDown)
                return this._inputMouse.x;

            if (this._inputTouch.touches.length > 0)
                return this._inputTouch.touches[0].x;

            return 0;
        }

        public get pointerY(): number {
            if (this._inputMouse.isDown)
                return this._inputMouse.y;

            if (this._inputTouch.touches.length > 0)
                return this._inputTouch.touches[0].y;

            return 0;
        }

        public get pointer(): InputPointer {
            return this._inputPointer;
        }

        constructor() {
        }

        public init() {
            this._inputTouch = new InputTouch();
            this._inputMouse = new InputMouse();
            this._inputPointer = new InputPointer();
        }

        public update(): void {
            this.updatePointer();

            let newInteractable = this.getInteractableUnderPointer();
            let pointer = this._inputPointer;

            if (pointer.down) {

                if (pointer.downFrames === 0) {
                    
                    if (newInteractable !== null) {
                        this._lastInteractableDown = newInteractable;
                        newInteractable.onPointerDown(pointer);
                    }

                }

            } else {

                if (this._lastInteractableDown !== null) {
                    var tmp = this._lastInteractableDown;
                    this._lastInteractableDown = null;
                    tmp.onPointerUp(pointer);
                }
            }
            
        }

        private updatePointer(): void {

            let inputPointer = this._inputPointer;

            let x = this.pointerX;
            let y = this.pointerY;
            let down = this.pointerDown;

            inputPointer.delta[0] = x - inputPointer.position[0];
            inputPointer.delta[1] = y - inputPointer.position[1];

            inputPointer.position[0] = x;
            inputPointer.position[1] = y;

            if (inputPointer.down && down) {
                inputPointer.downFrames++;
            } else {
                inputPointer.down = down;
                inputPointer.downFrames = 0;
            }
        }

        private tmpInteractables: Array<Interactable> = new Array<Interactable>(1024);
        private tmpRect: Rect = Rect.create();

        public getInteractableUnderPointer(): Interactable {

            let rect = this.tmpRect;
            let pointer = this._inputPointer;
            let interactables = this.tmpInteractables;
            let interactablesCount = entities.getComponentInChildren(Interactable, interactables);

            for (let i = 0; i < interactablesCount; i++) {
                let interactable = interactables[i];

                if (interactable.enabled)
                    if (Rect.containts(interactable.getBounds(rect), pointer.position[0], pointer.position[1]))
                        return interactable;
            }

            return null;
        }
    }
}