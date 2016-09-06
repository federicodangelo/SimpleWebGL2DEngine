/// <reference path="../Behavior.ts" />

module s2d {
    export class UIManager extends Behavior {
        
        private _root:Transform = null;

        public get root() {
            return this._root;
        }

        public onInit() {
            this._root = this.entity.transform;
            this._root.pivotX = -1;
            this._root.pivotY = -1;
            this._root.sizeX = renderer.screenWidth;
            this._root.sizeY = renderer.screenHeight;
            this._root = this.entity.transform;
        }

        public update() {
            this._root.setSize(renderer.screenWidth, renderer.screenHeight);
        }

    }
}
