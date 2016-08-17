/// <reference path="Component.ts" />

module Simple2DEngine {

    export class Camera extends Component {

        private _commands : RenderCommands;

        protected onInit() : void {
            this._commands = new RenderCommands(engine.renderer.gl);
        }

        public render() {

            var allEntities = engine.entities.entities;

            this._commands.start();

            for (var i = 0; i < allEntities.length; i++) {

                var entity = allEntities[i];

                entity.drawer.draw(this._commands);
            }

            this._commands.end();
        }        
    }
}