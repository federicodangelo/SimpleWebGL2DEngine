module Simple2DEngine {
    
    export class Entity {

        private _components : Array<Component> = new Array<Component>();
        private _transform : Transform;

        public get components() {
            return this._components;
        }

        public get transform() {
            return this._transform;
        }

        constructor() {
            this._transform = this.addComponent(Transform);
        }

        public addComponent<T extends Component>(clazz : {new() : T}) : T {
            var comp = new clazz();
            comp.init(this);
            return comp;
        }
    }
}