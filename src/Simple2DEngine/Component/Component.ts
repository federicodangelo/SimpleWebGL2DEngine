module Simple2DEngine {
    
    export class Component {

        private _entity : Entity;

        public init(entity : Entity) : void {
            this._entity = entity;
            this.onInit();
        } 

        public get entity() {
            return this._entity;
        } 

        protected onInit() : void {
            
        }


    }
}