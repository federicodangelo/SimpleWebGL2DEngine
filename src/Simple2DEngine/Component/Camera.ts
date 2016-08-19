/// <reference path="Component.ts" />

module Simple2DEngine {

    export class Camera extends Component {
        public clearDepthBuffer : boolean = false;
        public clearColorBuffer : boolean = true;

        public clearColor : Color = Color.fromRgba(0, 0, 0, 255);
    }
}