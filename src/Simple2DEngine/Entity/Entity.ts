/// <reference path="../Component/Component.ts" />
/// <reference path="../Component/Transform.ts" />
/// <reference path="../Component/Drawer.ts" />

module Simple2DEngine {
    
    export class Entity {

        private _components : Array<Component> = new Array<Component>();
        private _transform : Transform;
        private _drawer : Drawer;

        public get components() {
            return this._components;
        }

        public get transform() {
            return this._transform;
        }

        public get drawer() {
            return this._drawer;
        
    }
        constructor() {
            this._transform = this.addComponent(Transform);
            this._drawer = this.addComponent(Drawer);
        }

        public addComponent<T extends Component>(clazz : {new() : T}) : T {
            var comp = new clazz();
            comp.init(this);
            return comp;
        }
    }
}