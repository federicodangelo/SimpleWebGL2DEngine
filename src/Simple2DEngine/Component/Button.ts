/// <reference path="Interactable.ts" />

module s2d {
    export class Button extends Interactable {
        private _onClick : SyncEvent<Button> = new SyncEvent<Button>();

        public get onClick() {
            return this._onClick;
        }

        public onPointerUp(pointer:InputPointer) {
            this._onClick.post(this);
        }
    }
}