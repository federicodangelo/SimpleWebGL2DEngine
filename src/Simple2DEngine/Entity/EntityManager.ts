/// <reference path="Entity.ts" />

module Simple2DEngine {
    
    export class EntityManager {

        private _root : Transform = new Transform();

        public get root() {
            return this._root;
        }

        constructor() {
        }

        public addEntity() : Entity {
            var entity = new Entity(); 
            return entity;
        }

        public getComponentInChildren<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : Array<T> {
            return this._root.getComponentInChildren(clazz, toReturn);
        }
    }
}