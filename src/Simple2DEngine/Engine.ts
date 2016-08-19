/// <reference path="Input/InputManager.ts" />
/// <reference path="Render/RenderManager.ts" />
/// <reference path="Entity/EntityManager.ts" />
/// <reference path="Util/Time.ts" />

module s2d {

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

        public init() : void {

            Drawer.initStatic();
            Time.initStatic();
            
            this._renderer = new RenderManager();
            this._input = new InputManager();
            this._entities = new EntityManager();

            //Global vars initialization
            input = this._input;
            renderer = this._renderer;
            entities = this._entities;
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

            //Update input
            this._input.update();

            //Call update() on all Behaviors
            this._entities.update();

            //Render
            this._renderer.draw();
        }
    }

    export const engine : Engine = new Engine();
    export var input : InputManager;
    export var renderer : RenderManager;
    export var entities : EntityManager;
}