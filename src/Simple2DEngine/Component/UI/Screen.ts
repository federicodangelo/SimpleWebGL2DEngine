/// <reference path="../Behavior.ts" />

module s2d {
    export class Screen extends Behavior {

        protected trans:Transform = null;

        protected onInit() {

            this.trans = this.entity.transform;

            this.trans.parent = s2d.ui.root;
            this.trans.pivotX = -1;
            this.trans.pivotY = -1;
            this.trans.sizeX = renderer.screenWidth;
            this.trans.sizeY = renderer.screenHeight;

            this.onScreenInit();
        }

        protected onScreenInit() {
            
        }
        
        public update() {
            //Always match parent size!!
            this.trans.size = this.trans.parent.size;
            this.onScreenUpdate();
        }

        protected onScreenUpdate() {

        }
    }
}
