/// <reference path="Entity.ts" />

module s2d {
    
    export class EntityManager {

        private _root : Transform = new Transform();

        public get root() {
            return this._root;
        }

        constructor() {
        }

        public init() {
            this._root.pivotX = -1;
            this._root.pivotY = -1;
            this._root.sizeX = renderer.screenWidth;
            this._root.sizeY = renderer.screenHeight;
        }

        public getComponentInChildren<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : number {
            return this._root.getComponentInChildren(clazz, toReturn);
        }

        private tmpBehaviors : Array<Behavior> = new Array<Behavior>(1024);        

        public update() : void {

            this._root.sizeX = renderer.screenWidth;
            this._root.sizeY = renderer.screenHeight;

            var behaviors:Array<Behavior> = this.tmpBehaviors;

            var behaviorsLen = this.getComponentInChildren(Behavior, behaviors);

            for (var i = 0; i < behaviorsLen; i++) {
                var behavior = behaviors[i];
                behavior.update();
            }
        }
    }
}