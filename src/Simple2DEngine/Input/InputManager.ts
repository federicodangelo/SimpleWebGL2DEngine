/// <reference path="InputMouse.ts" />
/// <reference path="InputTouch.ts" />

module s2d {

    export class InputManager {

        private _inputTouch: InputTouch;
        private _inputMouse: InputMouse;
        private _inputPointer: InputPointer;

        private _lastInteractableDown: Interactable = null;
        private _lastPointerX: number = 0;
        private _lastPointerY: number = 0;

        public get pointerDown(): boolean {
            return this._inputMouse.isDown || this._inputTouch.touches.length > 0;
        }

        public get pointerX(): number {
            if (this._inputMouse.isDown || this._inputMouse.moved)
                this._lastPointerX = this._inputMouse.x;
            else if (this._inputTouch.touches.length > 0)
                this._lastPointerX = this._inputTouch.touches[0].x;

            return this._lastPointerX;
        }

        public get pointerY(): number {
            if (this._inputMouse.isDown || this._inputMouse.moved)
                this._lastPointerY = this._inputMouse.y;
            else if (this._inputTouch.touches.length > 0)
                this._lastPointerY = this._inputTouch.touches[0].y;

            return this._lastPointerY;
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

            let newInteractable: Interactable = this.getInteractableUnderPointer();
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

            this._inputMouse.resetMoved();
        }

        private tmpInteractables: Array<Interactable> = new Array<Interactable>(1024);
        private tmpRect: Rect = Rect.create();

        public getInteractableUnderPointer(pointerX:number = -1, pointerY:number = -1): Interactable {

            let rect = this.tmpRect;
            let pointer = this._inputPointer;
            let interactables = this.tmpInteractables;
            let interactablesCount = entities.getComponentsInChildren(Interactable, interactables);

            if (pointerX === -1)
                pointerX = pointer.position[0];

            if (pointerY === -1)
                pointerY = pointer.position[1];

            //Iterate from bottom to top, since the last drawn items will be on top and we want those first
            for (let i = interactablesCount - 1; i >= 0; i--) {
                let interactable = interactables[i];

                if (interactable.enabled)
                    if (Rect.containts(interactable.getBounds(rect), pointerX, pointerY))
                        return interactable;
            }

            return null;
        }
    }
}