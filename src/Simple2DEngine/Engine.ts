module Simple2DEngine {

    export var engine : Engine;
    
    export class Engine {

        private _input : InputManager;
        private _renderer : RenderManager;
        private _entities : EntityManager;

        public get renderer() {
            return this._renderer;
        }

        public get input() {
            return this._input;
        }

        public get entities() {
            return this._entities;
        }

        constructor() {
            engine = this;
        }

        public init() : void {
            Drawer.initStatic();
            
            this._renderer = new RenderManager();
            this._input = new InputManager();
            this._entities = new EntityManager();

            var e1 = this.entities.addEntity();

            e1.transform.localX = 100;
            e1.transform.localY = 100;

            var e2 = this.entities.addEntity();
            e2.transform.parent = e1.transform;

            e2.transform.localY = 100;
            e2.transform.localX = 100;
        }

        public update() : void {
            this._input.update();
            this._renderer.draw();
        }
    }
}