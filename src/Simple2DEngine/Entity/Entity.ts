/// <reference path="../Component/Component.ts" />
/// <reference path="../Component/Transform.ts" />
/// <reference path="../Component/Drawer.ts" />

module Simple2DEngine {
    
    export class Entity {

        private _name : String = "Entity";
        private _transform : Transform;

        //First component in the entity
        private _firstComponent : Component;

        public get name() {
            return this._name;
        }

        public set name(s:String) {
            this._name = s;
        }

        public get transform() {
            return this._transform;
        }

        constructor(name:String = "Entity") {
            this._name = name;
            this._transform = this.addComponent(Transform);
        }

        public addComponent<T extends Component>(clazz : {new() : T}) : T {
            var comp = new clazz();
            
            var tmp = this._firstComponent;
            this._firstComponent = comp;
            comp.__internal_nextComponent = tmp;

            comp.init(this);
            return comp;
        }

        public getComponent<T extends Component>(clazz : {new() : T}) : T {

            var comp = this._firstComponent;

            while (comp != null) {
                if (comp instanceof clazz)
                    return comp;
                comp = comp.__internal_nextComponent;
            }
            
            return null;
        }

        public getComponentInChildren<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : Array<T> {
            toReturn = this._transform.getComponentInChildren(clazz, toReturn);

            return toReturn;
        }
    }
}