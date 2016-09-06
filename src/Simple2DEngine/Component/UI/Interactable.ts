/// <reference path="../Component.ts" />
/// <reference path="../../Event/Event.ts" />

module s2d {
    export class Interactable extends Component {

        private _enabled: boolean = true;

        public get enabled(): boolean {
            return this._enabled;
        }

        public set enabled(value: boolean) {
            this._enabled = value;
        }

        public getBounds(out:Rect) : Rect {
            return this.entity.transform.getBounds(out);
        }

        public onPointerOver(pointer:InputPointer) {

        }

        public onPointerOut(pointer:InputPointer) {

        }

        public onPointerMove(pointer:InputPointer) {

        }

        public onPointerDown(pointer:InputPointer) {

        }

        public onPointerUp(pointer:InputPointer) {

        }

    }
}