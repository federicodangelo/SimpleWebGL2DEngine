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

        private e1 : Entity;

        public init() : void {
            Drawer.initStatic();
            Time.initStatic();
            
            this._renderer = new RenderManager();
            this._input = new InputManager();
            this._entities = new EntityManager();

            var e1 = this.entities.addEntity();

            e1.transform.localX = 300;
            e1.transform.localY = 300;

            var e2 = this.entities.addEntity();
            e2.transform.parent = e1.transform;

            e2.transform.localY = 100;
            e2.transform.localX = 100;

            this.e1 = e1;
        }

        private lastUpdateTime : number = 0;

        public update() : void {
            
            if (this._renderer.contextLost) {
                //Context lost, don't do anything else
                return; 
            }

            var now = Date.now() / 1000;

            if (this.lastUpdateTime === 0)
                Time.deltaTime = 1 / 60; //assume 60 fps in first frame, so Time.deltaTime is never 0!
            else
                Time.deltaTime = now - this.lastUpdateTime;

            this.lastUpdateTime = now;

            this.e1.transform.localRotationDegrees += 360 * Time.deltaTime; 

            this._input.update();
            this._renderer.draw();

        }
    }
}