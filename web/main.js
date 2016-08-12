window.onload = function () {
    var engine = new Simple2DEngine.Simple2DEngine();
    engine.init();
};
var Simple2DEngine;
(function (Simple2DEngine_1) {
    var Simple2DEngine = (function () {
        function Simple2DEngine() {
            var _this = this;
            this.update = function () {
                _this._input.update();
                _this._renderer.draw();
                requestAnimationFrame(_this.update);
            };
        }
        Object.defineProperty(Simple2DEngine.prototype, "renderer", {
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Simple2DEngine.prototype, "input", {
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Simple2DEngine.prototype.init = function () {
            this._renderer = new Simple2DEngine_1.Render.RenderManager(this);
            this._input = new Simple2DEngine_1.Input.InputManager(this);
            requestAnimationFrame(this.update);
        };
        return Simple2DEngine;
    }());
    Simple2DEngine_1.Simple2DEngine = Simple2DEngine;
})(Simple2DEngine || (Simple2DEngine = {}));
var Simple2DEngine;
(function (Simple2DEngine) {
    var Input;
    (function (Input) {
        var InputManager = (function () {
            function InputManager(engine) {
                this.engine = engine;
                this.inputTouch = new Input.InputTouch(engine);
                this.inputMouse = new Input.InputMouse(engine);
            }
            Object.defineProperty(InputManager.prototype, "pointerDown", {
                get: function () {
                    return this.inputMouse.isDown || this.inputTouch.touches.length > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputManager.prototype, "pointerX", {
                get: function () {
                    if (this.inputMouse.isDown)
                        return this.inputMouse.x;
                    if (this.inputTouch.touches.length > 0)
                        return this.inputTouch.touches[0].x;
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputManager.prototype, "pointerY", {
                get: function () {
                    if (this.inputMouse.isDown)
                        return this.inputMouse.y;
                    if (this.inputTouch.touches.length > 0)
                        return this.inputTouch.touches[0].y;
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            InputManager.prototype.update = function () {
                //Nothing to do..
            };
            return InputManager;
        }());
        Input.InputManager = InputManager;
    })(Input = Simple2DEngine.Input || (Simple2DEngine.Input = {}));
})(Simple2DEngine || (Simple2DEngine = {}));
var Simple2DEngine;
(function (Simple2DEngine) {
    var Input;
    (function (Input) {
        var InputMouse = (function () {
            /*
            Mouse buttons values (from https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button):
                0: Main button pressed, usually the left button or the un-initialized state
                1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
                2: Secondary button pressed, usually the right button
                3: Fourth button, typically the Browser Back button
                4: Fifth button, typically the Browser Forward button
            */
            function InputMouse(engine) {
                var _this = this;
                this.onMouseDown = function (ev) {
                    ev.preventDefault();
                    _this.updateLastPosition(ev);
                    if (ev.button === 0)
                        _this._leftDown = true;
                    else if (ev.button === 2)
                        _this._rightDown = true;
                };
                this.onMouseMove = function (ev) {
                    ev.preventDefault();
                    _this.updateLastPosition(ev);
                };
                this.onMouseOut = function (ev) {
                    ev.preventDefault();
                    //Nothing to do..
                };
                this.onMouseOver = function (ev) {
                    ev.preventDefault();
                    //Nothing to do..
                };
                this.onMouseUp = function (ev) {
                    ev.preventDefault();
                    _this.updateLastPosition(ev);
                    if (ev.button === 0)
                        _this._leftDown = false;
                    else if (ev.button === 2)
                        _this._rightDown = false;
                };
                this.onMouseWheel = function (ev) {
                    ev.preventDefault();
                    //TODO: Do we handle this?
                };
                this.engine = engine;
                this._lastX = 0;
                this._lastY = 0;
                this._leftDown = false;
                this._rightDown = false;
                document.addEventListener("mousedown", this.onMouseDown, true);
                document.addEventListener("mousemove", this.onMouseMove, true);
                document.addEventListener("mouseout", this.onMouseOut, true);
                document.addEventListener("mouseover", this.onMouseOver, true);
                document.addEventListener("mouseup", this.onMouseUp, true);
                document.addEventListener("mousewheel", this.onMouseWheel, true);
            }
            Object.defineProperty(InputMouse.prototype, "x", {
                get: function () {
                    return this._lastX;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMouse.prototype, "y", {
                get: function () {
                    return this._lastY;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMouse.prototype, "isDown", {
                get: function () {
                    return this._leftDown || this._rightDown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMouse.prototype, "isLeftDown", {
                get: function () {
                    return this._leftDown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(InputMouse.prototype, "isRightDown", {
                get: function () {
                    return this._rightDown;
                },
                enumerable: true,
                configurable: true
            });
            InputMouse.prototype.updateLastPosition = function (ev) {
                if (ev.x >= 0 && ev.x < this.engine.renderer.screenWidth && ev.y >= 0 && ev.y < this.engine.renderer.screenHeight) {
                    this._lastX = ev.x;
                    this._lastY = ev.y;
                }
            };
            return InputMouse;
        }());
        Input.InputMouse = InputMouse;
    })(Input = Simple2DEngine.Input || (Simple2DEngine.Input = {}));
})(Simple2DEngine || (Simple2DEngine = {}));
var Simple2DEngine;
(function (Simple2DEngine) {
    var Input;
    (function (Input) {
        var Touch = (function () {
            function Touch() {
            }
            return Touch;
        }());
        Input.Touch = Touch;
        var InputTouch = (function () {
            function InputTouch(engine) {
                var _this = this;
                this.onTouchStart = function (ev) {
                    ev.preventDefault();
                    _this.updateLastPositions(ev);
                };
                this.onTouchEnd = function (ev) {
                    ev.preventDefault();
                    for (var i = 0; i < ev.changedTouches.length; i++)
                        _this.removeTouch(ev.changedTouches[i].identifier);
                };
                this.onTouchMove = function (ev) {
                    ev.preventDefault();
                    _this.updateLastPositions(ev);
                };
                this.onTouchCancel = function (ev) {
                    ev.preventDefault();
                    for (var i = 0; i < ev.changedTouches.length; i++)
                        _this.removeTouch(ev.changedTouches[i].identifier);
                };
                this.engine = engine;
                this._touches = new Array();
                document.addEventListener("touchstart", this.onTouchStart, true);
                document.addEventListener("touchend", this.onTouchEnd, true);
                document.addEventListener("touchmove", this.onTouchMove, true);
                document.addEventListener("touchcancel", this.onTouchCancel, true);
            }
            Object.defineProperty(InputTouch.prototype, "touches", {
                get: function () {
                    return this._touches;
                },
                enumerable: true,
                configurable: true
            });
            InputTouch.prototype.removeTouch = function (id) {
                for (var i = 0; i < this._touches.length; i++)
                    if (this._touches[i].id === id)
                        this._touches.splice(i, 1);
            };
            InputTouch.prototype.getOrCreateTouch = function (id) {
                for (var i = 0; i < this._touches.length; i++)
                    if (this._touches[i].id === id)
                        return this._touches[i];
                var newTouch = new Touch();
                newTouch.id = id;
                this._touches.push(newTouch);
                return newTouch;
            };
            InputTouch.prototype.updateLastPositions = function (ev) {
                for (var i = 0; i < ev.changedTouches.length; i++) {
                    var id = ev.changedTouches[i].identifier;
                    var x = ev.changedTouches[i].clientX;
                    var y = ev.changedTouches[i].clientY;
                    var touch = this.getOrCreateTouch(id);
                    if (x >= 0 && x < this.engine.renderer.screenWidth && y >= 0 && y < this.engine.renderer.screenHeight) {
                        touch.x = x;
                        touch.y = y;
                    }
                }
            };
            return InputTouch;
        }());
        Input.InputTouch = InputTouch;
    })(Input = Simple2DEngine.Input || (Simple2DEngine.Input = {}));
})(Simple2DEngine || (Simple2DEngine = {}));
var Simple2DEngine;
(function (Simple2DEngine) {
    var Render;
    (function (Render) {
        var RenderManager = (function () {
            function RenderManager(engine) {
                var _this = this;
                this.engine = engine;
                this.mainCanvas = document.getElementById("mainCanvas");
                if (this.mainCanvas) {
                    window.addEventListener("resize", function () { return _this.onWindowResize(); }, false);
                    this.initWebGL();
                }
            }
            Object.defineProperty(RenderManager.prototype, "screenWidth", {
                get: function () {
                    return this._screenWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RenderManager.prototype, "screenHeight", {
                get: function () {
                    return this._screenHeight;
                },
                enumerable: true,
                configurable: true
            });
            RenderManager.prototype.onWindowResize = function () {
                this._screenWidth = window.innerWidth;
                this._screenHeight = window.innerHeight;
                this.mainCanvas.width = this._screenWidth;
                this.mainCanvas.height = this._screenHeight;
                this.gl.viewport(0, 0, this._screenWidth, this._screenHeight);
            };
            RenderManager.prototype.initWebGL = function () {
                this.gl = this.mainCanvas.getContext("webgl");
                if (!this.gl)
                    this.gl = this.mainCanvas.getContext("experimental-webgl");
                this.gl.clearColor(1, 0, 0, 1); //red
                this.onWindowResize();
            };
            RenderManager.prototype.draw = function () {
                if (this.engine.input.pointerDown)
                    this.gl.clearColor(1, 0, 0, 1); //red
                else
                    this.gl.clearColor(0, 1, 0, 1); //green
                this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            };
            return RenderManager;
        }());
        Render.RenderManager = RenderManager;
    })(Render = Simple2DEngine.Render || (Simple2DEngine.Render = {}));
})(Simple2DEngine || (Simple2DEngine = {}));

//# sourceMappingURL=main.js.map
