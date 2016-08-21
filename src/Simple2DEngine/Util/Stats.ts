module s2d {
    export class Stats {

        public logPerformance : boolean = true;

        private _wglu : WGLUStats;

        private lastFpsTime = 0;
        private fpsCounter = 0;

        private accumulatedUpdateTime = 0;
        
        public init() : void {
            this._wglu = new WGLUStats(engine.renderer.gl);

            this.lastFpsTime = performance.now();
        }

        public startFrame() : void {
            this._wglu.begin();
        }

        public endFrame() : void {
            this._wglu.end();

            this._wglu.renderOrtho();
        }

        private updateStartTime : number;

        public startUpdate() : void {
            
            this.updateStartTime = performance.now();
        }

        public endUpdate() : void {

            var endTime = performance.now();

            this.accumulatedUpdateTime += endTime - this.updateStartTime;

            this.fpsCounter++;

            if (this.updateStartTime - this.lastFpsTime > 1000) {
                var delta = this.updateStartTime - this.lastFpsTime;
                var fps = this.fpsCounter / (delta / 1000);
                var updateTime = this.accumulatedUpdateTime / this.fpsCounter;

                this.lastFpsTime = this.updateStartTime;
                this.fpsCounter = 0;
                this.accumulatedUpdateTime = 0;

                if (this.logPerformance)
                    console.log("fps: " + Math.round(fps) + " updateTime: " + updateTime.toFixed(2) + " ms");
            }
        }
    }
}