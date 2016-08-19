/// <reference path="Entity.ts" />

module Simple2DEngine {
    
    export class EntityManager {

        private _root : Transform = new Transform();

        public get root() {
            return this._root;
        }

        constructor() {
        }

        public getComponentInChildren<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : Array<T> {
            return this._root.getComponentInChildren(clazz, toReturn);
        }

        private tmpBehaviors : Array<Behavior> = new Array<Behavior>();        

        public update() : void {

            var behaviors:Array<Behavior> = this.tmpBehaviors;

            this.getComponentInChildren(Behavior, behaviors);

            for (var i = 0; i < behaviors.length; i++) {
                var behavior = behaviors[i];
                behavior.update();
            }
        }
    }
}