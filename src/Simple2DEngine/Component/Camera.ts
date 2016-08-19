/// <reference path="Component.ts" />

module Simple2DEngine {

    export class Camera extends Component {
        public clearColor : Color;

        public constructor() {
            super();
            this.clearColor = Color.fromRgba(0, 0, 0, 255);
        }
    }
}