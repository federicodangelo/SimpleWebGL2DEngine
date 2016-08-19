/// <reference path="Entity.ts" />

module s2d {
    
    export class EntityManager {

        private _root : Transform = new Transform();

        public get root() {
            return this._root;
        }

        constructor() {
        }

        public getComponentInChildren<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : number {
            return this._root.getComponentInChildren(clazz, toReturn);
        }

        private tmpBehaviors : Array<Behavior> = new Array<Behavior>(1024);        

        public update() : void {

            var behaviors:Array<Behavior> = this.tmpBehaviors;

            var behaviorsLen = this.getComponentInChildren(Behavior, behaviors);

            for (var i = 0; i < behaviorsLen; i++) {
                var behavior = behaviors[i];
                behavior.update();
            }
        }
    }
}