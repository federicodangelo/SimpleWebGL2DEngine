/// <reference path="RenderCommands.ts" />

module s2d {

    export class RenderManager {

        private mainCanvas: HTMLCanvasElement;
        private _gl: WebGLRenderingContext;

        private _screenWidth: number;
        private _screenHeight: number;

        private _contextLost: boolean;

        private _commands: RenderCommands;

        public get contextLost() {
            return this._contextLost;
        }

        public get screenWidth(): number {
            return this._screenWidth;
        }

        public get screenHeight(): number {
            return this._screenHeight;
        }

        public get gl() {
            return this._gl;
        }

        constructor() {
        }

        public init() {
            this.mainCanvas = <HTMLCanvasElement>document.getElementById("mainCanvas");

            if (this.mainCanvas) {

                //don't show context menu
                this.mainCanvas.addEventListener("contextmenu", (ev: PointerEvent) => { ev.preventDefault(); }, true);
                window.addEventListener("contextmenu", (ev: PointerEvent) => { ev.preventDefault(); }, true);

                //resize canvas on window resize
                window.addEventListener("resize", () => this.onWindowResize(), false);

                //register webgl context lost event
                this.mainCanvas.addEventListener("webglcontextlost", () => this.onWebGLContextLost(), false);
                this.mainCanvas.addEventListener("webglcontextrestored", () => this.onWebGLContextRestored(), false);

                this.initWebGL();
            }
        }

        private onWindowResize() {
            this._screenWidth = window.innerWidth;
            this._screenHeight = window.innerHeight;
            this.mainCanvas.width = this._screenWidth;
            this.mainCanvas.height = this._screenHeight;
            this.gl.viewport(0, 0, this._screenWidth, this._screenHeight);
        }

        private onWebGLContextLost() {
            this._contextLost = true;
            console.error("WebGL context lost! Not handled yet..")
        }

        private onWebGLContextRestored() {
            this._contextLost = false;
        }

        private initWebGL(): void {

            this._gl = <WebGLRenderingContext>this.mainCanvas.getContext("webgl", { alpha: false });

            if (!this._gl)
                this._gl = <WebGLRenderingContext>this.mainCanvas.getContext("experimental-webgl");

            if (!this._gl)
                return;

            let gl = this._gl;

            //Default clear color
            gl.clearColor(0, 0, 0, 1);

            //Disable depth test and writing to depth mask
            gl.disable(gl.DEPTH_TEST);
            gl.depthMask(false);

            this._commands = new RenderCommands();

            this.onWindowResize();
        }


        /**
         * Enters full screen mode. This function can only be called when triggered from a user initiated action (ex: click event handler)
         */
        public enterFullscreen() {
            //Taken from phaser source code!!
            //https://github.com/photonstorm/phaser/blob/master/src/system/Device.js

            let fs = [
                'requestFullscreen',
                'requestFullScreen',
                'webkitRequestFullscreen',
                'webkitRequestFullScreen',
                'msRequestFullscreen',
                'msRequestFullScreen',
                'mozRequestFullScreen',
                'mozRequestFullscreen'
            ];

            let element: any = this.mainCanvas;

            for (let i = 0; i < fs.length; i++) {
                if (element[fs[i]]) {
                    element[fs[i]]();
                    break;
                }
            }
        }

        public exitFullscreen() {
            //Taken from phaser source code!!
            //https://github.com/photonstorm/phaser/blob/master/src/system/Device.js

            let cfs = [
                'cancelFullScreen',
                'exitFullscreen',
                'webkitCancelFullScreen',
                'webkitExitFullscreen',
                'msCancelFullScreen',
                'msExitFullscreen',
                'mozCancelFullScreen',
                'mozExitFullscreen'
            ];

            let doc: any = document;

            for (let i = 0; i < cfs.length; i++) {
                if (doc[cfs[i]]) {
                    doc[cfs[i]]();
                    break;
                }
            }
        }

        private tmpCameras: Array<Camera> = new Array<Camera>(4);
        private tmpDrawers: Array<Drawer> = new Array<Drawer>(1024);
        private tmpLayouts: Array<Layout> = new Array<Layout>(1024);

        public draw(): void {

            let cameras = this.tmpCameras;
            let camerasLen = engine.entities.getComponentInChildren(Camera, cameras);

            let drawers = this.tmpDrawers;
            let drawersLen = engine.entities.getComponentInChildren(Drawer, drawers);

            let layouts = this.tmpLayouts;
            let layoutsLen = engine.entities.getComponentInChildren(Layout, layouts);

            if (camerasLen === 0)
                console.warn("No cameras to draw!!");

            if (drawersLen === 0)
                console.warn("No entities to draw!!");

            for (let i = 0; i < layoutsLen; i++)
                layouts[i].updateLayout();

            this._commands.startFrame();

            for (let i = 0; i < camerasLen; i++)
                this.renderCamera(cameras[i], drawers, drawersLen);

            this._commands.endFrame();
        }

        private renderCamera(camera: Camera, drawers: Array<Drawer>, drawersLen: number) {

            let commands = this._commands;

            if (EngineConfiguration.RENDER_ENABLED) {
                let gl = this.gl;

                let clearFlags = 0;

                if (camera.clearColorBuffer) {
                    clearFlags |= gl.COLOR_BUFFER_BIT;
                    gl.clearColor(camera.clearColor.r, camera.clearColor.g, camera.clearColor.b, camera.clearColor.a);
                }

                if (camera.clearDepthBuffer)
                    clearFlags |= gl.DEPTH_BUFFER_BIT;

                if (clearFlags != 0)
                    gl.clear(clearFlags);
            }

            commands.start();

            for (let i = 0; i < drawersLen; i++)
                drawers[i].draw(commands);

            commands.end();
        }
    }
}
