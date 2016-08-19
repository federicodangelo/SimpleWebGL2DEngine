/// <reference path="Input/InputManager.ts" />
/// <reference path="Render/RenderManager.ts" />
/// <reference path="Entity/EntityManager.ts" />
/// <reference path="Util/Time.ts" />

module s2d {

    export class Engine {

        private static LOG_PERFORMANCE = false;

        private _input : InputManager;
        private _renderer : RenderManager;
        private _entities : EntityManager;

        private _stats : WGLUStats;

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
            this._stats = new WGLUStats(this._renderer.gl);

            //Global vars initialization
            input = this._input;
            renderer = this._renderer;
            entities = this._entities;


            this.lastFpsTime = Date.now() / 1000;
        }

        private lastUpdateTime : number = 0;
        private lastFpsTime = 0;
        private fpsCounter = 0;

        private accumulatedUpdateTime = 0;

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

            this._stats.begin();

            var startTime = performance.now(); // Date.now();

            //Update input
            this._input.update();

            //Call update() on all Behaviors
            this._entities.update();

            //Render
            this._renderer.draw();

            this._stats.renderOrtho();

            var endTime = performance.now();// Date.now();

            this.accumulatedUpdateTime += endTime - startTime;

            this.fpsCounter++;

            if (now - this.lastFpsTime > 1) {
                var delta = now - this.lastFpsTime;
                var fps = this.fpsCounter / delta;
                var updateTime = this.accumulatedUpdateTime / this.fpsCounter;

                this.lastFpsTime = now;
                this.fpsCounter = 0;
                this.accumulatedUpdateTime = 0;

                if (Engine.LOG_PERFORMANCE)
                    console.log("fps: " + Math.round(fps) + " updateTime: " + updateTime.toFixed(2) + " ms");
            }

            this._stats.end();
        }
    }

    export const engine : Engine = new Engine();
    export var input : InputManager;
    export var renderer : RenderManager;
    export var entities : EntityManager;
}