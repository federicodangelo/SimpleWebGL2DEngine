/// <reference path="Component.ts" />

module Simple2DEngine {

    export class Camera extends Component {

        private _commands : RenderCommands;

        protected onInit() : void {
            this._commands = new RenderCommands(engine.renderer.gl);
        }

        public render() {
            //TODO
        }        
    }
}