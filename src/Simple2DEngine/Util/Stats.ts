/// <reference path="EngineConfiguration.ts" />

module s2d {
    export class Stats {       

        private lastFpsTime = 0;
        private fpsCounter = 0;

        private accumulatedUpdateTime = 0;
        private _lastFps = 0;
        private _lastUpdateTime = 0;
        private _lastDrawcalls = 0;

        private _drawcalls = 0;

        public get lastFps() {
            return this._lastFps;
        }
        
        public get lastUpdateTime() {
            return this._lastUpdateTime;
        }

        public get lastDrawcalls() {
            return this._lastDrawcalls;
        }

        public init() : void {
            this.lastFpsTime = performance.now();
        }

        public startFrame() : void {
            this._drawcalls = 0;
        }

        public incrmentDrawcalls() : void {
            this._drawcalls++;
        }

        public endFrame() : void {
            this._lastDrawcalls = this._drawcalls;
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

                this._lastFps = fps;
                this._lastUpdateTime = updateTime;

                if (EngineConfiguration.LOG_PERFORMANCE)
                    console.log("fps: " + Math.round(fps) + " updateTime: " + updateTime.toFixed(2) + " ms");
            }
        }
    }
}