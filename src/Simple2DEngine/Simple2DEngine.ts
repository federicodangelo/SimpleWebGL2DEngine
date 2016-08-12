module Simple2DEngine {
    
    export class Simple2DEngine {

        private _input : Input.InputManager;
        private _renderer : Render.RenderManager;

        public get renderer() {
            return this._renderer;
        }

        public get input() {
            return this._input;
        }

        constructor() {
            
        }

        public init() : void {
            this._renderer = new Render.RenderManager(this);
            this._input = new Input.InputManager(this);
            
            requestAnimationFrame(this.update);
        }

        private update = () => {

            this._input.update();
            this._renderer.draw();

            requestAnimationFrame(this.update);
        }
    }
}