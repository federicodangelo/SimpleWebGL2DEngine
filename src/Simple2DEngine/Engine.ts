/// <reference path="Input/InputManager.ts" />
/// <reference path="Render/RenderManager.ts" />
/// <reference path="Entity/EntityManager.ts" />
/// <reference path="Util/Time.ts" />

module s2d {

    export class Engine {

        private _input : InputManager;
        private _renderer : RenderManager;
        private _entities : EntityManager;
        private _stats : Stats;

        public get renderer() {
            return this._renderer;
        }

        public get input() {
            return this._input;
        }

        public get entities() {
            return this._entities;
        }

        public get stats() {
            return this._stats;
        }

        public init() : void {

            Drawer.initStatic();
            TextDrawer.initStatic();
            Time.initStatic();
            Transform.initStatic();
            
            //Manager instantiation
            this._renderer = new RenderManager();
            this._input = new InputManager();
            this._entities = new EntityManager();
            this._stats = new Stats();

            //Global vars initialization
            input = this._input;
            renderer = this._renderer;
            entities = this._entities;

            //Manager initialization
            this._renderer.init();
            this._input.init();
            this._entities.init();
            this._stats.init();
        }

        private lastUpdateTime : number = 0;

        public update() : void {
            
            var now = Date.now() / 1000;

            if (this.lastUpdateTime === 0)
                Time.deltaTime = 1 / 60; //assume 60 fps in first frame, so Time.deltaTime is never 0!
            else
                Time.deltaTime = now - this.lastUpdateTime;

            this.lastUpdateTime = now;

            if (this._renderer.contextLost) {
                //Context lost, don't do anything else
                return; 
            }

            this._stats.startFrame();

            this._stats.startUpdate();

            //Update input
            this._input.update();

            //Call update() on all Behaviors
            this._entities.update();

            //Render
            this._renderer.draw();

            this._stats.endUpdate();

            this._stats.endFrame();
        }
    }

    export const engine : Engine = new Engine();
    export var input : InputManager;
    export var renderer : RenderManager;
    export var entities : EntityManager;
}