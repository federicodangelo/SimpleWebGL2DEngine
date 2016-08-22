module s2d {
    
    export class Component {

        private _entity : Entity = null;

        //Linked list of components that belong to the same entity
        public __internal_nextComponent : Component = null;

        public init(entity : Entity) : void {
            this._entity = entity;
            this.onInit();
        } 

        public get entity() {
            return this._entity;
        } 

        protected onInit() : void {
            
        }

        public getComponent<T extends Component>(clazz : {new() : T}) : T {
            if (this._entity !== null)
                return this._entity.getComponent(clazz);
            return null;
        }
    }
}