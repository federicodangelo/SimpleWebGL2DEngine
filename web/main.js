var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var s2d;
(function (s2d) {
    var Component = (function () {
        function Component() {
            this._entity = null;
            //Linked list of components that belong to the same entity
            this.__internal_nextComponent = null;
        }
        Object.defineProperty(Component.prototype, "entity", {
            get: function () {
                return this._entity;
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.init = function (entity) {
            this._entity = entity;
            this.onInit();
        };
        Component.prototype.onInit = function () {
        };
        Component.prototype.destroy = function () {
            this.onDestroy();
        };
        Component.prototype.onDestroy = function () {
        };
        Component.prototype.getComponent = function (clazz) {
            if (this._entity !== null)
                return this._entity.getComponent(clazz);
            return null;
        };
        return Component;
    }());
    s2d.Component = Component;
})(s2d || (s2d = {}));
/// <reference path="Component.ts" />
var s2d;
(function (s2d) {
    var Behavior = (function (_super) {
        __extends(Behavior, _super);
        function Behavior() {
            return _super.apply(this, arguments) || this;
        }
        Behavior.prototype.update = function () {
        };
        return Behavior;
    }(s2d.Component));
    s2d.Behavior = Behavior;
})(s2d || (s2d = {}));
/// <reference path="../Simple2DEngine/Component/Behavior.ts" />
var GameLogic = (function (_super) {
    __extends(GameLogic, _super);
    function GameLogic() {
        var _this = _super.apply(this, arguments) || this;
        _this.cam = null;
        _this.activeTest = null;
        _this.gameScreen = null;
        return _this;
    }
    GameLogic.prototype.onInit = function () {
        GameLogic.instance = this;
        this.cam = s2d.EntityFactory.buildCamera();
        this.gameScreen = s2d.EntityFactory.buildWithComponent(GameScreen, "Game Screen");
        s2d.EntityFactory.buildWithComponent(GameStats, "Game Stats");
        var fullScreenButton = s2d.EntityFactory.buildFullscreenTextButton("FULL\nSCREEN");
        fullScreenButton.entity.transform.setParent(s2d.ui.root);
        fullScreenButton.entity.transform.setPivot(1, 1); //bottom right
        fullScreenButton.entity.getOrAddComponent(s2d.Layout)
            .setAnchorMode(s2d.LayoutAnchorMode.RelativeToParent, s2d.LayoutAnchorMode.RelativeToParent)
            .setAnchorModePivot(1, 1) //bottom right
            .setAnchorModeOffset(-5, -5);
        //this.setActiveTest(new TestTilemap());
    };
    GameLogic.prototype.update = function () {
        if (this.activeTest !== null)
            this.activeTest.update();
    };
    GameLogic.prototype.setActiveTest = function (test) {
        if (this.activeTest !== null) {
            this.activeTest.destroy();
            this.activeTest = null;
        }
        this.activeTest = test;
        if (this.activeTest !== null) {
            this.activeTest.init(this);
            this.gameScreen.entity.active = false;
        }
        else {
            this.gameScreen.entity.active = true;
        }
    };
    return GameLogic;
}(s2d.Behavior));
/// <reference path="../Behavior.ts" />
var s2d;
(function (s2d) {
    var Screen = (function (_super) {
        __extends(Screen, _super);
        function Screen() {
            var _this = _super.apply(this, arguments) || this;
            _this.trans = null;
            return _this;
        }
        Screen.prototype.onInit = function () {
            this.trans = this.entity.transform;
            this.trans.parent = s2d.ui.root;
            this.trans.pivotX = -1;
            this.trans.pivotY = -1;
            this.trans.sizeX = s2d.renderer.screenWidth;
            this.trans.sizeY = s2d.renderer.screenHeight;
            this.onScreenInit();
        };
        Screen.prototype.onScreenInit = function () {
        };
        Screen.prototype.update = function () {
            //Always match parent size!!
            this.trans.size = this.trans.parent.size;
            this.onScreenUpdate();
        };
        Screen.prototype.onScreenUpdate = function () {
        };
        return Screen;
    }(s2d.Behavior));
    s2d.Screen = Screen;
})(s2d || (s2d = {}));
/// <reference path="../Simple2DEngine/Component/UI/Screen.ts" />
var GameScreen = (function (_super) {
    __extends(GameScreen, _super);
    function GameScreen() {
        var _this = _super.apply(this, arguments) || this;
        _this.offestY = -100;
        return _this;
    }
    GameScreen.prototype.onScreenInit = function () {
        this.addTestButton("Test Simple", TestSimple);
        this.addTestButton("Test Moving Triangles", TestMovingTriangles);
        this.addTestButton("Test Tilemap", TestTilemap);
    };
    GameScreen.prototype.addTestButton = function (name, testClazz) {
        var button = s2d.EntityFactory.buildTextButton(name);
        button.entity.transform.setParent(this.trans).setPivot(0, 0);
        button.entity.getOrAddComponent(s2d.Layout)
            .setAnchorMode(s2d.LayoutAnchorMode.RelativeToParent, s2d.LayoutAnchorMode.RelativeToParent)
            .setAnchorModeOffset(0, this.offestY);
        button.onClick.attach(function () {
            GameLogic.instance.setActiveTest(new testClazz());
        });
        this.offestY += 100;
    };
    return GameScreen;
}(s2d.Screen));
/// <reference path="../Simple2DEngine/Component/Behavior.ts" />
var GameStats = (function (_super) {
    __extends(GameStats, _super);
    function GameStats() {
        var _this = _super.apply(this, arguments) || this;
        _this.lastFps = 0;
        _this.lastUpdateTime = 0;
        _this.lastDrawcalls = 0;
        return _this;
    }
    GameStats.prototype.onInit = function () {
        this.textFPS = s2d.EntityFactory.buildTextDrawer();
        this.textFPS.entity.transform.setPivot(-1, -1).setLocalPosition(8, 8).setParent(this.entity.transform);
        this.textFPS.color.setFromRgba(0, 255, 0);
        this.entity.addComponent(s2d.Layout).setSizeMode(s2d.LayoutSizeMode.MatchChildrenBest, s2d.LayoutSizeMode.MatchChildrenBest);
        this.entity.transform.setPivot(-1, -1).setParent(s2d.ui.root);
    };
    GameStats.prototype.update = function () {
        var stats = s2d.engine.stats;
        if (stats.lastFps !== this.lastFps ||
            stats.lastUpdateTime !== this.lastUpdateTime ||
            stats.lastDrawcalls !== this.lastDrawcalls) {
            this.textFPS.text = "fps: " + Math.round(s2d.engine.stats.lastFps) + "\nupdate: " + s2d.engine.stats.lastUpdateTime.toFixed(2) + " ms\nDraw Calls: " + stats.lastDrawcalls; // + "\nEntities: " + this.entities.length;
            this.lastFps = stats.lastFps;
            this.lastUpdateTime = stats.lastUpdateTime;
            this.lastDrawcalls = stats.lastDrawcalls;
        }
    };
    return GameStats;
}(s2d.Behavior));
/// <reference path="../../Simple2DEngine/Component/Behavior.ts" />
var Test = (function () {
    function Test() {
    }
    Test.prototype.init = function (gameLogic) {
        this.gameLogic = gameLogic;
        this.testContainer = new s2d.Entity("Test Container").transform;
        this.uiContainer = new s2d.Entity("UI Container").transform;
        this.uiContainer.entity.transform.setParent(s2d.ui.root);
        var exitButton = s2d.EntityFactory.buildTextButton("Exit Test");
        exitButton.entity.transform.setLocalPosition(8, 128).setParent(this.uiContainer);
        exitButton.onClick.attach(this.onExitButtonClicked, this);
        this.onInit();
    };
    Test.prototype.onExitButtonClicked = function () {
        this.gameLogic.setActiveTest(null);
    };
    Test.prototype.onInit = function () {
    };
    Test.prototype.update = function () {
        this.onUpdate();
    };
    Test.prototype.onUpdate = function () {
    };
    Test.prototype.destroy = function () {
        this.onDestroy();
        this.uiContainer.entity.destroy();
        this.testContainer.entity.destroy();
    };
    Test.prototype.onDestroy = function () {
    };
    return Test;
}());
var TestMovingTriangles = (function (_super) {
    __extends(TestMovingTriangles, _super);
    function TestMovingTriangles() {
        var _this = _super.apply(this, arguments) || this;
        _this.entities = new Array();
        _this.loadCompleted = false;
        _this.lastEntitiesCount = 0;
        return _this;
    }
    TestMovingTriangles.prototype.onInit = function () {
        var _this = this;
        var resetButton = s2d.EntityFactory.buildTextButton("Reset");
        resetButton.entity.transform.setLocalPosition(300, 8).setParent(this.uiContainer);
        resetButton.onClick.attach(this.onResetButtonClicked, this);
        var clearButton = s2d.EntityFactory.buildTextButton("Clear");
        clearButton.entity.transform.setLocalPosition(450, 8).setParent(this.uiContainer);
        clearButton.onClick.attach(this.onClearButtonClicked, this);
        var addMore = s2d.EntityFactory.buildTextButton("Add\nMore");
        addMore.entity.transform.setLocalPosition(450, 60).setParent(this.uiContainer);
        addMore.onClick.attach(this.initTest, this);
        var toggleRotationButton = s2d.EntityFactory.buildTextButton("Toggle\nRotation");
        toggleRotationButton.entity.transform.setLocalPosition(600, 8).setParent(this.uiContainer);
        toggleRotationButton.onClick.attach(function () { return TestMovingTriangles.TEST_MOVING = !TestMovingTriangles.TEST_MOVING; });
        var toggleNestingButton = s2d.EntityFactory.buildTextButton("Toggle\nNesting");
        toggleNestingButton.entity.transform.setLocalPosition(800, 8).setParent(this.uiContainer);
        toggleNestingButton.onClick.attach(function () { TestMovingTriangles.TEST_NESTING = !TestMovingTriangles.TEST_NESTING; _this.clear(); _this.initTest(); });
        var toggleActiveButton = s2d.EntityFactory.buildTextButton("Toggle\nActive");
        toggleActiveButton.entity.transform.setLocalPosition(800, 100).setParent(this.uiContainer);
        toggleActiveButton.onClick.attach(this.toggleActive, this);
        s2d.loader.loadRenderTextureFromUrl("test.png", "assets/test.png", false);
        s2d.loader.attachOnLoadCompleteListener(this.onLoadComplete, this);
    };
    TestMovingTriangles.prototype.toggleActive = function () {
        this.testContainer.entity.active = !this.testContainer.entity.active;
    };
    TestMovingTriangles.prototype.onLoadComplete = function () {
        this.texture = s2d.loader.getAsset("test.png");
        this.loadCompleted = true;
        this.initTest();
    };
    TestMovingTriangles.prototype.onResetButtonClicked = function (button) {
        this.clear();
        this.initTest();
    };
    TestMovingTriangles.prototype.onClearButtonClicked = function (button) {
        this.clear();
    };
    TestMovingTriangles.prototype.clear = function () {
        for (var i = 0; i < this.entities.length; i++)
            this.entities[i].destroy();
        this.entities.length = 0;
    };
    TestMovingTriangles.prototype.initTest = function () {
        if (!this.loadCompleted)
            return;
        this.testContainer.entity.active = true;
        var sWidth = s2d.engine.renderer.screenWidth;
        var sHeight = s2d.engine.renderer.screenHeight;
        for (var i = 0; i < TestMovingTriangles.RECTS_COUNT; i++) {
            var e = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;
            e.name = "Entity " + i;
            e.transform.localX = s2d.SMath.randomInRangeFloat(100, sWidth - 100);
            e.transform.localY = s2d.SMath.randomInRangeFloat(100, sHeight - 100);
            if (TestMovingTriangles.TEST_NESTING) {
                if (i > 0 && i % 3 == 0)
                    e.transform.parent = this.entities[i - 2].transform;
                else if (i > 0 && i % 5 == 0)
                    e.transform.parent = this.entities[i - 4].transform;
                else if (i > 0 && i % 7 == 0)
                    e.transform.parent = this.entities[i - 6].transform;
                else
                    e.transform.parent = this.testContainer;
            }
            else {
                e.transform.parent = this.testContainer;
            }
            this.entities.push(e);
        }
    };
    TestMovingTriangles.prototype.onUpdate = function () {
        if (TestMovingTriangles.TEST_MOVING) {
            var entities = this.entities;
            for (var i = 0; i < entities.length; i++)
                entities[i].transform.localRotationDegrees += 360 * s2d.Time.deltaTime;
        }
        //if (s2d.input.pointerDown)
        //    this.cam.clearColor.setFromRgba(255, 0, 0); //red
        //else
        //    this.cam.clearColor.setFromRgba(0, 0, 0); //black        
    };
    return TestMovingTriangles;
}(Test));
TestMovingTriangles.TEST_NESTING = true;
TestMovingTriangles.TEST_MOVING = true;
TestMovingTriangles.RECTS_COUNT = 1024;
var TestSimple = (function (_super) {
    __extends(TestSimple, _super);
    function TestSimple() {
        var _this = _super.apply(this, arguments) || this;
        _this.entities = new Array();
        _this.loadCompleted = false;
        return _this;
    }
    TestSimple.prototype.onInit = function () {
        s2d.loader.loadRenderTextureFromUrl("test.png", "assets/test.png", false);
        s2d.loader.attachOnLoadCompleteListener(this.onLoadComplete, this);
    };
    TestSimple.prototype.toggleActive = function () {
        this.testContainer.entity.active = !this.testContainer.entity.active;
    };
    TestSimple.prototype.onLoadComplete = function () {
        this.texture = s2d.loader.getAsset("test.png");
        this.loadCompleted = true;
        this.initTestSimple();
    };
    TestSimple.prototype.initTestSimple = function () {
        if (!this.loadCompleted)
            return;
        var e1 = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;
        var e2 = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;
        var e3 = s2d.EntityFactory.buildTextureDrawer(this.texture).entity;
        e1.transform.localX = 300;
        e1.transform.localY = 300;
        e2.transform.parent = e1.transform;
        e2.transform.localX = 200;
        e3.transform.parent = e2.transform;
        e3.transform.localX = 100;
        this.entities.push(e1);
        this.entities.push(e2);
        this.entities.push(e3);
    };
    TestSimple.prototype.onUpdate = function () {
        var entities = this.entities;
        for (var i = 0; i < entities.length; i++)
            entities[i].transform.localRotationDegrees += 360 * s2d.Time.deltaTime;
    };
    TestSimple.prototype.onDestroy = function () {
        for (var i = 0; i < this.entities.length; i++)
            this.entities[i].destroy();
        this.entities.length = 0;
    };
    return TestSimple;
}(Test));
var TestTilemap = (function (_super) {
    __extends(TestTilemap, _super);
    function TestTilemap() {
        var _this = _super.apply(this, arguments) || this;
        _this.loadCompleted = false;
        _this.tilemapDrawer = null;
        _this.tileCoords = s2d.Vector2.create();
        return _this;
    }
    TestTilemap.prototype.onInit = function () {
        s2d.loader.loadRenderSpriteAtlasFromUrl("spritesheet", "assets/spritesheet.xml");
        s2d.loader.attachOnLoadCompleteListener(this.onLoadComplete, this);
    };
    TestTilemap.prototype.toggleActive = function () {
        this.testContainer.entity.active = !this.testContainer.entity.active;
    };
    TestTilemap.prototype.onLoadComplete = function () {
        this.spritesheet = s2d.loader.getAsset("spritesheet");
        this.loadCompleted = true;
        this.initTilemap();
    };
    TestTilemap.prototype.initTilemap = function () {
        if (!this.loadCompleted)
            return;
        var spritesheet = this.spritesheet;
        var tiles = new Array();
        for (var spriteId in spritesheet.sprites.data) {
            var sprite = spritesheet.sprites.data[spriteId];
            tiles.push(new s2d.Tile(sprite.id, sprite));
        }
        var tilemap = new s2d.Tilemap(128, 64, tiles);
        var data = tilemap.data;
        for (var x = 0; x < tilemap.width; x++)
            for (var y = 0; y < tilemap.height; y++)
                data[y][x] = tiles[(x + y) % tiles.length];
        this.tilemapDrawer = s2d.EntityFactory.buildTilemapDrawer(tilemap);
        this.tilemapDrawer.entity.transform.parent = this.testContainer;
        this.tilemapDrawer.entity.transform.setLocalPosition(0, 0).setPivot(-1, -1);
    };
    TestTilemap.prototype.onUpdate = function () {
        if (this.tilemapDrawer !== null && s2d.input.pointerDownNow) {
            this.tileCoords = this.tilemapDrawer.getTileCoordsAtGlobalPosition(s2d.input.pointer.position, this.tileCoords);
            if (this.tileCoords[0] != -1 && this.tileCoords[1] != -1) {
                var tilemap = this.tilemapDrawer.tilemap;
                var x = this.tileCoords[0];
                var y = this.tileCoords[1];
                var existingTile = tilemap.getTile(x, y);
                //new tile is next tile in the array
                var newTile = tilemap.tiles[(tilemap.tiles.indexOf(existingTile) + 1) % tilemap.tiles.length];
                tilemap.setTile(x, y, newTile);
            }
        }
    };
    TestTilemap.prototype.onDestroy = function () {
    };
    return TestTilemap;
}(Test));
var s2d;
(function (s2d) {
    var InputMouse = (function () {
        /*
        Mouse buttons values (from https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button):
            0: Main button pressed, usually the left button or the un-initialized state
            1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
            2: Secondary button pressed, usually the right button
            3: Fourth button, typically the Browser Back button
            4: Fifth button, typically the Browser Forward button
        */
        function InputMouse() {
            var _this = this;
            this.onMouseDown = function (ev) {
                ev.preventDefault();
                _this.updateLastPosition(ev);
                if (ev.button === 0)
                    _this._leftDown = true;
                else if (ev.button === 2)
                    _this._rightDown = true;
                if (ev.button === 0 && s2d.FullscreenButton.activeInstance !== null) {
                    //Fullscreen needs to be triggered from the down event..
                    if (s2d.input.getInteractableUnderPointer(_this.x, _this.y) === s2d.FullscreenButton.activeInstance)
                        s2d.renderer.enterFullscreen();
                }
            };
            this.onMouseMove = function (ev) {
                ev.preventDefault();
                _this.updateLastPosition(ev);
                _this._moved = true;
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
            this._lastX = 0;
            this._lastY = 0;
            this._leftDown = false;
            this._rightDown = false;
            this._moved = false;
            document.addEventListener("mousedown", this.onMouseDown, true);
            document.addEventListener("mousemove", this.onMouseMove, true);
            document.addEventListener("mouseout", this.onMouseOut, true);
            document.addEventListener("mouseover", this.onMouseOver, true);
            document.addEventListener("mouseup", this.onMouseUp, true);
            document.addEventListener("mousewheel", this.onMouseWheel, true);
        }
        Object.defineProperty(InputMouse.prototype, "moved", {
            get: function () {
                return this._moved;
            },
            enumerable: true,
            configurable: true
        });
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
            if (ev.x >= 0 && ev.x < s2d.engine.renderer.screenWidth && ev.y >= 0 && ev.y < s2d.engine.renderer.screenHeight) {
                this._lastX = ev.x;
                this._lastY = ev.y;
            }
        };
        InputMouse.prototype.resetMoved = function () {
            this._moved = false;
        };
        return InputMouse;
    }());
    s2d.InputMouse = InputMouse;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var Touch = (function () {
        function Touch() {
        }
        return Touch;
    }());
    s2d.Touch = Touch;
    var InputTouch = (function () {
        function InputTouch() {
            var _this = this;
            this.onTouchStart = function (ev) {
                ev.preventDefault();
                _this.updateLastPositions(ev);
                if (_this.touches.length == 1 && s2d.FullscreenButton.activeInstance !== null) {
                    //Fullscreen needs to be triggered from the down event..
                    if (s2d.input.getInteractableUnderPointer(_this.touches[0].x, _this.touches[0].y) === s2d.FullscreenButton.activeInstance)
                        s2d.renderer.enterFullscreen();
                }
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
                if (x >= 0 && x < s2d.engine.renderer.screenWidth && y >= 0 && y < s2d.engine.renderer.screenHeight) {
                    touch.x = x;
                    touch.y = y;
                }
            }
        };
        return InputTouch;
    }());
    s2d.InputTouch = InputTouch;
})(s2d || (s2d = {}));
/// <reference path="InputMouse.ts" />
/// <reference path="InputTouch.ts" />
var s2d;
(function (s2d) {
    var InputManager = (function () {
        function InputManager() {
            this._lastInteractableDown = null;
            this.tmpInteractables = new Array(1024);
            this.tmpRect = s2d.Rect.create();
        }
        Object.defineProperty(InputManager.prototype, "pointerDown", {
            get: function () {
                return this._inputPointer.down;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "pointerDownNow", {
            get: function () {
                return this._inputPointer.down && this._inputPointer.downFrames == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "pointerX", {
            get: function () {
                return this._inputPointer.position[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "pointerY", {
            get: function () {
                return this._inputPointer.position[1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputManager.prototype, "pointer", {
            get: function () {
                return this._inputPointer;
            },
            enumerable: true,
            configurable: true
        });
        InputManager.prototype.init = function () {
            this._inputTouch = new s2d.InputTouch();
            this._inputMouse = new s2d.InputMouse();
            this._inputPointer = new s2d.InputPointer();
        };
        InputManager.prototype.update = function () {
            this.updatePointer();
            var newInteractable = this.getInteractableUnderPointer();
            var pointer = this._inputPointer;
            if (pointer.down) {
                if (pointer.downFrames === 0) {
                    if (newInteractable !== null) {
                        this._lastInteractableDown = newInteractable;
                        newInteractable.onPointerDown(pointer);
                    }
                }
            }
            else {
                if (this._lastInteractableDown !== null) {
                    var tmp = this._lastInteractableDown;
                    this._lastInteractableDown = null;
                    tmp.onPointerUp(pointer);
                }
            }
        };
        InputManager.prototype.updatePointer = function () {
            var inputPointer = this._inputPointer;
            var x = this._inputPointer.position[0];
            var y = this._inputPointer.position[1];
            if (this._inputMouse.isDown || this._inputMouse.moved) {
                x = this._inputMouse.x;
                y = this._inputMouse.y;
            }
            else if (this._inputTouch.touches.length > 0) {
                x = this._inputTouch.touches[0].x;
                y = this._inputTouch.touches[0].y;
            }
            var down = (this._inputMouse.isDown || this._inputTouch.touches.length > 0);
            inputPointer.delta[0] = x - inputPointer.position[0];
            inputPointer.delta[1] = y - inputPointer.position[1];
            inputPointer.position[0] = x;
            inputPointer.position[1] = y;
            if (inputPointer.down && down) {
                inputPointer.downFrames++;
            }
            else {
                inputPointer.down = down;
                inputPointer.downFrames = 0;
            }
            this._inputMouse.resetMoved();
        };
        InputManager.prototype.getInteractableUnderPointer = function (pointerX, pointerY) {
            if (pointerX === void 0) { pointerX = -1; }
            if (pointerY === void 0) { pointerY = -1; }
            var rect = this.tmpRect;
            var pointer = this._inputPointer;
            var interactables = this.tmpInteractables;
            var interactablesCount = s2d.entities.getComponentsInChildren(s2d.Interactable, interactables);
            if (pointerX === -1)
                pointerX = pointer.position[0];
            if (pointerY === -1)
                pointerY = pointer.position[1];
            //Iterate from bottom to top, since the last drawn items will be on top and we want those first
            for (var i = interactablesCount - 1; i >= 0; i--) {
                var interactable = interactables[i];
                if (interactable.enabled)
                    if (s2d.Rect.containts(interactable.getBounds(rect), pointerX, pointerY))
                        return interactable;
            }
            return null;
        };
        return InputManager;
    }());
    s2d.InputManager = InputManager;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var RenderBuffer = (function () {
        /**
         * bufferType: gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER
         */
        function RenderBuffer(bufferType) {
            if (bufferType === void 0) { bufferType = WebGLRenderingContext.ARRAY_BUFFER; }
            var gl = s2d.renderer.gl;
            this._bufferType = bufferType;
            this._buffer = gl.createBuffer();
        }
        RenderBuffer.prototype.clear = function () {
            var gl = s2d.renderer.gl;
            if (this._buffer != null) {
                gl.deleteBuffer(this._buffer);
                this._buffer = null;
            }
        };
        RenderBuffer.prototype.setData = function (data, staticData) {
            var gl = s2d.renderer.gl;
            this.bind();
            gl.bufferData(this._bufferType, data, staticData ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        };
        RenderBuffer.prototype.bind = function () {
            var gl = s2d.renderer.gl;
            gl.bindBuffer(this._bufferType, this._buffer);
        };
        return RenderBuffer;
    }());
    s2d.RenderBuffer = RenderBuffer;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var RenderShader = (function () {
        function RenderShader(shaderStr, type) {
            var gl = s2d.renderer.gl;
            this._shader = gl.createShader(type);
            gl.shaderSource(this._shader, shaderStr);
            gl.compileShader(this._shader);
            this._compilationOk = gl.getShaderParameter(this._shader, gl.COMPILE_STATUS);
            if (!this._compilationOk) {
                console.error("Error compiling shader: " + shaderStr);
                console.error(gl.getShaderInfoLog(this._shader));
                this.clear();
            }
        }
        Object.defineProperty(RenderShader.prototype, "shader", {
            get: function () {
                return this._shader;
            },
            enumerable: true,
            configurable: true
        });
        RenderShader.prototype.clear = function () {
            var gl = s2d.renderer.gl;
            if (this._shader != null) {
                gl.deleteShader(this._shader);
                this._shader = null;
            }
        };
        return RenderShader;
    }());
    s2d.RenderShader = RenderShader;
})(s2d || (s2d = {}));
/// <reference path="RenderShader.ts" />
var s2d;
(function (s2d) {
    var RenderProgram = (function () {
        function RenderProgram(vertexShaderStr, fragmentShaderStr) {
            var gl = s2d.renderer.gl;
            this._vertexShader = new s2d.RenderShader(vertexShaderStr, gl.VERTEX_SHADER);
            this._fragmentShader = new s2d.RenderShader(fragmentShaderStr, gl.FRAGMENT_SHADER);
            this._program = gl.createProgram();
            gl.attachShader(this._program, this._vertexShader.shader);
            gl.attachShader(this._program, this._fragmentShader.shader);
            gl.linkProgram(this._program);
            this._linkOk = gl.getProgramParameter(this._program, gl.LINK_STATUS);
            if (!this._linkOk) {
                console.error("Error compiling program: " + gl.getProgramInfoLog(this._program));
                this.clear();
            }
        }
        RenderProgram.prototype.clear = function () {
            var gl = s2d.renderer.gl;
            if (this._program != null) {
                gl.deleteProgram(this._program);
                this._program = null;
            }
            if (this._vertexShader != null) {
                this._vertexShader.clear();
                this._vertexShader = null;
            }
            if (this._fragmentShader != null) {
                this._fragmentShader.clear();
                this._fragmentShader = null;
            }
        };
        RenderProgram.prototype.useProgram = function () {
            var gl = s2d.renderer.gl;
            gl.useProgram(this._program);
        };
        RenderProgram.prototype.setUniform2f = function (name, x, y) {
            var gl = s2d.renderer.gl;
            var uniformLocation = gl.getUniformLocation(this._program, name);
            gl.uniform2f(uniformLocation, x, y);
        };
        RenderProgram.prototype.setVertexAttributePointer = function (name, buffer, size, type, normalized, stride, offset) {
            var gl = s2d.renderer.gl;
            var attributeLocation = gl.getAttribLocation(this._program, name);
            gl.enableVertexAttribArray(attributeLocation);
            buffer.bind();
            gl.vertexAttribPointer(attributeLocation, size, type, normalized, stride, offset);
        };
        return RenderProgram;
    }());
    s2d.RenderProgram = RenderProgram;
})(s2d || (s2d = {}));
/// <reference path="RenderBuffer.ts" />
/// <reference path="RenderProgram.ts" />
var s2d;
(function (s2d) {
    var RenderCommands = (function () {
        function RenderCommands() {
            this.currentBufferIndex = 0;
            this.currentTexture = null;
            this.renderMesh = null;
            var gl = s2d.renderer.gl;
            this.renderProgram = new s2d.RenderProgram(RenderCommands.vertexShader, RenderCommands.fragmentShader);
            this.renderVertexBuffers = new Array();
            this.renderIndexBuffers = new Array();
            for (var i = 0; i < RenderCommands.BUFFERS_COUNT; i++) {
                this.renderVertexBuffers.push(new s2d.RenderBuffer(gl.ARRAY_BUFFER));
                this.renderIndexBuffers.push(new s2d.RenderBuffer(gl.ELEMENT_ARRAY_BUFFER));
            }
            this.renderMesh = new s2d.RenderMesh();
        }
        RenderCommands.prototype.startFrame = function () {
        };
        RenderCommands.prototype.endFrame = function () {
        };
        RenderCommands.prototype.start = function () {
            this.renderMesh.reset();
        };
        RenderCommands.prototype.drawRectSimple = function (mat, size, texture, uvRect, color) {
            var renderMesh = this.renderMesh;
            if (!renderMesh.canDrawRect() || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }
            renderMesh.drawRectSimple(mat, size, uvRect, color);
        };
        RenderCommands.prototype.drawRect9Slice = function (mat, size, texture, rect, uvRect, innerRect, innerUvRect, color) {
            var renderMesh = this.renderMesh;
            if (!renderMesh.canDrawRect9Slice() || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }
            renderMesh.drawRect9Slice(mat, size, rect, uvRect, innerRect, innerUvRect, color);
        };
        RenderCommands.prototype.drawRect = function (tmpV1, tmpV2, tmpV3, tmpV4, texture) {
            var renderMesh = this.renderMesh;
            if (!renderMesh.canDrawRect() || texture !== this.currentTexture) {
                this.end();
                this.start();
                this.currentTexture = texture;
            }
            renderMesh.drawRect(tmpV1, tmpV2, tmpV3, tmpV4);
        };
        RenderCommands.prototype.drawMesh = function (renderMesh, texture) {
            if (this.renderMesh.vertexCount > 0) {
                //Flush current mesh first!!
                this.end();
                this.start();
            }
            this.drawMeshInternal(renderMesh, texture);
        };
        RenderCommands.prototype.end = function () {
            this.drawMeshInternal(this.renderMesh, this.currentTexture);
            this.currentTexture = null;
        };
        RenderCommands.prototype.drawMeshInternal = function (renderMesh, texture) {
            if (!s2d.EngineConfiguration.RENDER_ENABLED)
                return;
            if (renderMesh.vertexCount === 0)
                return;
            var gl = s2d.renderer.gl;
            this.renderProgram.useProgram();
            this.renderProgram.setUniform2f("u_resolution", gl.canvas.width, gl.canvas.height);
            texture.useTexture();
            var vertexBuffer = this.renderVertexBuffers[this.currentBufferIndex];
            var indexBuffer = this.renderIndexBuffers[this.currentBufferIndex];
            vertexBuffer.setData(renderMesh.vertexArray, false);
            indexBuffer.setData(renderMesh.indexArray, false);
            this.renderProgram.setVertexAttributePointer("a_position", vertexBuffer, 2, gl.FLOAT, false, s2d.RenderMesh.VERTEX_SIZE, 0);
            this.renderProgram.setVertexAttributePointer("a_color", vertexBuffer, 4, gl.UNSIGNED_BYTE, true, s2d.RenderMesh.VERTEX_SIZE, 8);
            this.renderProgram.setVertexAttributePointer("a_texcoord", vertexBuffer, 2, gl.UNSIGNED_SHORT, true, s2d.RenderMesh.VERTEX_SIZE, 12);
            if (texture.hasAlpha) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            }
            else {
                gl.disable(gl.BLEND);
            }
            s2d.engine.stats.incrmentDrawcalls();
            gl.drawElements(gl.TRIANGLES, renderMesh.indexCount, gl.UNSIGNED_SHORT, 0);
            this.currentBufferIndex = (this.currentBufferIndex + 1) % this.renderVertexBuffers.length;
        };
        return RenderCommands;
    }());
    RenderCommands.vertexShader = "\n            attribute vec2 a_position;\n            attribute vec4 a_color;\n            attribute vec2 a_texcoord;\n\n            // screen resolution\n            uniform vec2 u_resolution;\n\n            // color used in fragment shader\n            varying vec4 v_color;\n\n            // texture used in vertex shader\n            varying vec2 v_texcoord;\n\n            // all shaders have a main function\n            void main() {\n                // convert the position from pixels to 0.0 to 1.0\n                vec2 zeroToOne = a_position / u_resolution;\n            \n                // convert from 0->1 to 0->2\n                vec2 zeroToTwo = zeroToOne * 2.0;\n            \n                // convert from 0->2 to -1->+1 (clipspace)\n                vec2 clipSpace = zeroToTwo - 1.0;\n\n                // vertical flip, so top/left is (0,0)\n                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); \n                //gl_Position = vec4(clipSpace, 0, 1);\n\n                // pass vertex color to fragment shader\n                v_color = a_color;\n\n                v_texcoord = a_texcoord;\n            }\n        ";
    RenderCommands.fragmentShader = "\n            // fragment shaders don't have a default precision so we need\n            // to pick one. mediump is a good default\n            precision mediump float;\n\n            //color received from vertex shader\n            varying vec4 v_color;\n\n            //texture uv received from vertex shader\n            varying vec2 v_texcoord;\n\n            // Main texture.\n            uniform sampler2D u_texture;\n\n            void main() {\n\n                gl_FragColor = texture2D(u_texture, v_texcoord) * v_color;\n\n                //gl_FragColor = v_color;\n            }\n        ";
    RenderCommands.BUFFERS_COUNT = 16;
    s2d.RenderCommands = RenderCommands;
})(s2d || (s2d = {}));
/// <reference path="RenderCommands.ts" />
var s2d;
(function (s2d) {
    var RenderManager = (function () {
        function RenderManager() {
            this.tmpCameras = new Array(4);
            this.tmpDrawers = new Array(1024);
            this.tmpLayouts = new Array(1024);
        }
        Object.defineProperty(RenderManager.prototype, "contextLost", {
            get: function () {
                return this._contextLost;
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(RenderManager.prototype, "gl", {
            get: function () {
                return this._gl;
            },
            enumerable: true,
            configurable: true
        });
        RenderManager.prototype.init = function () {
            var _this = this;
            this.mainCanvas = document.getElementById("mainCanvas");
            if (this.mainCanvas) {
                //don't show context menu
                this.mainCanvas.addEventListener("contextmenu", function (ev) { ev.preventDefault(); }, true);
                window.addEventListener("contextmenu", function (ev) { ev.preventDefault(); }, true);
                //resize canvas on window resize
                window.addEventListener("resize", function () { return _this.onWindowResize(); }, false);
                //register webgl context lost event
                this.mainCanvas.addEventListener("webglcontextlost", function () { return _this.onWebGLContextLost(); }, false);
                this.mainCanvas.addEventListener("webglcontextrestored", function () { return _this.onWebGLContextRestored(); }, false);
                this.initWebGL();
            }
        };
        RenderManager.prototype.onWindowResize = function () {
            this._screenWidth = window.innerWidth;
            this._screenHeight = window.innerHeight;
            this.mainCanvas.width = this._screenWidth;
            this.mainCanvas.height = this._screenHeight;
            this.gl.viewport(0, 0, this._screenWidth, this._screenHeight);
        };
        RenderManager.prototype.onWebGLContextLost = function () {
            this._contextLost = true;
            console.error("WebGL context lost! Not handled yet..");
        };
        RenderManager.prototype.onWebGLContextRestored = function () {
            this._contextLost = false;
        };
        RenderManager.prototype.initWebGL = function () {
            this._gl = this.mainCanvas.getContext("webgl", { alpha: false });
            if (!this._gl)
                this._gl = this.mainCanvas.getContext("experimental-webgl");
            if (!this._gl)
                return;
            var gl = this._gl;
            //Default clear color
            gl.clearColor(0, 0, 0, 1);
            //Disable depth test and writing to depth mask
            gl.disable(gl.DEPTH_TEST);
            gl.depthMask(false);
            this._commands = new s2d.RenderCommands();
            this.onWindowResize();
        };
        /**
         * Enters full screen mode. This function can only be called when triggered from a user initiated action (ex: click event handler)
         */
        RenderManager.prototype.enterFullscreen = function () {
            //Taken from phaser source code!!
            //https://github.com/photonstorm/phaser/blob/master/src/system/Device.js
            var fs = [
                'requestFullscreen',
                'requestFullScreen',
                'webkitRequestFullscreen',
                'webkitRequestFullScreen',
                'msRequestFullscreen',
                'msRequestFullScreen',
                'mozRequestFullScreen',
                'mozRequestFullscreen'
            ];
            var element = this.mainCanvas;
            for (var i = 0; i < fs.length; i++) {
                if (element[fs[i]]) {
                    element[fs[i]]();
                    break;
                }
            }
        };
        RenderManager.prototype.exitFullscreen = function () {
            //Taken from phaser source code!!
            //https://github.com/photonstorm/phaser/blob/master/src/system/Device.js
            var cfs = [
                'cancelFullScreen',
                'exitFullscreen',
                'webkitCancelFullScreen',
                'webkitExitFullscreen',
                'msCancelFullScreen',
                'msExitFullscreen',
                'mozCancelFullScreen',
                'mozExitFullscreen'
            ];
            var doc = document;
            for (var i = 0; i < cfs.length; i++) {
                if (doc[cfs[i]]) {
                    doc[cfs[i]]();
                    break;
                }
            }
        };
        RenderManager.prototype.draw = function () {
            var cameras = this.tmpCameras;
            var camerasLen = s2d.engine.entities.getComponentsInChildren(s2d.Camera, cameras);
            var drawers = this.tmpDrawers;
            var drawersLen = s2d.engine.entities.getComponentsInChildren(s2d.Drawer, drawers);
            var layouts = this.tmpLayouts;
            var layoutsLen = s2d.engine.entities.getComponentsInChildren(s2d.Layout, layouts);
            if (camerasLen === 0)
                console.warn("No cameras to draw!!");
            if (drawersLen === 0)
                console.warn("No entities to draw!!");
            for (var i = 0; i < layoutsLen; i++)
                layouts[i].updateLayout();
            this._commands.startFrame();
            for (var i = 0; i < camerasLen; i++)
                this.renderCamera(cameras[i], drawers, drawersLen);
            this._commands.endFrame();
        };
        RenderManager.prototype.renderCamera = function (camera, drawers, drawersLen) {
            var commands = this._commands;
            if (s2d.EngineConfiguration.RENDER_ENABLED) {
                var gl = this.gl;
                var clearFlags = 0;
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
            for (var i = 0; i < drawersLen; i++)
                drawers[i].draw(commands);
            commands.end();
        };
        return RenderManager;
    }());
    s2d.RenderManager = RenderManager;
})(s2d || (s2d = {}));
/// <reference path="Component.ts" />
var s2d;
(function (s2d) {
    var Transform = (function (_super) {
        __extends(Transform, _super);
        function Transform() {
            var _this = _super.apply(this, arguments) || this;
            _this._parent = null;
            _this._position = s2d.Vector2.create();
            _this._rotation = 0;
            _this._scale = s2d.Vector2.fromValues(1, 1);
            _this._size = s2d.Vector2.fromValues(0, 0);
            _this._pivot = s2d.Vector2.create();
            //Linked list of children
            _this._firstChild = null;
            _this._lastChild = null;
            //Linked list of siblings
            _this._prevSibling = null;
            _this._nextSibling = null;
            _this._localMatrixDirty = true;
            _this._localMatrix = s2d.Matrix2d.create();
            return _this;
        }
        Object.defineProperty(Transform.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (p) {
                if (this._parent === null)
                    s2d.engine.entities.root.removeChild(this);
                else
                    this._parent.removeChild(this);
                this._parent = p;
                if (this._parent === null)
                    s2d.engine.entities.root.addChildLast(this);
                else
                    this._parent.addChildLast(this);
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.onInit = function () {
            s2d.engine.entities.root.addChildLast(this);
            this.setLocalMatrixDirty();
        };
        Transform.prototype.onDestroy = function () {
            //Destroy child entities
            var child = this._firstChild;
            while (child !== null) {
                var tmp = child.entity;
                child = child._nextSibling;
                tmp.destroy();
            }
            if (this._parent === null)
                s2d.engine.entities.root.removeChild(this);
            else
                this._parent.removeChild(this);
            this._parent = null;
        };
        Transform.prototype.setParent = function (p) {
            this.parent = p;
            return this;
        };
        Object.defineProperty(Transform.prototype, "localPosition", {
            get: function () {
                return this._position;
            },
            set: function (p) {
                if (!s2d.Vector2.equals(this._position, p)) {
                    s2d.Vector2.copy(this._position, p);
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "localX", {
            get: function () {
                return this._position[0];
            },
            set: function (v) {
                if (!s2d.SMath.equals(this._position[0], v)) {
                    this._position[0] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "localY", {
            get: function () {
                return this._position[1];
            },
            set: function (v) {
                if (!s2d.SMath.equals(this._position[1], v)) {
                    this._position[1] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.setLocalPosition = function (x, y) {
            if (!s2d.SMath.equals(this._position[0], x) ||
                !s2d.SMath.equals(this._position[1], y)) {
                this._position[0] = x;
                this._position[1] = y;
                this.setLocalMatrixDirty();
            }
            return this;
        };
        Object.defineProperty(Transform.prototype, "localRotationRadians", {
            get: function () {
                return this._rotation;
            },
            set: function (rad) {
                if (!s2d.SMath.equals(this._rotation, rad)) {
                    this._rotation = rad;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "localRotationDegrees", {
            get: function () {
                return this._rotation * s2d.SMath.rad2deg;
            },
            set: function (deg) {
                this.localRotationRadians = deg * s2d.SMath.deg2rad;
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.setLocalRotationRadians = function (rad) {
            this.localRotationRadians = rad;
            return this;
        };
        Transform.prototype.setlocalRotationDegrees = function (deg) {
            this.localRotationDegrees = deg;
            return this;
        };
        Object.defineProperty(Transform.prototype, "localScale", {
            get: function () {
                return this._scale;
            },
            set: function (ss) {
                if (!s2d.Vector2.equals(this._scale, ss)) {
                    s2d.Vector2.copy(this._scale, ss);
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "localScaleX", {
            get: function () {
                return this._scale[0];
            },
            set: function (v) {
                if (!s2d.SMath.equals(this._scale[0], v)) {
                    this._scale[0] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "localScaleY", {
            get: function () {
                return this._scale[1];
            },
            set: function (v) {
                if (!s2d.SMath.equals(this._scale[1], v)) {
                    this._scale[1] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.setLocalScale = function (x, y) {
            if (!s2d.SMath.equals(this._scale[0], x) ||
                !s2d.SMath.equals(this._scale[1], y)) {
                this._scale[0] = x;
                this._scale[1] = y;
                this.setLocalMatrixDirty();
            }
            return this;
        };
        Object.defineProperty(Transform.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (s) {
                if (!s2d.Vector2.equals(this._size, s)) {
                    s2d.Vector2.copy(this._size, s);
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "sizeX", {
            get: function () {
                return this._size[0];
            },
            set: function (v) {
                if (!s2d.SMath.equals(this._size[0], v)) {
                    this._size[0] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "sizeY", {
            get: function () {
                return this._size[1];
            },
            set: function (v) {
                if (!s2d.SMath.equals(this._size[1], v)) {
                    this._size[1] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.setSize = function (x, y) {
            if (!s2d.SMath.equals(this._size[0], x) ||
                !s2d.SMath.equals(this._size[1], y)) {
                this._size[0] = x;
                this._size[1] = y;
                this.setLocalMatrixDirty();
            }
            return this;
        };
        Object.defineProperty(Transform.prototype, "pivot", {
            get: function () {
                return this._pivot;
            },
            set: function (p) {
                var x = s2d.SMath.clamp(p[0], -1, 1);
                var y = s2d.SMath.clamp(p[1], -1, 1);
                if (!s2d.SMath.equals(this._pivot[0], x) ||
                    !s2d.SMath.equals(this._pivot[1], y)) {
                    this._pivot[0] = x;
                    this._pivot[1] = y;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "pivotX", {
            get: function () {
                return this._pivot[0];
            },
            set: function (v) {
                v = s2d.SMath.clamp(v, -1, 1);
                if (!s2d.SMath.equals(this._pivot[0], v)) {
                    this._pivot[0] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transform.prototype, "pivotY", {
            get: function () {
                return this._pivot[1];
            },
            set: function (v) {
                v = s2d.SMath.clamp(v, -1, 1);
                if (!s2d.SMath.equals(this._pivot[1], v)) {
                    this._pivot[1] = v;
                    this.setLocalMatrixDirty();
                }
            },
            enumerable: true,
            configurable: true
        });
        Transform.prototype.setPivot = function (x, y) {
            x = s2d.SMath.clamp(x, -1, 1);
            y = s2d.SMath.clamp(x, -1, 1);
            if (!s2d.SMath.equals(this._pivot[0], x) ||
                !s2d.SMath.equals(this._pivot[1], y)) {
                this._pivot[0] = x;
                this._pivot[1] = y;
                this.setLocalMatrixDirty();
            }
            return this;
        };
        Transform.prototype.setLocalMatrixDirty = function () {
            this._localMatrixDirty = true;
        };
        Transform.initStatic = function () {
            Transform.tmpV1 = s2d.Vector2.create();
            Transform.tmpV2 = s2d.Vector2.create();
            Transform.tmpV3 = s2d.Vector2.create();
            Transform.tmpV4 = s2d.Vector2.create();
            Transform.tmpMatrix = s2d.Matrix2d.create();
            Transform.tmpSizeAndPivtot = s2d.Vector2.create();
        };
        Transform.prototype.getBounds = function (out) {
            var tmpV1 = Transform.tmpV1;
            var tmpV2 = Transform.tmpV2;
            var tmpV3 = Transform.tmpV3;
            var tmpV4 = Transform.tmpV4;
            var tmpMatrix = Transform.tmpMatrix;
            this.getLocalToGlobalMatrix(tmpMatrix);
            //Top left
            tmpV1[0] = 0;
            tmpV1[1] = 0;
            //Top right
            tmpV2[0] = this._size[0];
            tmpV2[1] = 0;
            //Bottom right
            tmpV3[0] = this._size[0];
            tmpV3[1] = this._size[1];
            //Bottom left
            tmpV4[0] = 0;
            tmpV4[1] = this._size[1];
            s2d.Vector2.transformMat2d(tmpV1, tmpV1, tmpMatrix);
            s2d.Vector2.transformMat2d(tmpV2, tmpV2, tmpMatrix);
            s2d.Vector2.transformMat2d(tmpV3, tmpV3, tmpMatrix);
            s2d.Vector2.transformMat2d(tmpV4, tmpV4, tmpMatrix);
            var minX = Math.min(tmpV1[0], tmpV2[0], tmpV3[0], tmpV4[0]);
            var minY = Math.min(tmpV1[1], tmpV2[1], tmpV3[1], tmpV4[1]);
            var maxX = Math.max(tmpV1[0], tmpV2[0], tmpV3[0], tmpV4[0]);
            var maxY = Math.max(tmpV1[1], tmpV2[1], tmpV3[1], tmpV4[1]);
            s2d.Rect.set(out, minX, minY, maxX - minX, maxY - minY);
            return out;
        };
        Transform.prototype.getLocalMatrix = function () {
            var localMatrix = this._localMatrix;
            if (this._localMatrixDirty) {
                var localMatrix_1 = this._localMatrix;
                var size = this._size;
                var pivot = this._pivot;
                var sizeAndPivot = Transform.tmpSizeAndPivtot;
                sizeAndPivot[0] = -size[0] * 0.5 * (pivot[0] + 1);
                sizeAndPivot[1] = -size[1] * 0.5 * (pivot[1] + 1);
                s2d.Matrix2d.fromTranslation(localMatrix_1, this._position);
                s2d.Matrix2d.scale(localMatrix_1, localMatrix_1, this._scale);
                s2d.Matrix2d.rotate(localMatrix_1, localMatrix_1, this._rotation);
                s2d.Matrix2d.translate(localMatrix_1, localMatrix_1, sizeAndPivot);
                this._localMatrixDirty = false;
            }
            return localMatrix;
        };
        Transform.prototype.getLocalToGlobalMatrix = function (out) {
            s2d.Matrix2d.copy(out, this.getLocalMatrix());
            var p = this._parent;
            while (p !== null) {
                s2d.Matrix2d.mul(out, p.getLocalMatrix(), out);
                p = p._parent;
            }
            return out;
        };
        Transform.prototype.getGlobalToLocalMatrix = function (out) {
            this.getLocalToGlobalMatrix(out);
            s2d.Matrix2d.invert(out, out);
            return out;
        };
        Transform.prototype.addChildLast = function (p) {
            if (this._firstChild === null) {
                this._firstChild = this._lastChild = p;
            }
            else {
                this._lastChild._nextSibling = p;
                p._prevSibling = this._lastChild;
                this._lastChild = p;
            }
        };
        Transform.prototype.addChildFirst = function (p) {
            p._nextSibling = this._firstChild;
            if (this._firstChild !== null)
                this._firstChild._prevSibling = p;
            this._firstChild = p;
            if (this._lastChild === null)
                this._lastChild = p;
        };
        Transform.prototype.removeChild = function (p) {
            if (p._nextSibling !== null)
                p._nextSibling._prevSibling = p._prevSibling;
            if (p._prevSibling !== null)
                p._prevSibling._nextSibling = p._nextSibling;
            if (p === this._firstChild)
                this._firstChild = p._nextSibling;
            if (p === this._lastChild)
                this._lastChild = p._prevSibling;
            p._nextSibling = null;
            p._prevSibling = null;
        };
        Transform.prototype.getFirstChild = function () {
            return this._firstChild;
        };
        Transform.prototype.getNextChild = function (prevChild) {
            return prevChild._nextSibling;
        };
        Transform.prototype.getComponentsInChildren = function (clazz, toReturn, includeInactive) {
            if (includeInactive === void 0) { includeInactive = false; }
            if (clazz === s2d.Behavior)
                return this.getBehaviorsInChildrenInternal(toReturn, 0, includeInactive);
            else if (clazz === s2d.Drawer)
                return this.getDrawersInChildrenInternal(toReturn, 0, includeInactive);
            else if (clazz === s2d.Layout)
                return this.getLayoutsInChildrenInternal(toReturn, 0, includeInactive);
            return this.getComponentsInChildrenInternal(clazz, toReturn, 0, includeInactive);
        };
        Transform.prototype.getComponentsInChildrenInternal = function (clazz, toReturn, index, includeInactive) {
            var entity = this.entity;
            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;
                var comp = entity.getComponent(clazz);
                if (comp !== null)
                    toReturn[index++] = comp;
            }
            var child = this._firstChild;
            while (child !== null) {
                index = child.getComponentsInChildrenInternal(clazz, toReturn, index, includeInactive);
                child = child._nextSibling;
            }
            return index;
        };
        Transform.prototype.getBehaviorsInChildrenInternal = function (toReturn, index, includeInactive) {
            var entity = this.entity;
            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;
                if (this.entity.firstBehavior !== null)
                    toReturn[index++] = this.entity.firstBehavior;
            }
            var child = this._firstChild;
            while (child !== null) {
                index = child.getBehaviorsInChildrenInternal(toReturn, index, includeInactive);
                child = child._nextSibling;
            }
            return index;
        };
        Transform.prototype.getDrawersInChildrenInternal = function (toReturn, index, includeInactive) {
            var entity = this.entity;
            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;
                if (entity.firstDrawer !== null)
                    toReturn[index++] = entity.firstDrawer;
            }
            var child = this._firstChild;
            while (child !== null) {
                index = child.getDrawersInChildrenInternal(toReturn, index, includeInactive);
                child = child._nextSibling;
            }
            return index;
        };
        Transform.prototype.getLayoutsInChildrenInternal = function (toReturn, index, includeInactive) {
            var entity = this.entity;
            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;
                if (entity.firstLayout !== null)
                    toReturn[index++] = entity.firstLayout;
            }
            var child = this._firstChild;
            while (child !== null) {
                index = child.getLayoutsInChildrenInternal(toReturn, index, includeInactive);
                child = child._nextSibling;
            }
            return index;
        };
        /**
         * Makes the transform the first child in the parent container
         */
        Transform.prototype.moveToTop = function () {
            if (this._prevSibling !== null) {
                //We remove ourselve from our parent and then we add ourselves again
                //at the beginning
                var p = (this._parent === null) ? s2d.engine.entities.root : this._parent;
                p.removeChild(this);
                p.addChildFirst(this);
            }
        };
        /**
         * Makes the transform the last child in the parent container
         */
        Transform.prototype.moveToBottom = function () {
            if (this._nextSibling !== null) {
                //We remove ourselve from our parent and then we add ourselves again,
                //which leaves us at the bottom.. 
                var p = (this._parent === null) ? s2d.engine.entities.root : this._parent;
                p.removeChild(this);
                p.addChildLast(this);
            }
        };
        return Transform;
    }(s2d.Component));
    s2d.Transform = Transform;
})(s2d || (s2d = {}));
//Port of glMatrix, taken from: https://github.com/toji/gl-matrix
var s2d;
(function (s2d) {
    /* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE. */
    /**
     * @class 3x3 Matrix
     * @name Matrix3
     */
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        function Matrix3() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * Creates a new identity Matrix3
         *
         * @returns {Matrix3} a new 3x3 matrix
         */
        Matrix3.create = function () {
            var a = new Float32Array(9);
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            a[4] = 1;
            a[5] = 0;
            a[6] = 0;
            a[7] = 0;
            a[8] = 1;
            return a;
        };
        ;
        /**
         * Copies the upper-left 3x3 values into the given Matrix3.
         *
         * @param {Matrix3} out the receiving 3x3 matrix
         * @param {mat4} a   the source 4x4 matrix
         * @returns {Matrix3} out
         */
        /*
        Matrix3.fromMat4 = function(out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[4];
            out[4] = a[5];
            out[5] = a[6];
            out[6] = a[8];
            out[7] = a[9];
            out[8] = a[10];
            return out;
        };
        */
        /**
         * Creates a new Matrix3 initialized with values from an existing matrix
         *
         * @param {Matrix3} a matrix to clone
         * @returns {Matrix3} a new 3x3 matrix
         */
        Matrix3.clone = function (a) {
            var out = Matrix3.create();
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        };
        ;
        /**
         * Copy the values from one Matrix3 to another
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the source matrix
         * @returns {Matrix3} out
         */
        Matrix3.copy = function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        };
        ;
        /**
         * Create a new Matrix3 with the given values
         *
         * @param {Number} m00 Component in column 0, row 0 position (index 0)
         * @param {Number} m01 Component in column 0, row 1 position (index 1)
         * @param {Number} m02 Component in column 0, row 2 position (index 2)
         * @param {Number} m10 Component in column 1, row 0 position (index 3)
         * @param {Number} m11 Component in column 1, row 1 position (index 4)
         * @param {Number} m12 Component in column 1, row 2 position (index 5)
         * @param {Number} m20 Component in column 2, row 0 position (index 6)
         * @param {Number} m21 Component in column 2, row 1 position (index 7)
         * @param {Number} m22 Component in column 2, row 2 position (index 8)
         * @returns {Matrix3} A new Matrix3
         */
        Matrix3.fromValues = function (m00, m01, m02, m10, m11, m12, m20, m21, m22) {
            var out = Matrix3.create();
            out[0] = m00;
            out[1] = m01;
            out[2] = m02;
            out[3] = m10;
            out[4] = m11;
            out[5] = m12;
            out[6] = m20;
            out[7] = m21;
            out[8] = m22;
            return out;
        };
        ;
        /**
         * Set the components of a Matrix3 to the given values
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Number} m00 Component in column 0, row 0 position (index 0)
         * @param {Number} m01 Component in column 0, row 1 position (index 1)
         * @param {Number} m02 Component in column 0, row 2 position (index 2)
         * @param {Number} m10 Component in column 1, row 0 position (index 3)
         * @param {Number} m11 Component in column 1, row 1 position (index 4)
         * @param {Number} m12 Component in column 1, row 2 position (index 5)
         * @param {Number} m20 Component in column 2, row 0 position (index 6)
         * @param {Number} m21 Component in column 2, row 1 position (index 7)
         * @param {Number} m22 Component in column 2, row 2 position (index 8)
         * @returns {Matrix3} out
         */
        Matrix3.set = function (out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
            out[0] = m00;
            out[1] = m01;
            out[2] = m02;
            out[3] = m10;
            out[4] = m11;
            out[5] = m12;
            out[6] = m20;
            out[7] = m21;
            out[8] = m22;
            return out;
        };
        ;
        /**
         * Set a Matrix3 to the identity matrix
         *
         * @param {Matrix3} out the receiving matrix
         * @returns {Matrix3} out
         */
        Matrix3.identity = function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        };
        ;
        /**
         * Transpose the values of a Matrix3
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the source matrix
         * @returns {Matrix3} out
         */
        Matrix3.transpose = function (out, a) {
            // If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a01 = a[1], a02 = a[2], a12 = a[5];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a01;
                out[5] = a[7];
                out[6] = a02;
                out[7] = a12;
            }
            else {
                out[0] = a[0];
                out[1] = a[3];
                out[2] = a[6];
                out[3] = a[1];
                out[4] = a[4];
                out[5] = a[7];
                out[6] = a[2];
                out[7] = a[5];
                out[8] = a[8];
            }
            return out;
        };
        ;
        /**
         * Inverts a Matrix3
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the source matrix
         * @returns {Matrix3} out
         */
        Matrix3.invert = function (out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, 
            // Calculate the determinant
            det = a00 * b01 + a01 * b11 + a02 * b21;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = b01 * det;
            out[1] = (-a22 * a01 + a02 * a21) * det;
            out[2] = (a12 * a01 - a02 * a11) * det;
            out[3] = b11 * det;
            out[4] = (a22 * a00 - a02 * a20) * det;
            out[5] = (-a12 * a00 + a02 * a10) * det;
            out[6] = b21 * det;
            out[7] = (-a21 * a00 + a01 * a20) * det;
            out[8] = (a11 * a00 - a01 * a10) * det;
            return out;
        };
        ;
        /**
         * Calculates the adjugate of a Matrix3
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the source matrix
         * @returns {Matrix3} out
         */
        Matrix3.adjoint = function (out, a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            out[0] = (a11 * a22 - a12 * a21);
            out[1] = (a02 * a21 - a01 * a22);
            out[2] = (a01 * a12 - a02 * a11);
            out[3] = (a12 * a20 - a10 * a22);
            out[4] = (a00 * a22 - a02 * a20);
            out[5] = (a02 * a10 - a00 * a12);
            out[6] = (a10 * a21 - a11 * a20);
            out[7] = (a01 * a20 - a00 * a21);
            out[8] = (a00 * a11 - a01 * a10);
            return out;
        };
        ;
        /**
         * Calculates the determinant of a Matrix3
         *
         * @param {Matrix3} a the source matrix
         * @returns {Number} determinant of a
         */
        Matrix3.determinant = function (a) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8];
            return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
        };
        ;
        /**
         * Multiplies two Matrix3's
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the first operand
         * @param {Matrix3} b the second operand
         * @returns {Matrix3} out
         */
        Matrix3.mul = function (out, a, b) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], b00 = b[0], b01 = b[1], b02 = b[2], b10 = b[3], b11 = b[4], b12 = b[5], b20 = b[6], b21 = b[7], b22 = b[8];
            out[0] = b00 * a00 + b01 * a10 + b02 * a20;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22;
            out[3] = b10 * a00 + b11 * a10 + b12 * a20;
            out[4] = b10 * a01 + b11 * a11 + b12 * a21;
            out[5] = b10 * a02 + b11 * a12 + b12 * a22;
            out[6] = b20 * a00 + b21 * a10 + b22 * a20;
            out[7] = b20 * a01 + b21 * a11 + b22 * a21;
            out[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return out;
        };
        ;
        /**
         * Translate a Matrix3 by the given vector
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the matrix to translate
         * @param {Vector2} v vector to translate by
         * @returns {Matrix3} out
         */
        Matrix3.translate = function (out, a, v) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a10;
            out[4] = a11;
            out[5] = a12;
            out[6] = x * a00 + y * a10 + a20;
            out[7] = x * a01 + y * a11 + a21;
            out[8] = x * a02 + y * a12 + a22;
            return out;
        };
        ;
        /**
         * Rotates a Matrix3 by the given angle
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix3} out
         */
        Matrix3.rotate = function (out, a, rad) {
            var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c * a00 + s * a10;
            out[1] = c * a01 + s * a11;
            out[2] = c * a02 + s * a12;
            out[3] = c * a10 - s * a00;
            out[4] = c * a11 - s * a01;
            out[5] = c * a12 - s * a02;
            out[6] = a20;
            out[7] = a21;
            out[8] = a22;
            return out;
        };
        ;
        /**
         * Scales the Matrix3 by the dimensions in the given Vector2
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the matrix to rotate
         * @param {Vector2} v the Vector2 to scale the matrix by
         * @returns {Matrix3} out
         **/
        Matrix3.scale = function (out, a, v) {
            var x = v[0], y = v[1];
            out[0] = x * a[0];
            out[1] = x * a[1];
            out[2] = x * a[2];
            out[3] = y * a[3];
            out[4] = y * a[4];
            out[5] = y * a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[8] = a[8];
            return out;
        };
        ;
        /**
         * Creates a matrix from a vector translation
         * This is equivalent to (but much faster than):
         *
         *     Matrix3.identity(dest);
         *     Matrix3.translate(dest, dest, vec);
         *
         * @param {Matrix3} out Matrix3 receiving operation result
         * @param {Vector2} v Translation vector
         * @returns {Matrix3} out
         */
        Matrix3.fromTranslation = function (out, v) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 1;
            out[5] = 0;
            out[6] = v[0];
            out[7] = v[1];
            out[8] = 1;
            return out;
        };
        /**
         * Creates a matrix from a given angle
         * This is equivalent to (but much faster than):
         *
         *     Matrix3.identity(dest);
         *     Matrix3.rotate(dest, dest, rad);
         *
         * @param {Matrix3} out Matrix3 receiving operation result
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix3} out
         */
        Matrix3.fromRotation = function (out, rad) {
            var s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = 0;
            out[3] = -s;
            out[4] = c;
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        };
        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     Matrix3.identity(dest);
         *     Matrix3.scale(dest, dest, vec);
         *
         * @param {Matrix3} out Matrix3 receiving operation result
         * @param {Vector2} v Scaling vector
         * @returns {Matrix3} out
         */
        Matrix3.fromScaling = function (out, v) {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = v[1];
            out[5] = 0;
            out[6] = 0;
            out[7] = 0;
            out[8] = 1;
            return out;
        };
        /**
         * Copies the values from a Matrix2d into a Matrix3
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix2d} a the matrix to copy
         * @returns {Matrix3} out
         **/
        Matrix3.fromMat2d = function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = 0;
            out[3] = a[2];
            out[4] = a[3];
            out[5] = 0;
            out[6] = a[4];
            out[7] = a[5];
            out[8] = 1;
            return out;
        };
        ;
        /**
        * Calculates a 3x3 matrix from the given quaternion
        *
        * @param {Matrix3} out Matrix3 receiving operation result
        * @param {quat} q Quaternion to create matrix from
        *
        * @returns {Matrix3} out
        */
        /*
        Matrix3.fromQuat = function (out, q) {
            let x = q[0], y = q[1], z = q[2], w = q[3],
                x2 = x + x,
                y2 = y + y,
                z2 = z + z,

                xx = x * x2,
                yx = y * x2,
                yy = y * y2,
                zx = z * x2,
                zy = z * y2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            out[0] = 1 - yy - zz;
            out[3] = yx - wz;
            out[6] = zx + wy;

            out[1] = yx + wz;
            out[4] = 1 - xx - zz;
            out[7] = zy - wx;

            out[2] = zx - wy;
            out[5] = zy + wx;
            out[8] = 1 - xx - yy;

            return out;
        };
        */
        /**
        * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
        *
        * @param {Matrix3} out Matrix3 receiving operation result
        * @param {mat4} a Mat4 to derive the normal matrix from
        *
        * @returns {Matrix3} out
        */
        /*
        Matrix3.normalFromMat4 = function (out, a) {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
                a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
                a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
                a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32,

                // Calculate the determinant
                det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (!det) {
                return null;
            }
            det = 1.0 / det;

            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

            out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

            out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

            return out;
        };
        */
        /**
         * Returns a string representation of a Matrix3
         *
         * @param {Matrix3} a matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        Matrix3.toString = function (a) {
            return 'Matrix3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
                a[6] + ', ' + a[7] + ', ' + a[8] + ')';
        };
        ;
        /**
         * Returns Frobenius norm of a Matrix3
         *
         * @param {Matrix3} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        Matrix3.frob = function (a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)));
        };
        ;
        /**
         * Adds two Matrix3's
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the first operand
         * @param {Matrix3} b the second operand
         * @returns {Matrix3} out
         */
        Matrix3.add = function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            out[6] = a[6] + b[6];
            out[7] = a[7] + b[7];
            out[8] = a[8] + b[8];
            return out;
        };
        ;
        /**
         * Subtracts matrix b from matrix a
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the first operand
         * @param {Matrix3} b the second operand
         * @returns {Matrix3} out
         */
        Matrix3.sub = function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            out[6] = a[6] - b[6];
            out[7] = a[7] - b[7];
            out[8] = a[8] - b[8];
            return out;
        };
        ;
        /**
         * Multiply each element of the matrix by a scalar.
         *
         * @param {Matrix3} out the receiving matrix
         * @param {Matrix3} a the matrix to scale
         * @param {Number} b amount to scale the matrix's elements by
         * @returns {Matrix3} out
         */
        Matrix3.multiplyScalar = function (out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            out[6] = a[6] * b;
            out[7] = a[7] * b;
            out[8] = a[8] * b;
            return out;
        };
        ;
        /**
         * Adds two Matrix3's after multiplying each element of the second operand by a scalar value.
         *
         * @param {Matrix3} out the receiving vector
         * @param {Matrix3} a the first operand
         * @param {Matrix3} b the second operand
         * @param {Number} scale the amount to scale b's elements by before adding
         * @returns {Matrix3} out
         */
        Matrix3.multiplyScalarAndAdd = function (out, a, b, scale) {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            out[2] = a[2] + (b[2] * scale);
            out[3] = a[3] + (b[3] * scale);
            out[4] = a[4] + (b[4] * scale);
            out[5] = a[5] + (b[5] * scale);
            out[6] = a[6] + (b[6] * scale);
            out[7] = a[7] + (b[7] * scale);
            out[8] = a[8] + (b[8] * scale);
            return out;
        };
        ;
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         *
         * @param {Matrix3} a The first matrix.
         * @param {Matrix3} b The second matrix.
         * @returns {Boolean} True if the matrices are equal, false otherwise.
         */
        Matrix3.equals = function (a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] &&
                a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
                a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
        };
        ;
        return Matrix3;
    }(Float32Array));
    s2d.Matrix3 = Matrix3;
})(s2d || (s2d = {}));
//Port of glMatrix, taken from: https://github.com/toji/gl-matrix
var s2d;
(function (s2d) {
    /* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE. */
    /**
     * @class 2 Dimensional Vector
     * @name Vector2
     */
    var Vector2 = (function (_super) {
        __extends(Vector2, _super);
        function Vector2() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * Creates a new, empty Vector2
         *
         * @returns {Vector2} a new 2D vector
         */
        Vector2.create = function () {
            var a = new Float32Array(2);
            a[0] = 0;
            a[1] = 0;
            return a;
        };
        /**
         * Creates a new Vector2 initialized with values from an existing vector
         *
         * @param {Vector2} a vector to clone
         * @returns {Vector2} a new 2D vector
         */
        Vector2.clone = function (a) {
            var out = Vector2.create();
            out[0] = a[0];
            out[1] = a[1];
            return out;
        };
        /**
         * Creates a new Vector2 initialized with the given values
         *
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {Vector2} a new 2D vector
         */
        Vector2.fromValues = function (x, y) {
            var out = Vector2.create();
            out[0] = x;
            out[1] = y;
            return out;
        };
        /**
         * Copy the values from one Vector2 to another
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the source vector
         * @returns {Vector2} out
         */
        Vector2.copy = function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            return out;
        };
        /**
         * Set the components of a Vector2 to the given values
         *
         * @param {Vector2} out the receiving vector
         * @param {Number} x X component
         * @param {Number} y Y component
         * @returns {Vector2} out
         */
        Vector2.set = function (out, x, y) {
            out[0] = x;
            out[1] = y;
            return out;
        };
        /**
         * Adds two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        Vector2.add = function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            return out;
        };
        /**
         * Subtracts vector b from vector a
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        Vector2.sub = function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            return out;
        };
        /**
         * Multiplies two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        Vector2.mul = function (out, a, b) {
            out[0] = a[0] * b[0];
            out[1] = a[1] * b[1];
            return out;
        };
        /**
         * Divides two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        Vector2.div = function (out, a, b) {
            out[0] = a[0] / b[0];
            out[1] = a[1] / b[1];
            return out;
        };
        /**
         * Math.floor the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to floor
         * @returns {Vector2} out
         */
        Vector2.floor = function (out, a) {
            out[0] = Math.floor(a[0]);
            out[1] = Math.floor(a[1]);
            return out;
        };
        /**
         * Returns the minimum of two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Vector2} out
         */
        Vector2.min = function (out, a, b) {
            out[0] = Math.min(a[0], b[0]);
            out[1] = Math.min(a[1], b[1]);
            return out;
        };
        /**
         * Math.round the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to round
         * @returns {Vector2} out
         */
        Vector2.round = function (out, a) {
            out[0] = Math.round(a[0]);
            out[1] = Math.round(a[1]);
            return out;
        };
        /**
         * Calculates the length of a Vector2
         *
         * @param {Vector2} a vector to calculate length of
         * @returns {Number} length of a
         */
        Vector2.len = function (a) {
            var x = a[0], y = a[1];
            return Math.sqrt(x * x + y * y);
        };
        /**
         * Calculates the squared length of a Vector2
         *
         * @param {Vector2} a vector to calculate squared length of
         * @returns {Number} squared length of a
         */
        Vector2.sqrLen = function (a) {
            var x = a[0], y = a[1];
            return x * x + y * y;
        };
        /**
         * Negates the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to negate
         * @returns {Vector2} out
         */
        Vector2.negate = function (out, a) {
            out[0] = -a[0];
            out[1] = -a[1];
            return out;
        };
        /**
         * Returns the inverse of the components of a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to invert
         * @returns {Vector2} out
         */
        Vector2.inverse = function (out, a) {
            out[0] = 1.0 / a[0];
            out[1] = 1.0 / a[1];
            return out;
        };
        /**
         * Normalize a Vector2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a vector to normalize
         * @returns {Vector2} out
         */
        Vector2.normalize = function (out, a) {
            var x = a[0], y = a[1];
            var len = x * x + y * y;
            if (len > 0) {
                //TODO: evaluate use of glm_invsqrt here?
                len = 1 / Math.sqrt(len);
                out[0] = a[0] * len;
                out[1] = a[1] * len;
            }
            return out;
        };
        /**
         * Calculates the dot product of two Vector2's
         *
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {Number} dot product of a and b
         */
        Vector2.dot = function (a, b) {
            return a[0] * b[0] + a[1] * b[1];
        };
        /**
         * Computes the cross product of two Vector2's
         * Note that the cross product must by definition produce a 3D vector
         *
         * @param {vec3} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @returns {vec3} out
         */
        /*
        Vector2.cross = function(out, a, b) {
            let z = a[0] * b[1] - a[1] * b[0];
            out[0] = out[1] = 0;
            out[2] = z;
            return out;
        }
        */
        /**
         * Performs a linear interpolation between two Vector2's
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the first operand
         * @param {Vector2} b the second operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {Vector2} out
         */
        Vector2.lerp = function (out, a, b, t) {
            var ax = a[0], ay = a[1];
            out[0] = ax + t * (b[0] - ax);
            out[1] = ay + t * (b[1] - ay);
            return out;
        };
        /**
         * Generates a random vector with the given scale
         *
         * @param {Vector2} out the receiving vector
         * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
         * @returns {Vector2} out
         */
        Vector2.random = function (out, scale) {
            var r = Math.random() * 2.0 * Math.PI;
            out[0] = Math.cos(r) * scale;
            out[1] = Math.sin(r) * scale;
            return out;
        };
        /**
         * Transforms the Vector2 with a Matrix2
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {Matrix2} m matrix to transform with
         * @returns {Vector2} out
         */
        Vector2.transformMat2 = function (out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[2] * y;
            out[1] = m[1] * x + m[3] * y;
            return out;
        };
        /**
         * Transforms the Vector2 with a Matrix2d
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {Matrix2d} m matrix to transform with
         * @returns {Vector2} out
         */
        Vector2.transformMat2d = function (out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[2] * y + m[4];
            out[1] = m[1] * x + m[3] * y + m[5];
            return out;
        };
        /**
         * Transforms the Vector2 normal with a Matrix2d
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {Matrix2d} m matrix to transform with
         * @returns {Vector2} out
         */
        Vector2.transformMat2dNormal = function (out, a, m) {
            var x = a[0], y = a[1];
            out[0] = m[0] * x + m[2] * y;
            out[1] = m[1] * x + m[3] * y;
            return out;
        };
        /**
         * Transforms the Vector2 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         *
         * @param {Vector2} out the receiving vector
         * @param {Vector2} a the vector to transform
         * @param {mat4} m matrix to transform with
         * @returns {Vector2} out
         */
        /*
        Vector2.transformMat4 = function(out, a, m) {
            let x = a[0],
                y = a[1];
            out[0] = m[0] * x + m[4] * y + m[12];
            out[1] = m[1] * x + m[5] * y + m[13];
            return out;
        }
        */
        /**
         * Perform some operation over an array of vec2s.
         *
         * @param {Array} a the array of vectors to iterate over
         * @param {Number} stride Number of elements between the start of each Vector2. If 0 assumes tightly packed
         * @param {Number} offset Number of elements to skip at the beginning of the array
         * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
         * @param {Function} fn Function to call for each vector in the array
         * @param {Object} [arg] additional argument to pass to fn
         * @returns {Array} a
         * @function
         */
        /*
        Vector2.forEach = (function() {
            let vec = Vector2.create();

            return function(a, stride, offset, count, fn, arg) {
                let i, l;
                if(!stride) {
                    stride = 2;
                }

                if(!offset) {
                    offset = 0;
                }
                
                if(count) {
                    l = Math.min((count * stride) + offset, a.length);
                } else {
                    l = a.length;
                }

                for(i = offset; i < l; i += stride) {
                    vec[0] = a[i]; vec[1] = a[i+1];
                    fn(vec, vec, arg);
                    a[i] = vec[0]; a[i+1] = vec[1];
                }
                
                return a;
            }
        })();
        */
        /**
         * Returns a string representation of a vector
         *
         * @param {Vector2} a vector to represent as a string
         * @returns {String} string representation of the vector
         */
        Vector2.toString = function (a) {
            return 'Vector2(' + a[0].toFixed(2) + ', ' + a[1].toFixed(2) + ')';
        };
        /**
         * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
         *
         * @param {Vector2} a The first vector.
         * @param {Vector2} b The second vector.
         * @returns {Boolean} True if the vectors are equal, false otherwise.
         */
        Vector2.equals = function (a, b) {
            return a[0] === b[0] && a[1] === b[1];
        };
        return Vector2;
    }(Float32Array));
    /**
     * Math.ceil the components of a Vector2
     *
     * @param {Vector2} out the receiving vector
     * @param {Vector2} a vector to ceil
     * @returns {Vector2} out
     */
    Vector2.ceil = function (out, a) {
        out[0] = Math.ceil(a[0]);
        out[1] = Math.ceil(a[1]);
        return out;
    };
    /**
     * Returns the maximum of two Vector2's
     *
     * @param {Vector2} out the receiving vector
     * @param {Vector2} a the first operand
     * @param {Vector2} b the second operand
     * @returns {Vector2} out
     */
    Vector2.max = function (out, a, b) {
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        return out;
    };
    /**
     * Scales a Vector2 by a scalar number
     *
     * @param {Vector2} out the receiving vector
     * @param {Vector2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {Vector2} out
     */
    Vector2.scale = function (out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        return out;
    };
    /**
     * Adds two Vector2's after scaling the second operand by a scalar value
     *
     * @param {Vector2} out the receiving vector
     * @param {Vector2} a the first operand
     * @param {Vector2} b the second operand
     * @param {Number} scale the amount to scale b by before adding
     * @returns {Vector2} out
     */
    Vector2.scaleAndAdd = function (out, a, b, scale) {
        out[0] = a[0] + (b[0] * scale);
        out[1] = a[1] + (b[1] * scale);
        return out;
    };
    /**
     * Calculates the euclidian distance between two Vector2's
     *
     * @param {Vector2} a the first operand
     * @param {Vector2} b the second operand
     * @returns {Number} distance between a and b
     */
    Vector2.dist = function (a, b) {
        var x = b[0] - a[0], y = b[1] - a[1];
        return Math.sqrt(x * x + y * y);
    };
    /**
     * Calculates the squared euclidian distance between two Vector2's
     *
     * @param {Vector2} a the first operand
     * @param {Vector2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    Vector2.sqrDist = function (a, b) {
        var x = b[0] - a[0], y = b[1] - a[1];
        return x * x + y * y;
    };
    /**
     * Transforms the Vector2 with a mat3
     * 3rd vector component is implicitly '1'
     *
     * @param {Vector2} out the receiving vector
     * @param {Vector2} a the vector to transform
     * @param {mat3} m matrix to transform with
     * @returns {Vector2} out
     */
    Vector2.transformMat3 = function (out, a, m) {
        var x = a[0], y = a[1];
        out[0] = m[0] * x + m[3] * y + m[6];
        out[1] = m[1] * x + m[4] * y + m[7];
        return out;
    };
    s2d.Vector2 = Vector2;
})(s2d || (s2d = {}));
/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />
var s2d;
(function (s2d) {
    var Drawer = (function (_super) {
        __extends(Drawer, _super);
        function Drawer() {
            return _super.apply(this, arguments) || this;
        }
        Drawer.initStatic = function () {
            Drawer.tmpMatrix = s2d.Matrix2d.create();
            Drawer.tmpVector = s2d.Vector2.create();
        };
        Drawer.prototype.draw = function (commands) {
        };
        Drawer.prototype.getBestSize = function () {
            return this.entity.transform.size;
        };
        return Drawer;
    }(s2d.Component));
    s2d.Drawer = Drawer;
})(s2d || (s2d = {}));
/// <reference path="../Component/Component.ts" />
/// <reference path="../Component/Transform.ts" />
/// <reference path="../Component/Drawer.ts" />
var s2d;
(function (s2d) {
    var Entity = (function () {
        function Entity(name) {
            if (name === void 0) { name = null; }
            this._name = "Entity";
            this._transform = null;
            this._destroyed = false;
            this._active = true;
            this._firstDrawer = null;
            this._firstBehavior = null;
            this._firstLayout = null;
            //First component in the entity
            this._firstComponent = null;
            if (name === null)
                name = "Entity " + Entity.entityConunter++;
            this._name = name;
            this._transform = this.addComponent(s2d.Transform);
        }
        Object.defineProperty(Entity.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (s) {
                this._name = s;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "transform", {
            get: function () {
                return this._transform;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "firstBehavior", {
            get: function () {
                return this._firstBehavior;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "firstDrawer", {
            get: function () {
                return this._firstDrawer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "firstLayout", {
            get: function () {
                return this._firstLayout;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "destroyed", {
            get: function () {
                return this._destroyed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Entity.prototype, "active", {
            get: function () {
                return this._active;
            },
            set: function (v) {
                this._active = v;
            },
            enumerable: true,
            configurable: true
        });
        Entity.prototype.getOrAddComponent = function (clazz) {
            var existing = this.getComponent(clazz);
            if (existing !== null)
                return existing;
            else
                return this.addComponent(clazz);
        };
        Entity.prototype.addComponent = function (clazz) {
            if (this._destroyed) {
                s2d.EngineConsole.error("Can't add components to a destroyed entity", this);
                return null;
            }
            if (this.getComponent(clazz) !== null) {
                s2d.EngineConsole.warning("Can't add the same component more than once, returning existing component", this);
                return this.getComponent(clazz);
            }
            var comp = new clazz();
            var tmp = this._firstComponent;
            this._firstComponent = comp;
            comp.__internal_nextComponent = tmp;
            if (comp instanceof s2d.Drawer)
                this._firstDrawer = comp;
            if (comp instanceof s2d.Behavior)
                this._firstBehavior = comp;
            if (comp instanceof s2d.Layout)
                this._firstLayout = comp;
            comp.init(this);
            return comp;
        };
        Entity.prototype.getComponent = function (clazz) {
            var comp = this._firstComponent;
            while (comp !== null) {
                if (comp instanceof clazz)
                    return comp;
                comp = comp.__internal_nextComponent;
            }
            return null;
        };
        Entity.prototype.getComponentInChildren = function (clazz, toReturn) {
            return this._transform.getComponentsInChildren(clazz, toReturn);
        };
        Entity.prototype.destroy = function () {
            s2d.entities.destroyEntity(this);
        };
        Entity.prototype.__internal_destroy = function () {
            if (!this._destroyed) {
                this._destroyed = true;
                //Destroy components
                var comp = this._firstComponent;
                while (comp !== null) {
                    comp.destroy();
                    comp = comp.__internal_nextComponent;
                }
            }
        };
        return Entity;
    }());
    Entity.entityConunter = 0;
    s2d.Entity = Entity;
})(s2d || (s2d = {}));
/// <reference path="Entity.ts" />
var s2d;
(function (s2d) {
    var EntityManager = (function () {
        function EntityManager() {
            this._root = new s2d.Transform();
            this._entitiesToDestroy = null;
            this._entitiesToDestroy1 = new Array();
            this._entitiesToDestroy2 = new Array();
            this._insideDestroy = false;
            this.tmpBehaviors = new Array(1024);
            this._entitiesToDestroy = this._entitiesToDestroy1;
        }
        Object.defineProperty(EntityManager.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        EntityManager.prototype.init = function () {
            this._root.setSize(0, 0).setPivot(-1, -1);
        };
        EntityManager.prototype.getComponentsInChildren = function (clazz, toReturn, includeInactive) {
            if (includeInactive === void 0) { includeInactive = false; }
            return this._root.getComponentsInChildren(clazz, toReturn, includeInactive);
        };
        EntityManager.prototype.update = function () {
            var behaviors = this.tmpBehaviors;
            var behaviorsLen = this.getComponentsInChildren(s2d.Behavior, behaviors);
            for (var i = 0; i < behaviorsLen; i++) {
                var behavior = behaviors[i];
                behavior.update();
            }
            //Destroy all entities registered for destruction
            this.destroyEntities();
        };
        EntityManager.prototype.destroyEntities = function () {
            if (this._entitiesToDestroy.length > 0) {
                this._insideDestroy = true;
                var tmp = this._entitiesToDestroy;
                //Swap array where new destroyed entities will be stored, just in case that
                //the destroy function registers new entities for destruction
                if (this._entitiesToDestroy === this._entitiesToDestroy1)
                    this._entitiesToDestroy = this._entitiesToDestroy2;
                else
                    this._entitiesToDestroy = this._entitiesToDestroy1;
                for (var i = 0; i < tmp.length; i++)
                    tmp[i].__internal_destroy();
                tmp.length = 0;
                this._insideDestroy = false;
            }
        };
        EntityManager.prototype.destroyEntity = function (entity) {
            if (!entity.destroyed) {
                if (!this._insideDestroy) {
                    //Destruction is delayed
                    this._entitiesToDestroy.push(entity);
                }
                else {
                    //We are already in the destroy loop, no need to delay the destruction
                    entity.__internal_destroy();
                }
            }
        };
        return EntityManager;
    }());
    s2d.EntityManager = EntityManager;
})(s2d || (s2d = {}));
/// <reference path="../Behavior.ts" />
var s2d;
(function (s2d) {
    var UIManager = (function (_super) {
        __extends(UIManager, _super);
        function UIManager() {
            var _this = _super.apply(this, arguments) || this;
            _this._root = null;
            return _this;
        }
        Object.defineProperty(UIManager.prototype, "root", {
            get: function () {
                return this._root;
            },
            enumerable: true,
            configurable: true
        });
        UIManager.prototype.onInit = function () {
            this._root = this.entity.transform;
            this._root.pivotX = -1;
            this._root.pivotY = -1;
            this._root.sizeX = s2d.renderer.screenWidth;
            this._root.sizeY = s2d.renderer.screenHeight;
            this._root = this.entity.transform;
        };
        UIManager.prototype.update = function () {
            this._root.setSize(s2d.renderer.screenWidth, s2d.renderer.screenHeight);
        };
        return UIManager;
    }(s2d.Behavior));
    s2d.UIManager = UIManager;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var RenderTexture = (function () {
        function RenderTexture(image, hasAlpha) {
            this._texture = null;
            this._hasAlpha = false;
            this._width = 0;
            this._height = 0;
            this._image = null;
            this._loadCompleteCallback = null;
            this._loadCompleteCallbackThis = null;
            var gl = s2d.renderer.gl;
            this._hasAlpha = hasAlpha;
            this._texture = gl.createTexture();
            var texture = this._texture;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            this._width = image.width;
            this._height = image.height;
            // Now that the image has loaded make copy it to the texture.
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //Ignore errors for NPOT textures
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        Object.defineProperty(RenderTexture.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTexture.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTexture.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderTexture.prototype, "hasAlpha", {
            get: function () {
                return this._hasAlpha;
            },
            enumerable: true,
            configurable: true
        });
        RenderTexture.prototype.clear = function () {
            var gl = s2d.renderer.gl;
            if (this._texture != null) {
                gl.deleteTexture(this._texture);
                this._texture = null;
            }
        };
        RenderTexture.prototype.useTexture = function () {
            var gl = s2d.renderer.gl;
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        };
        return RenderTexture;
    }());
    s2d.RenderTexture = RenderTexture;
})(s2d || (s2d = {}));
/// <reference path="RenderTexture.ts" />
var s2d;
(function (s2d) {
    var RenderSpriteDrawMode;
    (function (RenderSpriteDrawMode) {
        RenderSpriteDrawMode[RenderSpriteDrawMode["Normal"] = 0] = "Normal";
        RenderSpriteDrawMode[RenderSpriteDrawMode["Slice9"] = 1] = "Slice9";
    })(RenderSpriteDrawMode = s2d.RenderSpriteDrawMode || (s2d.RenderSpriteDrawMode = {}));
    var RenderSprite = (function () {
        function RenderSprite(id, texture, rect, drawMode, innerRect) {
            if (drawMode === void 0) { drawMode = RenderSpriteDrawMode.Normal; }
            if (innerRect === void 0) { innerRect = null; }
            this._id = null;
            this._texture = null;
            this._uvRect = s2d.Rect.create();
            this._rect = s2d.Rect.create();
            this._size = s2d.Vector2.create();
            this._innerUvRect = null;
            this._innerRect = null;
            this._drawMode = RenderSpriteDrawMode.Normal;
            this._id = id;
            this._texture = texture;
            s2d.Rect.copy(this._rect, rect);
            s2d.Vector2.set(this._size, rect[2], rect[3]);
            this._uvRect[0] = rect[0] / texture.width;
            this._uvRect[1] = rect[1] / texture.height;
            this._uvRect[2] = rect[2] / texture.width;
            this._uvRect[3] = rect[3] / texture.height;
            this._drawMode = drawMode;
            if (innerRect !== null) {
                this._innerRect = s2d.Rect.create();
                s2d.Rect.copy(this._innerRect, innerRect);
                this._innerUvRect = s2d.Rect.create();
                this._innerUvRect[0] = innerRect[0] / texture.width;
                this._innerUvRect[1] = innerRect[1] / texture.height;
                this._innerUvRect[2] = innerRect[2] / texture.width;
                this._innerUvRect[3] = innerRect[3] / texture.height;
            }
            if (drawMode !== RenderSpriteDrawMode.Normal && this._innerUvRect === null)
                s2d.EngineConsole.error("Missing innerUvRect for draw mode " + drawMode, this);
        }
        Object.defineProperty(RenderSprite.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "rect", {
            get: function () {
                return this._rect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "uvRect", {
            get: function () {
                return this._uvRect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "drawMode", {
            get: function () {
                return this._drawMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "innerUvRect", {
            get: function () {
                return this._innerUvRect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "innerRect", {
            get: function () {
                return this._innerRect;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSprite.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        return RenderSprite;
    }());
    s2d.RenderSprite = RenderSprite;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var StringDictionary = (function () {
        function StringDictionary() {
            this._data = {};
            this._keysCount = 0;
        }
        Object.defineProperty(StringDictionary.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StringDictionary.prototype, "empty", {
            get: function () {
                return this._keysCount === 0;
            },
            enumerable: true,
            configurable: true
        });
        StringDictionary.prototype.add = function (key, value) {
            if (!this.has(key))
                this._keysCount++;
            this._data[key] = value;
        };
        StringDictionary.prototype.remove = function (key) {
            if (this.has(key)) {
                this._keysCount--;
                delete this._data[key];
            }
        };
        StringDictionary.prototype.has = function (key) {
            return this._data[key] !== undefined;
        };
        StringDictionary.prototype.get = function (key) {
            var v = this._data[key];
            if (v === undefined)
                v = null;
            return v;
        };
        return StringDictionary;
    }());
    s2d.StringDictionary = StringDictionary;
})(s2d || (s2d = {}));
/// <reference path="RenderSprite.ts" />
/// <reference path="../Util/StringDictionary.ts" />
var s2d;
(function (s2d) {
    var RenderSpriteAtlas = (function () {
        function RenderSpriteAtlas(texture, atlasJson) {
            this._texture = null;
            this._sprites = new s2d.StringDictionary();
            this._texture = texture;
            this.parseAtlasJson(atlasJson);
        }
        Object.defineProperty(RenderSpriteAtlas.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderSpriteAtlas.prototype, "sprites", {
            get: function () {
                return this._sprites;
            },
            enumerable: true,
            configurable: true
        });
        RenderSpriteAtlas.prototype.getSprite = function (id) {
            return this._sprites.get(id);
        };
        RenderSpriteAtlas.prototype.clear = function () {
            if (this._texture != null) {
                this._texture.clear();
                this._texture = null;
            }
        };
        RenderSpriteAtlas.prototype.parseAtlasJson = function (atlasJson) {
            var spritesJson = atlasJson.atlas.sprites.sprite;
            for (var i = 0; i < spritesJson.length; i++) {
                var spriteJson = spritesJson[i];
                var id = spriteJson.$id;
                var rect = RenderSpriteAtlas.parseRectString(spriteJson.$rect);
                var innerRect = RenderSpriteAtlas.parseRectString(spriteJson.$innerRect);
                if (id && rect) {
                    var sprite = null;
                    if (innerRect)
                        sprite = new s2d.RenderSprite(id, this._texture, rect, s2d.RenderSpriteDrawMode.Slice9, innerRect);
                    else
                        sprite = new s2d.RenderSprite(id, this._texture, rect);
                    this._sprites.add(sprite.id, sprite);
                }
            }
        };
        RenderSpriteAtlas.parseRectString = function (str) {
            var rect = null;
            if (str && str.length > 0) {
                var strs = str.split(",");
                if (strs.length === 4) {
                    rect = s2d.Rect.fromValues(parseInt(strs[0]), parseInt(strs[1]), parseInt(strs[2]), parseInt(strs[3]));
                }
            }
            return rect;
        };
        return RenderSpriteAtlas;
    }());
    s2d.RenderSpriteAtlas = RenderSpriteAtlas;
})(s2d || (s2d = {}));
/// <reference path="../Util/JXON.d.ts" />
var s2d;
(function (s2d) {
    var RenderFontCharData = (function () {
        function RenderFontCharData() {
            this.id = 0;
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.xadvance = 0;
            this.xoffset = 0;
            this.yoffset = 0;
        }
        return RenderFontCharData;
    }());
    s2d.RenderFontCharData = RenderFontCharData;
    var RenderFont = (function () {
        function RenderFont(texture, fontJson) {
            this._texture = null;
            this._textureWidth = 0;
            this._textureHeight = 0;
            this._lineHeight = 0;
            this._chars = new Array();
            this._texture = texture;
            this.parseFontJson(fontJson);
        }
        Object.defineProperty(RenderFont.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderFont.prototype, "textureWidth", {
            get: function () {
                return this._textureWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderFont.prototype, "textureHeight", {
            get: function () {
                return this._textureHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderFont.prototype, "lineHeight", {
            get: function () {
                return this._lineHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderFont.prototype, "chars", {
            get: function () {
                return this._chars;
            },
            enumerable: true,
            configurable: true
        });
        RenderFont.prototype.clear = function () {
            if (this._texture != null) {
                this._texture.clear();
                this._texture = null;
            }
        };
        RenderFont.prototype.parseFontJson = function (fontJson) {
            this._textureWidth = parseInt(fontJson.font.common.$scaleW);
            this._textureHeight = parseInt(fontJson.font.common.$scaleH);
            this._lineHeight = parseInt(fontJson.font.common.$lineHeight);
            var charsJson = fontJson.font.chars.char;
            for (var i = 0; i < charsJson.length; i++) {
                var charJson = charsJson[i];
                var char = new RenderFontCharData();
                char.id = parseInt(charJson.$id);
                char.width = parseInt(charJson.$width);
                char.height = parseInt(charJson.$height);
                char.x = parseInt(charJson.$x);
                char.y = parseInt(charJson.$y);
                char.xadvance = parseInt(charJson.$xadvance);
                char.xoffset = parseInt(charJson.$xoffset);
                char.yoffset = parseInt(charJson.$yoffset);
                this._chars[char.id] = char;
            }
        };
        return RenderFont;
    }());
    s2d.RenderFont = RenderFont;
})(s2d || (s2d = {}));
// C# like event dispatcher, based on ts-event library by Rogier Schouten<github@workingcode.ninja>
// original source code: https://github.com/rogierschouten/ts-events
var s2d;
(function (s2d) {
    var Listener = (function () {
        function Listener(handler, boundTo, fireOnlyOnce) {
            this.deleted = false;
            this.handler = null;
            this.boundTo = null;
            this.fireOnlyOnce = false;
            this.handler = handler;
            this.boundTo = boundTo;
            this.fireOnlyOnce = fireOnlyOnce;
        }
        Listener.prototype.equals = function (handler, boundTo) {
            return handler === this.handler && boundTo === this.boundTo;
        };
        return Listener;
    }());
    var Event = (function () {
        function Event() {
            /**
             * Recursive post() invocations
             */
            this._recursion = 0;
            /**
             * Attached listeners. NOTE: do not modify.
             * Instead, replace with a new array with possibly the same elements. This ensures
             * that any references to the array by events that are underway remain the same.
             */
            this._listeners = null;
        }
        Object.defineProperty(Event.prototype, "listenerCount", {
            /**
             * The number of attached listeners
             */
            get: function () {
                return (this._listeners !== null ? this._listeners.length : 0);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Attach an event handler that will be called every time that this event is triggered.
         * @param handler The function to call. The this argument of the function will be this object.
         * @param boundTo The "this" context of the function. Can be null.
         */
        Event.prototype.attach = function (handler, boundTo) {
            if (boundTo === void 0) { boundTo = null; }
            if (this._listeners === null) {
                this._listeners = new Array();
            }
            else {
                if (this._recursion > 0) {
                    // make a copy of the array so events that are underway have a stable local copy
                    // of the listeners array at the time of post()
                    this._listeners = this._listeners.slice();
                }
            }
            this._listeners.push(new Listener(handler, boundTo, false));
        };
        /**
         * Attach an event handler that will be called only once.
         * @param handler The function to call. The this argument of the function will be this object.
         * @param boundTo The "this" context of the function. Can be null.
         */
        Event.prototype.attachOnlyOnce = function (handler, boundTo) {
            if (boundTo === void 0) { boundTo = null; }
            if (this._listeners === null) {
                this._listeners = new Array();
            }
            else {
                if (this._recursion > 0) {
                    // make a copy of the array so events that are underway have a stable local copy
                    // of the listeners array at the time of post()
                    this._listeners = this._listeners.slice();
                }
            }
            this._listeners.push(new Listener(handler, boundTo, true));
        };
        /**
         * Detach all listeners with the given handler function
         */
        Event.prototype.detach = function (handler, boundTo) {
            if (boundTo === void 0) { boundTo = null; }
            if (this.listenerCount === 0)
                return;
            // remove listeners AND mark them as deleted so subclasses don't send any more events to them
            var listeners = this._listeners;
            if (this._recursion > 0) {
                // make a copy of the array so events that are underway have a stable local copy
                // of the listeners array at the time of post()
                this._listeners = listeners.filter(function (listener) {
                    if (listener.equals(handler, boundTo)) {
                        listener.deleted = true;
                        return false;
                    }
                    return true;
                });
            }
            else {
                //Not posting, no need to make a copy of the array
                for (var i = listeners.length - 1; i >= 0; i--) {
                    var listener = listeners[i];
                    if (listener.equals(handler, boundTo)) {
                        //listener.deleted = true; //no one is posting, no need to mark as deleted sine there is no other reference
                        listeners.splice(i, 1);
                    }
                }
            }
            if (this._listeners.length === 0)
                this._listeners = null;
        };
        /**
         * Send the event. Handlers are called immediately and synchronously.
         */
        Event.prototype.post = function (data) {
            if (this.listenerCount === 0)
                return;
            if (Event.MAX_RECURSION_DEPTH > 0 && this._recursion + 1 > Event.MAX_RECURSION_DEPTH) {
                s2d.EngineConsole.error("Max recursion depth reached");
                return;
            }
            this._recursion++;
            var listeners = this._listeners;
            var listenersToRemove = null;
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (!listener.deleted) {
                    if (listener.fireOnlyOnce) {
                        listener.deleted = true; //mark as deleted so it won be fired again by another nested call
                        if (listenersToRemove === null)
                            listenersToRemove = new Array();
                        listenersToRemove.push(listener);
                    }
                    listener.handler.call(listener.boundTo, data);
                }
            }
            this._recursion--;
            //Remove any listener that was set as "fireOnlyOnce"
            if (listenersToRemove != null) {
                //Update listeners reference, could have been be updated in any of the callbacks
                listeners = this._listeners;
                if (this._recursion > 0 || listenersToRemove.length > 1) {
                    //Make a copy of the array so events that are underway have a stable local copy
                    //of the listeners array at the time of post()
                    //We also use this method if we need to remove more than one listener, to prevent multiple calls to splice()
                    this._listeners = listeners.filter(function (listener) {
                        if (listenersToRemove.indexOf(listener) >= 0) {
                            listener.deleted = true;
                            return false;
                        }
                        return true;
                    });
                }
                else {
                    //Not posting, no need to make a copy of the array
                    for (var i = listeners.length - 1; i >= 0; i--) {
                        var listener = listeners[i];
                        if (listenersToRemove.indexOf(listener) >= 0) {
                            //listener.deleted = true; //no one is posting, no need to mark as deleted sine there is no other reference
                            listeners.splice(i, 1);
                        }
                    }
                }
            }
        };
        return Event;
    }());
    /**
     * Maximum number of times that an event handler may cause the same event
     * recursively.
     */
    Event.MAX_RECURSION_DEPTH = 10;
    s2d.Event = Event;
    /**
     * Convenience class for events without data
     */
    var VoidEvent = (function (_super) {
        __extends(VoidEvent, _super);
        function VoidEvent() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * Send the event.
         */
        VoidEvent.prototype.post = function () {
            _super.prototype.post.call(this, undefined);
        };
        return VoidEvent;
    }(Event));
    s2d.VoidEvent = VoidEvent;
    /**
     * Similar to 'error' event on EventEmitter: throws when a post() occurs while no handlers set.
     */
    var ErrorEvent = (function (_super) {
        __extends(ErrorEvent, _super);
        function ErrorEvent() {
            return _super.apply(this, arguments) || this;
        }
        ErrorEvent.prototype.post = function (data) {
            if (this.listenerCount === 0) {
                s2d.EngineConsole.error("error event posted while no listeners attached. Error: " + data.message);
                return;
            }
            _super.prototype.post.call(this, data);
        };
        return ErrorEvent;
    }(Event));
    s2d.ErrorEvent = ErrorEvent;
})(s2d || (s2d = {}));
/// <reference path="../../Render/RenderTexture.ts" />
/// <reference path="../../Render/RenderSprite.ts" />
/// <reference path="../../Render/RenderSpriteAtlas.ts" />
/// <reference path="../../Render/RenderFont.ts" />
/// <reference path="../../Event/Event.ts" />
var s2d;
(function (s2d) {
    var AssetsLoader = (function () {
        function AssetsLoader() {
            this._onLoadComplete = new s2d.VoidEvent();
            this._loaders = new s2d.StringDictionary();
            this._assets = new s2d.StringDictionary();
        }
        AssetsLoader.prototype.init = function () {
        };
        AssetsLoader.prototype.getAsset = function (id) {
            return this._assets.get(id);
        };
        AssetsLoader.prototype.attachOnLoadCompleteListener = function (handler, boundTo) {
            if (boundTo === void 0) { boundTo = null; }
            this._onLoadComplete.attachOnlyOnce(handler, boundTo);
        };
        AssetsLoader.prototype.loadRenderTextureFromUrl = function (id, url, hasAlpha, onLoadComplete, onLoadCompleteBoundTo) {
            if (onLoadComplete === void 0) { onLoadComplete = null; }
            if (onLoadCompleteBoundTo === void 0) { onLoadCompleteBoundTo = null; }
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;
            var loader = new s2d.RenderTextureLoader(id, url, hasAlpha);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        };
        AssetsLoader.prototype.loadRenderTextureFromBase64 = function (id, base64, hasAlpha, onLoadComplete, onLoadCompleteBoundTo) {
            if (onLoadComplete === void 0) { onLoadComplete = null; }
            if (onLoadCompleteBoundTo === void 0) { onLoadCompleteBoundTo = null; }
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;
            var url = "data:image/png;base64," + base64;
            var loader = new s2d.RenderTextureLoader(id, url, hasAlpha);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        };
        AssetsLoader.prototype.loadXmlFromUrl = function (id, url, onLoadComplete, onLoadCompleteBoundTo) {
            if (onLoadComplete === void 0) { onLoadComplete = null; }
            if (onLoadCompleteBoundTo === void 0) { onLoadCompleteBoundTo = null; }
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;
            var loader = new s2d.XmlLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        };
        AssetsLoader.prototype.loadRenderSpriteAtlasFromUrl = function (id, xmlUrl, onLoadComplete, onLoadCompleteBoundTo) {
            if (onLoadComplete === void 0) { onLoadComplete = null; }
            if (onLoadCompleteBoundTo === void 0) { onLoadCompleteBoundTo = null; }
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;
            var loader = new s2d.RenderSpriteAtlasLoader(id, xmlUrl);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        };
        AssetsLoader.prototype.loadRenderFontFromUrl = function (id, url, onLoadComplete, onLoadCompleteBoundTo) {
            if (onLoadComplete === void 0) { onLoadComplete = null; }
            if (onLoadCompleteBoundTo === void 0) { onLoadCompleteBoundTo = null; }
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;
            var loader = new s2d.RenderFontLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        };
        AssetsLoader.prototype.loadImageFromUrl = function (id, url, onLoadComplete, onLoadCompleteBoundTo) {
            if (onLoadComplete === void 0) { onLoadComplete = null; }
            if (onLoadCompleteBoundTo === void 0) { onLoadCompleteBoundTo = null; }
            if (!this.validateId(id, onLoadComplete, onLoadCompleteBoundTo))
                return;
            var loader = new s2d.ImageLoader(id, url);
            loader.onLoadComplete.attach(this.onLoaderComplete, this);
            if (onLoadComplete !== null)
                loader.onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
            this._loaders.add(id, loader);
            loader.start();
        };
        AssetsLoader.prototype.validateId = function (id, onLoadComplete, onLoadCompleteBoundTo) {
            if (this._loaders.has(id)) {
                s2d.EngineConsole.info("Asset with id " + id + " is already loading, attaching request to existing loader");
                if (onLoadComplete !== null)
                    this._loaders.get(id).onLoadComplete.attach(onLoadComplete, onLoadCompleteBoundTo);
                return false;
            }
            if (this._assets.has(id)) {
                s2d.EngineConsole.info("Asset with id " + id + " is already loaded, dispatching onLoadComplete() with existing asset");
                if (onLoadComplete !== null)
                    onLoadComplete.call(onLoadCompleteBoundTo, this._assets.get(id));
                return false;
            }
            return true;
        };
        AssetsLoader.prototype.onLoaderComplete = function (loader) {
            this._loaders.remove(loader.id);
            this._assets.add(loader.id, loader.asset);
        };
        AssetsLoader.prototype.update = function () {
            if (this._loaders.empty && this._onLoadComplete.listenerCount > 0) {
                this._onLoadComplete.post();
            }
        };
        return AssetsLoader;
    }());
    s2d.AssetsLoader = AssetsLoader;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var Time = (function () {
        function Time() {
        }
        Time.initStatic = function () {
            Time.deltaTime = 0;
        };
        return Time;
    }());
    s2d.Time = Time;
})(s2d || (s2d = {}));
/// <reference path="Input/InputManager.ts" />
/// <reference path="Render/RenderManager.ts" />
/// <reference path="Entity/EntityManager.ts" />
/// <reference path="Component/UI/UIManager.ts" />
/// <reference path="Assets/Loaders/AssetsLoader.ts" />
/// <reference path="Util/Time.ts" />
var s2d;
(function (s2d) {
    var Engine = (function () {
        function Engine() {
            this._onInitCompleteCallback = null;
            this._initialized = false;
            this.lastUpdateTime = 0;
        }
        Object.defineProperty(Engine.prototype, "renderer", {
            get: function () {
                return this._renderer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "input", {
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "entities", {
            get: function () {
                return this._entities;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "stats", {
            get: function () {
                return this._stats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Engine.prototype, "loader", {
            get: function () {
                return this._loader;
            },
            enumerable: true,
            configurable: true
        });
        Engine.prototype.init = function (onInitCompleteCallback) {
            if (onInitCompleteCallback === void 0) { onInitCompleteCallback = null; }
            this._onInitCompleteCallback = onInitCompleteCallback;
            s2d.Pools.initPools();
            s2d.Drawer.initStatic();
            s2d.TextDrawer.initStatic();
            s2d.Time.initStatic();
            s2d.Transform.initStatic();
            //Manager instantiation
            this._renderer = new s2d.RenderManager();
            this._input = new s2d.InputManager();
            this._entities = new s2d.EntityManager();
            this._stats = new s2d.Stats();
            this._loader = new s2d.AssetsLoader();
            //Global vars initialization
            s2d.input = this._input;
            s2d.renderer = this._renderer;
            s2d.entities = this._entities;
            s2d.loader = this._loader;
            //Manager initialization
            this._renderer.init();
            this._input.init();
            this._entities.init();
            this._stats.init();
            this._loader.init();
            //UI Manager needs to be initialized last because it depends on EntityManager
            this._ui = s2d.EntityFactory.buildWithComponent(s2d.UIManager, "UI Manager");
            s2d.ui = this._ui;
            //Embedded assets loading
            s2d.EmbeddedAssets.init();
            s2d.loader.attachOnLoadCompleteListener(this.onEmbeddedAssetsLoadComplete, this);
        };
        Engine.prototype.onEmbeddedAssetsLoadComplete = function () {
            this._initialized = true;
            if (this._onInitCompleteCallback !== null) {
                var tmp = this._onInitCompleteCallback;
                this._onInitCompleteCallback = null;
                tmp.call(undefined);
            }
        };
        Engine.prototype.update = function () {
            var now = Date.now() / 1000;
            if (this.lastUpdateTime === 0)
                s2d.Time.deltaTime = 1 / 60; //assume 60 fps in first frame, so Time.deltaTime is never 0!
            else
                s2d.Time.deltaTime = now - this.lastUpdateTime;
            this.lastUpdateTime = now;
            this._loader.update();
            if (!this._initialized) {
                //Initialization not finished, don't do anything else
                return;
            }
            if (this._renderer.contextLost) {
                //Context lost, don't do anything else
                return;
            }
            this._stats.startFrame();
            this._stats.startUpdate();
            //Update input
            this._input.update();
            //Call update() on all Behaviors
            this._entities.update();
            //Move UI to last drawing order
            this._ui.root.moveToBottom();
            //Render
            this._renderer.draw();
            this._stats.endUpdate();
            this._stats.endFrame();
        };
        return Engine;
    }());
    s2d.Engine = Engine;
    s2d.engine = new Engine();
})(s2d || (s2d = {}));
/// <reference path="Simple2DEngine/Engine.ts" />
window.onload = function () {
    s2d.engine.init(onInitComplete);
    requestAnimationFrame(update);
};
function onInitComplete() {
    //Creat main game logic entity
    s2d.EntityFactory.buildWithComponent(GameLogic, "GameLogic");
}
;
function update() {
    s2d.engine.update();
    requestAnimationFrame(update);
}
var s2d;
(function (s2d) {
    var LoaderState;
    (function (LoaderState) {
        LoaderState[LoaderState["WaitingStart"] = 0] = "WaitingStart";
        LoaderState[LoaderState["Loading"] = 1] = "Loading";
        LoaderState[LoaderState["Complete"] = 2] = "Complete";
    })(LoaderState = s2d.LoaderState || (s2d.LoaderState = {}));
    var Loader = (function () {
        function Loader(id) {
            this._id = null;
            this._onLoadComplete = new s2d.Event();
            this._state = LoaderState.WaitingStart;
            this._asset = null;
            this._id = id;
        }
        Object.defineProperty(Loader.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "asset", {
            get: function () {
                return this._asset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Loader.prototype, "onLoadComplete", {
            get: function () {
                return this._onLoadComplete;
            },
            enumerable: true,
            configurable: true
        });
        Loader.prototype.start = function () {
            if (this._state == LoaderState.WaitingStart) {
                this._state = LoaderState.Loading;
                this.onStart();
            }
        };
        Loader.prototype.onStart = function () {
            //Must be overriden in subclass to start downloading
        };
        //Must be called by subclass when the asset has finished downloading
        Loader.prototype.setAsset = function (asset) {
            this._asset = asset;
            this._onLoadComplete.post(this);
        };
        return Loader;
    }());
    s2d.Loader = Loader;
})(s2d || (s2d = {}));
/// <reference path="Loader.ts" />
var s2d;
(function (s2d) {
    var ImageLoader = (function (_super) {
        __extends(ImageLoader, _super);
        function ImageLoader(id, url) {
            var _this = _super.call(this, id) || this;
            _this._image = null;
            _this._url = url;
            return _this;
        }
        ImageLoader.prototype.onStart = function () {
            var _this = this;
            this._image = new Image();
            this._image.setAttribute('crossOrigin', 'anonymous');
            this._image.addEventListener('load', function () { return _this.onImageLoadComplete(); });
            this._image.src = this._url;
        };
        ImageLoader.prototype.onImageLoadComplete = function () {
            var tmp = this._image;
            this._image = null;
            this.setAsset(tmp);
        };
        return ImageLoader;
    }(s2d.Loader));
    s2d.ImageLoader = ImageLoader;
})(s2d || (s2d = {}));
/// <reference path="Loader.ts" />
/// <reference path="../../Render/RenderFont.ts" />
var s2d;
(function (s2d) {
    var RenderFontLoader = (function (_super) {
        __extends(RenderFontLoader, _super);
        function RenderFontLoader(id, fontXmlUrl) {
            var _this = _super.call(this, id) || this;
            _this._fontXmlUrl = null;
            _this._fontJson = null;
            _this._fontXmlUrl = fontXmlUrl;
            return _this;
        }
        RenderFontLoader.prototype.onStart = function () {
            s2d.loader.loadXmlFromUrl(this._fontXmlUrl, this._fontXmlUrl, this.onXmlLoadComplete, this);
        };
        RenderFontLoader.prototype.onXmlLoadComplete = function (xmlLoader) {
            var xml = xmlLoader.asset;
            this._fontJson = JXON.stringToJs(xml);
            var url = "assets/" + this._fontJson.font.pages.page.$file;
            s2d.loader.loadRenderTextureFromUrl(url, url, true, this.onTextureLoadComplete, this);
        };
        RenderFontLoader.prototype.onTextureLoadComplete = function (textureLoader) {
            var font = new s2d.RenderFont(textureLoader.asset, this._fontJson);
            this._fontJson = null;
            this.setAsset(font);
        };
        return RenderFontLoader;
    }(s2d.Loader));
    s2d.RenderFontLoader = RenderFontLoader;
})(s2d || (s2d = {}));
/// <reference path="Loader.ts" />
/// <reference path="../../Render/RenderSpriteAtlas.ts" />
var s2d;
(function (s2d) {
    var RenderSpriteAtlasLoader = (function (_super) {
        __extends(RenderSpriteAtlasLoader, _super);
        function RenderSpriteAtlasLoader(id, spriteAtlasXmlUrl) {
            var _this = _super.call(this, id) || this;
            _this._spriteAtlasXmlUrl = null;
            _this._spriteAtlasJson = null;
            _this._spriteAtlasXmlUrl = spriteAtlasXmlUrl;
            return _this;
        }
        RenderSpriteAtlasLoader.prototype.onStart = function () {
            s2d.loader.loadXmlFromUrl(this._spriteAtlasXmlUrl, this._spriteAtlasXmlUrl, this.onXmlLoadComplete, this);
        };
        RenderSpriteAtlasLoader.prototype.onXmlLoadComplete = function (xmlLoader) {
            var xml = xmlLoader.asset;
            this._spriteAtlasJson = JXON.stringToJs(xml);
            var url = "assets/" + this._spriteAtlasJson.atlas.info.$file;
            var hasAlpha = true;
            if (typeof this._spriteAtlasJson.atlas.info.$alpha === "string") {
                if (this._spriteAtlasJson.atlas.info.$alpha.trim().toLowerCase() === "true")
                    hasAlpha = true;
                else
                    hasAlpha = false;
            }
            s2d.loader.loadRenderTextureFromUrl(url, url, hasAlpha, this.onTextureLoadComplete, this);
        };
        RenderSpriteAtlasLoader.prototype.onTextureLoadComplete = function (textureLoader) {
            var atlas = new s2d.RenderSpriteAtlas(textureLoader.asset, this._spriteAtlasJson);
            this._spriteAtlasJson = null;
            this.setAsset(atlas);
        };
        return RenderSpriteAtlasLoader;
    }(s2d.Loader));
    s2d.RenderSpriteAtlasLoader = RenderSpriteAtlasLoader;
})(s2d || (s2d = {}));
/// <reference path="Loader.ts" />
/// <reference path="../../Render/RenderTexture.ts" />
var s2d;
(function (s2d) {
    var RenderTextureLoader = (function (_super) {
        __extends(RenderTextureLoader, _super);
        function RenderTextureLoader(id, url, hasAlpha) {
            var _this = _super.call(this, id) || this;
            _this._url = null;
            _this._hasAlpha = false;
            _this._url = url;
            _this._hasAlpha = hasAlpha;
            return _this;
        }
        RenderTextureLoader.prototype.onStart = function () {
            s2d.loader.loadImageFromUrl(this.id + "_texture", this._url, this.onImageLoadComplete, this);
        };
        RenderTextureLoader.prototype.onImageLoadComplete = function (imageLoader) {
            var texture = new s2d.RenderTexture(imageLoader.asset, this._hasAlpha);
            this.setAsset(texture);
        };
        return RenderTextureLoader;
    }(s2d.Loader));
    s2d.RenderTextureLoader = RenderTextureLoader;
})(s2d || (s2d = {}));
/// <reference path="Loader.ts" />
var s2d;
(function (s2d) {
    var XmlLoader = (function (_super) {
        __extends(XmlLoader, _super);
        function XmlLoader(id, url) {
            var _this = _super.call(this, id) || this;
            _this._xhttp = null;
            _this._url = url;
            return _this;
        }
        XmlLoader.prototype.onStart = function () {
            var _this = this;
            this._xhttp = new XMLHttpRequest();
            this._xhttp.addEventListener('load', function () { return _this.onXMLLoadComplete(); });
            this._xhttp.open("GET", this._url, true);
            this._xhttp.send(null);
        };
        XmlLoader.prototype.onXMLLoadComplete = function () {
            var tmp = this._xhttp;
            this._xhttp = null;
            this.setAsset(tmp.responseText);
        };
        return XmlLoader;
    }(s2d.Loader));
    s2d.XmlLoader = XmlLoader;
})(s2d || (s2d = {}));
/// <reference path="../Render/RenderSprite.ts" />
var s2d;
(function (s2d) {
    var Tile = (function () {
        function Tile(id, sprite) {
            this._id = null;
            this._sprite = null;
            this._id = id;
            this._sprite = sprite;
        }
        Object.defineProperty(Tile.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        return Tile;
    }());
    s2d.Tile = Tile;
})(s2d || (s2d = {}));
/// <reference path="Tile.ts" />
var s2d;
(function (s2d) {
    var Tilemap = (function () {
        function Tilemap(width, height, tiles) {
            this._tiles = new Array();
            this._data = new Array();
            this._width = 0;
            this._height = 0;
            this._dirty = true;
            this._width = width;
            this._height = height;
            this._tiles = tiles;
            var data = this.data;
            var defaultTile = tiles[0];
            for (var y = 0; y < height; y++) {
                var line = new Array();
                for (var x = 0; x < width; x++)
                    line.push(defaultTile);
                data.push(line);
            }
        }
        Object.defineProperty(Tilemap.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tilemap.prototype, "tiles", {
            get: function () {
                return this._tiles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tilemap.prototype, "width", {
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tilemap.prototype, "height", {
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tilemap.prototype, "dirty", {
            get: function () {
                return this._dirty;
            },
            set: function (value) {
                this._dirty = value;
            },
            enumerable: true,
            configurable: true
        });
        Tilemap.prototype.getTile = function (x, y) {
            return this._data[y][x];
        };
        Tilemap.prototype.setTile = function (x, y, tile) {
            if (this._data[y][x] !== tile) {
                this._data[y][x] = tile;
                this.dirty = true;
            }
        };
        return Tilemap;
    }());
    s2d.Tilemap = Tilemap;
})(s2d || (s2d = {}));
/// <reference path="Component.ts" />
var s2d;
(function (s2d) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            var _this = _super.apply(this, arguments) || this;
            _this.clearDepthBuffer = false;
            _this.clearColorBuffer = true;
            _this.clearColor = s2d.Color.fromRgba(0, 0, 0, 255);
            return _this;
        }
        return Camera;
    }(s2d.Component));
    s2d.Camera = Camera;
})(s2d || (s2d = {}));
/// <reference path="Drawer.ts" />
var s2d;
(function (s2d) {
    var SpriteDrawer = (function (_super) {
        __extends(SpriteDrawer, _super);
        function SpriteDrawer() {
            var _this = _super.apply(this, arguments) || this;
            _this._sprite = null;
            _this._color = s2d.Color.fromRgba(255, 255, 255, 255);
            return _this;
        }
        Object.defineProperty(SpriteDrawer.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            set: function (value) {
                this._sprite = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpriteDrawer.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color.copyFrom(value);
            },
            enumerable: true,
            configurable: true
        });
        SpriteDrawer.prototype.draw = function (commands) {
            var sprite = this._sprite;
            if (sprite !== null && sprite.texture !== null) {
                var trans = this.entity.transform;
                trans.getLocalToGlobalMatrix(s2d.Drawer.tmpMatrix);
                var color = this._color;
                switch (sprite.drawMode) {
                    case s2d.RenderSpriteDrawMode.Normal:
                        commands.drawRectSimple(s2d.Drawer.tmpMatrix, trans.size, sprite.texture, sprite.uvRect, this._color);
                        break;
                    case s2d.RenderSpriteDrawMode.Slice9:
                        commands.drawRect9Slice(s2d.Drawer.tmpMatrix, trans.size, sprite.texture, sprite.rect, sprite.uvRect, sprite.innerRect, sprite.innerUvRect, this._color);
                        break;
                }
            }
        };
        return SpriteDrawer;
    }(s2d.Drawer));
    s2d.SpriteDrawer = SpriteDrawer;
})(s2d || (s2d = {}));
/// <reference path="Drawer.ts" />
var s2d;
(function (s2d) {
    var TextureDrawer = (function (_super) {
        __extends(TextureDrawer, _super);
        function TextureDrawer() {
            var _this = _super.apply(this, arguments) || this;
            _this._texture = null;
            _this._color = s2d.Color.fromRgba(255, 255, 255, 255);
            _this._uvRect = s2d.Rect.fromValues(0, 0, 1, 1);
            return _this;
        }
        Object.defineProperty(TextureDrawer.prototype, "texture", {
            get: function () {
                return this._texture;
            },
            set: function (value) {
                this._texture = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureDrawer.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color.copyFrom(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureDrawer.prototype, "uvRect", {
            get: function () {
                return this._uvRect;
            },
            set: function (value) {
                s2d.Rect.copy(this._uvRect, value);
            },
            enumerable: true,
            configurable: true
        });
        TextureDrawer.prototype.draw = function (commands) {
            if (this._texture !== null) {
                var trans = this.entity.transform;
                trans.getLocalToGlobalMatrix(s2d.Drawer.tmpMatrix);
                commands.drawRectSimple(s2d.Drawer.tmpMatrix, trans.size, this._texture, this._uvRect, this._color);
            }
        };
        return TextureDrawer;
    }(s2d.Drawer));
    s2d.TextureDrawer = TextureDrawer;
})(s2d || (s2d = {}));
/// <reference path="Drawer.ts" />
/// <reference path="../Assets/Tilemap.ts" />
var s2d;
(function (s2d) {
    var TilemapDrawer = (function (_super) {
        __extends(TilemapDrawer, _super);
        function TilemapDrawer() {
            var _this = _super.apply(this, arguments) || this;
            _this._tilemap = null;
            _this._color = s2d.Color.fromRgba(255, 255, 255, 255);
            _this._tileSize = s2d.Vector2.fromValues(32, 32);
            _this._mesh = null;
            _this._dirty = true;
            _this._bestSize = s2d.Vector2.create();
            _this.lastDrawnMatrix = s2d.Matrix2d.create();
            return _this;
        }
        Object.defineProperty(TilemapDrawer.prototype, "tilemap", {
            get: function () {
                return this._tilemap;
            },
            set: function (value) {
                this._tilemap = value;
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilemapDrawer.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color.copyFrom(value);
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilemapDrawer.prototype, "tileSize", {
            get: function () {
                return this._tileSize;
            },
            set: function (value) {
                s2d.Vector2.copy(this._tileSize, value);
                this._dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        TilemapDrawer.prototype.getBestSize = function () {
            if (this.tilemap !== null) {
                this._bestSize[0] = this.tilemap.width * this.tileSize[0];
                this._bestSize[1] = this.tilemap.height * this.tileSize[1];
            }
            return this._bestSize;
        };
        TilemapDrawer.prototype.getTileAtGlobalPosition = function (globalPosition) {
            var tile = null;
            var tileCoords = this.getTileCoordsAtGlobalPosition(globalPosition, s2d.Pools.vector2.get());
            {
                if (tileCoords[0] !== -1 && tileCoords[1] !== -1)
                    tile = this.tilemap.getTile(tileCoords[0], tileCoords[1]);
            }
            s2d.Pools.vector2.return(tileCoords);
            return tile;
        };
        TilemapDrawer.prototype.getTileCoordsAtGlobalPosition = function (globalPosition, toReturn) {
            if (toReturn === void 0) { toReturn = null; }
            if (toReturn === null)
                toReturn = s2d.Pools.vector2.get();
            s2d.Vector2.set(toReturn, -1, -1);
            var tilemap = this.tilemap;
            var trans = this.entity.transform;
            var width = tilemap.width;
            var height = tilemap.height;
            var matrixInv = s2d.Pools.matrix2d.get();
            var localPosition = s2d.Pools.vector2.get();
            {
                var tileSizeX = trans.sizeX / tilemap.width;
                var tileSizeY = trans.sizeY / tilemap.height;
                trans.getGlobalToLocalMatrix(matrixInv);
                s2d.Vector2.transformMat2d(localPosition, globalPosition, matrixInv);
                var tileX = Math.floor(localPosition[0] / tileSizeX);
                var tileY = Math.floor(localPosition[1] / tileSizeY);
                if (tileX >= 0 && tileX < width && tileY >= 0 && tileY < height)
                    s2d.Vector2.set(toReturn, tileX, tileY);
            }
            s2d.Pools.matrix2d.return(matrixInv);
            s2d.Pools.vector2.return(localPosition);
            return toReturn;
        };
        TilemapDrawer.prototype.buildRenderMesh = function (matrix) {
            var tilemap = this.tilemap;
            var trans = this.entity.transform;
            var pivot = trans.pivot;
            var color = this._color;
            var width = tilemap.width;
            var height = tilemap.height;
            var data = tilemap.data;
            var size = trans.size;
            var tileSize = s2d.Pools.vector2.get();
            s2d.Vector2.copy(tileSize, this.tileSize);
            tileSize[0] = trans.sizeX / tilemap.width;
            tileSize[1] = trans.sizeY / tilemap.height;
            var right = s2d.Vector2.fromValues(tileSize[0], 0);
            var down = s2d.Vector2.fromValues(0, tileSize[1]);
            s2d.Vector2.transformMat2dNormal(right, right, matrix);
            s2d.Vector2.transformMat2dNormal(down, down, matrix);
            var startingPosition = s2d.Vector2.fromValues(matrix[4], matrix[5]);
            var mesh = this._mesh;
            if (mesh === null || mesh.maxTriangles !== width * height * 2) {
                mesh = new s2d.RenderMesh(width * height * 2);
                this._mesh = mesh;
            }
            else {
                mesh.reset();
            }
            for (var y = 0; y < height; y++) {
                matrix[4] = startingPosition[0] + down[0] * y;
                matrix[5] = startingPosition[1] + down[1] * y;
                var line = data[y];
                for (var x = 0; x < width; x++) {
                    var tile = line[x];
                    if (tile !== null) {
                        var sprite = tile.sprite;
                        mesh.drawRectSimple(matrix, tileSize, sprite.uvRect, this._color);
                    }
                    matrix[4] += right[0];
                    matrix[5] += right[1];
                }
            }
            tilemap.dirty = false;
            this._dirty = false;
            s2d.Pools.vector2.return(tileSize);
        };
        TilemapDrawer.prototype.draw = function (commands) {
            var tilemap = this._tilemap;
            if (tilemap !== null) {
                var matrix = s2d.Drawer.tmpMatrix;
                this.entity.transform.getLocalToGlobalMatrix(matrix);
                if (this.lastDrawnMatrix === null ||
                    !s2d.Matrix2d.equals(matrix, this.lastDrawnMatrix) ||
                    this._mesh === null ||
                    tilemap.dirty ||
                    this._dirty) {
                    s2d.Matrix2d.copy(this.lastDrawnMatrix, matrix);
                    this.buildRenderMesh(matrix);
                }
                //We assume that ALL sprites have the same texture..
                var texture = this.tilemap.tiles[0].sprite.texture;
                commands.drawMesh(this._mesh, texture);
            }
        };
        return TilemapDrawer;
    }(s2d.Drawer));
    s2d.TilemapDrawer = TilemapDrawer;
})(s2d || (s2d = {}));
/// <reference path="../Component.ts" />
/// <reference path="../../Event/Event.ts" />
var s2d;
(function (s2d) {
    var Interactable = (function (_super) {
        __extends(Interactable, _super);
        function Interactable() {
            var _this = _super.apply(this, arguments) || this;
            _this._enabled = true;
            return _this;
        }
        Object.defineProperty(Interactable.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._enabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Interactable.prototype.getBounds = function (out) {
            return this.entity.transform.getBounds(out);
        };
        Interactable.prototype.onPointerOver = function (pointer) {
        };
        Interactable.prototype.onPointerOut = function (pointer) {
        };
        Interactable.prototype.onPointerMove = function (pointer) {
        };
        Interactable.prototype.onPointerDown = function (pointer) {
        };
        Interactable.prototype.onPointerUp = function (pointer) {
        };
        return Interactable;
    }(s2d.Component));
    s2d.Interactable = Interactable;
})(s2d || (s2d = {}));
/// <reference path="Interactable.ts" />
var s2d;
(function (s2d) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            var _this = _super.apply(this, arguments) || this;
            _this._onClick = new s2d.Event();
            _this._buttonSprite = null;
            _this._buttonSpriteDown = null;
            _this._spriteDrawer = null;
            return _this;
        }
        Object.defineProperty(Button.prototype, "buttonSprite", {
            get: function () {
                return this._buttonSprite;
            },
            set: function (value) {
                this._buttonSprite = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "buttonSpriteDown", {
            get: function () {
                return this._buttonSpriteDown;
            },
            set: function (value) {
                this._buttonSpriteDown = value;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.onInit = function () {
            this._buttonSprite = s2d.EmbeddedAssets.defaultSkinAtlas.getSprite("button");
            this._buttonSpriteDown = s2d.EmbeddedAssets.defaultSkinAtlas.getSprite("button_down");
            if (!(this.entity.firstDrawer instanceof s2d.SpriteDrawer)) {
                s2d.EngineConsole.error("Missing SpriteDrawer", this);
            }
            else {
                this._spriteDrawer = this.entity.firstDrawer;
                this._spriteDrawer.sprite = this._buttonSprite;
            }
        };
        Object.defineProperty(Button.prototype, "onClick", {
            get: function () {
                return this._onClick;
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.onPointerDown = function (pointer) {
            if (this._spriteDrawer !== null && this._buttonSpriteDown !== null)
                this._spriteDrawer.sprite = this._buttonSpriteDown;
        };
        Button.prototype.onPointerUp = function (pointer) {
            if (this._spriteDrawer !== null)
                this._spriteDrawer.sprite = this._buttonSprite;
            this._onClick.post(this);
        };
        return Button;
    }(s2d.Interactable));
    s2d.Button = Button;
})(s2d || (s2d = {}));
/// <reference path="Interactable.ts" />
var s2d;
(function (s2d) {
    var FullscreenButton = (function (_super) {
        __extends(FullscreenButton, _super);
        function FullscreenButton() {
            return _super.apply(this, arguments) || this;
        }
        Object.defineProperty(FullscreenButton, "activeInstance", {
            get: function () {
                return FullscreenButton._activeInstance;
            },
            enumerable: true,
            configurable: true
        });
        FullscreenButton.prototype.onInit = function () {
            _super.prototype.onInit.call(this);
            FullscreenButton._activeInstance = this;
        };
        FullscreenButton.prototype.onDestroy = function () {
            if (FullscreenButton._activeInstance === this)
                FullscreenButton._activeInstance = null;
            _super.prototype.onDestroy.call(this);
        };
        return FullscreenButton;
    }(s2d.Button));
    FullscreenButton._activeInstance = null;
    s2d.FullscreenButton = FullscreenButton;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var LayoutSizeMode;
    (function (LayoutSizeMode) {
        LayoutSizeMode[LayoutSizeMode["None"] = 0] = "None";
        LayoutSizeMode[LayoutSizeMode["MatchDrawerBest"] = 1] = "MatchDrawerBest";
        LayoutSizeMode[LayoutSizeMode["MatchChildrenBest"] = 2] = "MatchChildrenBest";
        //MatchParent
    })(LayoutSizeMode = s2d.LayoutSizeMode || (s2d.LayoutSizeMode = {}));
    var LayoutAnchorMode;
    (function (LayoutAnchorMode) {
        LayoutAnchorMode[LayoutAnchorMode["None"] = 0] = "None";
        LayoutAnchorMode[LayoutAnchorMode["RelativeToParent"] = 1] = "RelativeToParent";
    })(LayoutAnchorMode = s2d.LayoutAnchorMode || (s2d.LayoutAnchorMode = {}));
    var LayoutRectOffset = (function () {
        function LayoutRectOffset() {
            this.top = 0;
            this.left = 0;
            this.bottom = 0;
            this.right = 0;
        }
        Object.defineProperty(LayoutRectOffset.prototype, "all", {
            set: function (offset) {
                this.left = this.right = this.top = this.bottom = offset;
            },
            enumerable: true,
            configurable: true
        });
        return LayoutRectOffset;
    }());
    s2d.LayoutRectOffset = LayoutRectOffset;
    var Layout = (function (_super) {
        __extends(Layout, _super);
        function Layout() {
            var _this = _super.apply(this, arguments) || this;
            _this._widthSizeMode = LayoutSizeMode.None;
            _this._heightSizeMode = LayoutSizeMode.None;
            _this._sizeOffset = s2d.Vector2.create();
            _this._xAnchorMode = LayoutAnchorMode.None;
            _this._yAnchorMode = LayoutAnchorMode.None;
            _this._anchorModePivot = s2d.Vector2.create();
            _this._anchorModeOffset = s2d.Vector2.create();
            return _this;
        }
        Object.defineProperty(Layout.prototype, "widthSizeMode", {
            get: function () {
                return this._widthSizeMode;
            },
            set: function (value) {
                this._widthSizeMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layout.prototype, "heightSizeMode", {
            get: function () {
                return this._heightSizeMode;
            },
            set: function (value) {
                this._heightSizeMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layout.prototype, "sizeMode", {
            set: function (value) {
                this._heightSizeMode = this._widthSizeMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Layout.prototype.setSizeMode = function (widthSizeMode, heightSizeMode) {
            this._widthSizeMode = widthSizeMode;
            this._heightSizeMode = heightSizeMode;
            return this;
        };
        Object.defineProperty(Layout.prototype, "sizeOffset", {
            get: function () {
                return this._sizeOffset;
            },
            set: function (value) {
                s2d.Vector2.copy(this._sizeOffset, value);
            },
            enumerable: true,
            configurable: true
        });
        Layout.prototype.setSizeOffset = function (x, y) {
            this._sizeOffset[0] = x;
            this._sizeOffset[1] = y;
            return this;
        };
        Object.defineProperty(Layout.prototype, "xAnchorMode", {
            get: function () {
                return this._xAnchorMode;
            },
            set: function (value) {
                this._xAnchorMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Layout.prototype, "yAnchorMode", {
            get: function () {
                return this._yAnchorMode;
            },
            set: function (value) {
                this._yAnchorMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Layout.prototype.setAnchorMode = function (xMode, yMode) {
            this.xAnchorMode = xMode;
            this.yAnchorMode = yMode;
            return this;
        };
        Object.defineProperty(Layout.prototype, "anchorModePivot", {
            get: function () {
                return this._anchorModePivot;
            },
            set: function (value) {
                this._anchorModePivot[0] = s2d.SMath.clamp(value[0], -1, 1);
                this._anchorModePivot[1] = s2d.SMath.clamp(value[1], -1, 1);
                ;
            },
            enumerable: true,
            configurable: true
        });
        Layout.prototype.setAnchorModePivot = function (x, y) {
            this._anchorModePivot[0] = s2d.SMath.clamp(x, -1, 1);
            this._anchorModePivot[1] = s2d.SMath.clamp(y, -1, 1);
            ;
            return this;
        };
        Object.defineProperty(Layout.prototype, "anchorModeOffset", {
            get: function () {
                return this._anchorModeOffset;
            },
            set: function (value) {
                s2d.Vector2.copy(this._anchorModeOffset, value);
            },
            enumerable: true,
            configurable: true
        });
        Layout.prototype.setAnchorModeOffset = function (x, y) {
            this._anchorModeOffset[0] = x;
            this._anchorModeOffset[1] = y;
            return this;
        };
        Layout.prototype.updateLayout = function () {
            var transform = this.entity.transform;
            if (this._widthSizeMode === LayoutSizeMode.MatchDrawerBest ||
                this._heightSizeMode === LayoutSizeMode.MatchDrawerBest) {
                var drawer = this.entity.firstDrawer;
                if (drawer !== null) {
                    //DON'T MUTATE THIS VECTOR!!
                    var bestSize = drawer.getBestSize();
                    if (this._widthSizeMode === LayoutSizeMode.MatchDrawerBest)
                        transform.sizeX = bestSize[0] + this._sizeOffset[0];
                    if (this._heightSizeMode === LayoutSizeMode.MatchDrawerBest)
                        transform.sizeY = bestSize[1] + this._sizeOffset[1];
                }
                else {
                    s2d.EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchThisDrawerBest' but drawer is missing", this);
                }
            }
            if (this._widthSizeMode === LayoutSizeMode.MatchChildrenBest ||
                this._heightSizeMode === LayoutSizeMode.MatchChildrenBest) {
                var firstChild = this.entity.transform.getFirstChild();
                if (firstChild !== null) {
                    var firstChildDrawer = firstChild.entity.firstDrawer;
                    if (firstChildDrawer !== null) {
                        //DON'T MUTATE THIS VECTOR!!
                        var bestSize = firstChildDrawer.getBestSize();
                        if (this._widthSizeMode === LayoutSizeMode.MatchChildrenBest)
                            transform.sizeX = bestSize[0] + this._sizeOffset[0];
                        if (this._heightSizeMode === LayoutSizeMode.MatchChildrenBest)
                            transform.sizeY = bestSize[1] + this._sizeOffset[1];
                    }
                    else {
                        s2d.EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchChildrenBest' but children with drawer is missing", this);
                    }
                }
                else {
                    s2d.EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchChildrenBest' but no children found", this);
                }
            }
            if (this._xAnchorMode === LayoutAnchorMode.RelativeToParent || this._yAnchorMode === LayoutAnchorMode.RelativeToParent) {
                var parent_1 = transform.parent;
                if (parent_1 !== null) {
                    var parentSize = parent_1.size;
                    if (this._xAnchorMode === LayoutAnchorMode.RelativeToParent)
                        transform.localX = parentSize[0] * 0.5 * (this._anchorModePivot[0] + 1) + this._anchorModeOffset[0];
                    if (this._yAnchorMode === LayoutAnchorMode.RelativeToParent)
                        transform.localY = parentSize[1] * 0.5 * (this._anchorModePivot[1] + 1) + this._anchorModeOffset[1];
                }
                else {
                    s2d.EngineConsole.error("Layout.updateLayout(): Anchor mode is 'RelativeToParent' but no parent found", this);
                }
            }
        };
        return Layout;
    }(s2d.Component));
    s2d.Layout = Layout;
})(s2d || (s2d = {}));
/// <reference path="../Drawer.ts" />
var s2d;
(function (s2d) {
    var TextDrawer = (function (_super) {
        __extends(TextDrawer, _super);
        function TextDrawer() {
            var _this = _super.apply(this, arguments) || this;
            _this._font = s2d.EmbeddedAssets.defaultFont;
            _this._color = s2d.Color.fromRgba(255, 255, 255, 255);
            _this._text = "Text";
            _this._fontScale = 1;
            _this._textVertexGenerator = new s2d.TextVertextGenerator();
            return _this;
        }
        Object.defineProperty(TextDrawer.prototype, "font", {
            get: function () {
                return this._font;
            },
            set: function (value) {
                this._font = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextDrawer.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color.copyFrom(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextDrawer.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextDrawer.prototype, "fontScale", {
            get: function () {
                return this._fontScale;
            },
            set: function (value) {
                this._fontScale = value;
            },
            enumerable: true,
            configurable: true
        });
        TextDrawer.initStatic = function () {
            TextDrawer.tmpRight = s2d.Vector2.create();
            TextDrawer.tmpDown = s2d.Vector2.create();
            TextDrawer.tmpV1 = new s2d.RenderVertex();
            TextDrawer.tmpV2 = new s2d.RenderVertex();
            TextDrawer.tmpV3 = new s2d.RenderVertex();
            TextDrawer.tmpV4 = new s2d.RenderVertex();
            TextDrawer.tmpTopLeft = s2d.Vector2.create();
        };
        TextDrawer.prototype.getBestSize = function () {
            this.updateTextVertexGenerator();
            return this._textVertexGenerator.size;
        };
        TextDrawer.prototype.updateTextVertexGenerator = function () {
            this._textVertexGenerator.update(this._font, this._fontScale, this._text);
        };
        TextDrawer.prototype.draw = function (commands) {
            var texture = this.font.texture;
            if (texture == null)
                return; //Texture not loaded yet
            this.updateTextVertexGenerator();
            var trans = this.entity.transform;
            var tmpMatrix = s2d.Drawer.tmpMatrix;
            var tmpVector = s2d.Drawer.tmpVector;
            var colorNumber = this._color.abgrHex;
            trans.getLocalToGlobalMatrix(tmpMatrix);
            var vertexChars = this._textVertexGenerator.vertexChars;
            var tmpV1 = TextDrawer.tmpV1;
            var tmpV2 = TextDrawer.tmpV2;
            var tmpV3 = TextDrawer.tmpV3;
            var tmpV4 = TextDrawer.tmpV4;
            for (var i = 0; i < vertexChars.length; i++) {
                var vertexChar = vertexChars[i];
                tmpV1.copyFrom(vertexChar.v1);
                tmpV2.copyFrom(vertexChar.v2);
                tmpV3.copyFrom(vertexChar.v3);
                tmpV4.copyFrom(vertexChar.v4);
                tmpV1.color = tmpV2.color = tmpV3.color = tmpV4.color = colorNumber;
                tmpV1.transformMat2d(tmpMatrix);
                tmpV2.transformMat2d(tmpMatrix);
                tmpV3.transformMat2d(tmpMatrix);
                tmpV4.transformMat2d(tmpMatrix);
                //draw char
                commands.drawRect(tmpV1, tmpV2, tmpV3, tmpV4, texture);
            }
        };
        return TextDrawer;
    }(s2d.Drawer));
    s2d.TextDrawer = TextDrawer;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var TextVertextGeneratorChar = (function () {
        function TextVertextGeneratorChar() {
            this.v1 = new s2d.RenderVertex();
            this.v2 = new s2d.RenderVertex();
            this.v3 = new s2d.RenderVertex();
            this.v4 = new s2d.RenderVertex();
        }
        return TextVertextGeneratorChar;
    }());
    s2d.TextVertextGeneratorChar = TextVertextGeneratorChar;
    var TextVertextGenerator = (function () {
        function TextVertextGenerator() {
            this._font = null;
            this._text = null;
            this._scale = -1;
            this._vertexChars = new Array();
            this._current = s2d.Vector2.create();
            this._size = s2d.Vector2.create();
        }
        Object.defineProperty(TextVertextGenerator.prototype, "vertexChars", {
            get: function () {
                return this._vertexChars;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextVertextGenerator.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        TextVertextGenerator.prototype.update = function (font, scale, text) {
            if (font.texture === null) {
                //Don't do anything if the font isn't initialised yet
                return;
            }
            if (this._font !== font || this._scale !== scale || this._text !== text) {
                this._font = font;
                this._scale = scale;
                this._text = text;
                this.updateChars();
            }
        };
        TextVertextGenerator.prototype.updateChars = function () {
            var font = this._font;
            var text = this._text;
            var textLen = text.length;
            var scale = this._scale;
            var texture = font.texture;
            var textureWidth = font.textureWidth;
            var textureHeight = font.textureHeight;
            var lineHeight = font.lineHeight * scale;
            var current = this._current;
            var startX = 0;
            var startY = 0;
            var lines = 0;
            var maxX = 0;
            var maxY = lineHeight;
            current[0] = 0;
            current[1] = 0;
            var vertexChars = this._vertexChars;
            var vertexCharsIndex = 0;
            for (var i = 0; i < textLen; i++) {
                var charCode = text.charCodeAt(i);
                if (charCode === 10) {
                    lines++;
                    current[0] = 0;
                    current[1] += lineHeight;
                    maxY += lineHeight;
                }
                else {
                    var charData = font.chars[charCode];
                    if (charData) {
                        var vertexChar = null;
                        if (vertexCharsIndex === vertexChars.length) {
                            vertexChar = new TextVertextGeneratorChar();
                            vertexChars.push(vertexChar);
                        }
                        else {
                            vertexChar = vertexChars[vertexCharsIndex];
                        }
                        vertexCharsIndex++;
                        vertexChar.charCode = charCode;
                        var charWidth = charData.width;
                        var charHeight = charData.height;
                        var dx = charData.xoffset * scale;
                        var dy = charData.yoffset * scale;
                        var ox = current[0];
                        var oy = current[1];
                        var tmpV1 = vertexChar.v1;
                        var tmpV2 = vertexChar.v2;
                        var tmpV3 = vertexChar.v3;
                        var tmpV4 = vertexChar.v4;
                        //offset char dx / dy
                        current[0] += dx;
                        current[1] += dy;
                        tmpV1.x = current[0];
                        tmpV1.y = current[1];
                        tmpV1.u = charData.x / textureWidth;
                        tmpV1.v = charData.y / textureHeight;
                        tmpV2.x = current[0] + charWidth * scale;
                        tmpV2.y = current[1];
                        tmpV2.u = (charData.x + charWidth) / textureWidth;
                        tmpV2.v = charData.y / textureHeight;
                        tmpV3.x = current[0] + charWidth * scale;
                        tmpV3.y = current[1] + charHeight * scale;
                        tmpV3.u = (charData.x + charWidth) / textureWidth;
                        tmpV3.v = (charData.y + charHeight) / textureHeight;
                        tmpV4.x = current[0];
                        tmpV4.y = current[1] + charHeight * scale;
                        tmpV4.u = charData.x / textureWidth;
                        tmpV4.v = (charData.y + charHeight) / textureHeight;
                        //offset char xadvance
                        current[0] = ox + charData.xadvance * scale;
                        current[1] = oy;
                        if (current[0] > maxX)
                            maxX = current[0];
                    }
                }
            }
            if (vertexCharsIndex < vertexChars.length)
                vertexChars.splice(vertexCharsIndex);
            this._size[0] = maxX;
            this._size[1] = maxY;
        };
        return TextVertextGenerator;
    }());
    s2d.TextVertextGenerator = TextVertextGenerator;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var EntityFactory = (function () {
        function EntityFactory() {
        }
        EntityFactory.buildCamera = function () {
            return new s2d.Entity("Camera").addComponent(s2d.Camera);
        };
        EntityFactory.buildTextureDrawer = function (texture) {
            var entity = new s2d.Entity("Texture");
            var textureDrawer = entity.addComponent(s2d.TextureDrawer);
            textureDrawer.texture = texture;
            entity.transform.setSize(32, 32);
            return textureDrawer;
        };
        EntityFactory.buildTextDrawer = function () {
            var entity = new s2d.Entity("Text");
            var textDrawer = entity.addComponent(s2d.TextDrawer);
            textDrawer.fontScale = 3;
            entity.addComponent(s2d.Layout).sizeMode = s2d.LayoutSizeMode.MatchDrawerBest;
            return textDrawer;
        };
        EntityFactory.buildButton = function () {
            var entity = new s2d.Entity("Button");
            entity.addComponent(s2d.SpriteDrawer);
            var button = entity.addComponent(s2d.Button);
            entity.transform.setPivot(-1, -1).setLocalScale(3, 3);
            return button;
        };
        EntityFactory.buildTextButton = function (text) {
            var entity = new s2d.Entity("Button");
            entity.addComponent(s2d.SpriteDrawer);
            var button = entity.addComponent(s2d.Button);
            entity.transform.setPivot(-1, -1).setLocalScale(3, 3);
            //Layout used to make the button match the size of the text inside
            var layout = entity.addComponent(s2d.Layout)
                .setSizeMode(s2d.LayoutSizeMode.MatchChildrenBest, s2d.LayoutSizeMode.MatchChildrenBest)
                .setSizeOffset(8, 4); //4px on X, 2px on Y
            //Text drawer
            var textDrawer = EntityFactory.buildTextDrawer();
            textDrawer.entity.getOrAddComponent(s2d.Layout)
                .setAnchorMode(s2d.LayoutAnchorMode.RelativeToParent, s2d.LayoutAnchorMode.RelativeToParent);
            textDrawer.color.setFromRgba(0, 0, 0);
            textDrawer.fontScale = 1;
            textDrawer.text = text;
            textDrawer.entity.transform.parent = entity.transform;
            return button;
        };
        EntityFactory.buildFullscreenTextButton = function (text) {
            var entity = new s2d.Entity("Button");
            entity.addComponent(s2d.SpriteDrawer);
            var button = entity.addComponent(s2d.FullscreenButton);
            entity.transform.setPivot(-1, -1).setLocalScale(3, 3);
            //Layout used to make the button match the size of the text inside
            entity.addComponent(s2d.Layout)
                .setSizeMode(s2d.LayoutSizeMode.MatchChildrenBest, s2d.LayoutSizeMode.MatchChildrenBest)
                .setSizeOffset(8, 4); //4px on X, 2px on Y
            //Text drawer
            var textDrawer = EntityFactory.buildTextDrawer();
            textDrawer.entity.getOrAddComponent(s2d.Layout)
                .setAnchorMode(s2d.LayoutAnchorMode.RelativeToParent, s2d.LayoutAnchorMode.RelativeToParent);
            textDrawer.color.setFromRgba(0, 0, 0);
            textDrawer.fontScale = 1;
            textDrawer.text = text;
            textDrawer.entity.transform.parent = entity.transform;
            return button;
        };
        EntityFactory.buildTilemapDrawer = function (tilemap) {
            var entity = new s2d.Entity("Tilemap");
            var tilemapDrawer = entity.addComponent(s2d.TilemapDrawer);
            tilemapDrawer.tilemap = tilemap;
            entity.transform.setPivot(-1, -1);
            entity.addComponent(s2d.Layout).setSizeMode(s2d.LayoutSizeMode.MatchDrawerBest, s2d.LayoutSizeMode.MatchDrawerBest);
            return tilemapDrawer;
        };
        EntityFactory.buildWithComponent = function (clazz, name) {
            if (name === void 0) { name = "Entity"; }
            return new s2d.Entity(name).addComponent(clazz);
        };
        return EntityFactory;
    }());
    s2d.EntityFactory = EntityFactory;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var InputPointer = (function () {
        function InputPointer() {
            this.down = false;
            this.downFrames = 0;
            this.position = s2d.Vector2.create();
            this.delta = s2d.Vector2.create();
        }
        return InputPointer;
    }());
    s2d.InputPointer = InputPointer;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var Color = (function () {
        function Color() {
        }
        Object.defineProperty(Color.prototype, "r", {
            get: function () {
                return (this.abgrHex >> 0) & 0xFF;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
            get: function () {
                return (this.abgrHex >> 8) & 0xFF;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
            get: function () {
                return (this.abgrHex >> 16) & 0xFF;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "a", {
            get: function () {
                return (this.abgrHex >> 24) & 0xFF;
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.copyFrom = function (c) {
            this.abgrHex = c.abgrHex;
        };
        Color.prototype.setFromRgba = function (r, g, b, a) {
            if (a === void 0) { a = 255; }
            r = s2d.SMath.clamp(r, 0, 255);
            g = s2d.SMath.clamp(g, 0, 255);
            b = s2d.SMath.clamp(b, 0, 255);
            a = s2d.SMath.clamp(a, 0, 255);
            this.abgrHex = (r << 0) | (g << 8) | (b << 16) | (a << 24);
        };
        Color.fromRgba = function (r, g, b, a) {
            if (a === void 0) { a = 255; }
            var c = new Color();
            c.setFromRgba(r, g, b, a);
            return c;
        };
        Color.fromHex = function (abgrHex) {
            var c = new Color();
            c.abgrHex = abgrHex;
            return c;
        };
        return Color;
    }());
    s2d.Color = Color;
})(s2d || (s2d = {}));
//Port of glMatrix, taken from: https://github.com/toji/gl-matrix
var s2d;
(function (s2d) {
    /* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE. */
    /**
     * @class 2x2 Matrix
     * @name Matrix2
     */
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
        function Matrix2() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * Creates a new identity Matrix2
         *
         * @returns {Matrix2} a new 2x2 matrix
         */
        Matrix2.create = function () {
            var a = new Float32Array(4);
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 1;
            return a;
        };
        /**
         * Creates a new Matrix2 initialized with values from an existing matrix
         *
         * @param {Matrix2} a matrix to clone
         * @returns {Matrix2} a new 2x2 matrix
         */
        Matrix2.clone = function (a) {
            var out = Matrix2.create();
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        };
        /**
         * Copy the values from one Matrix2 to another
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        Matrix2.copy = function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        };
        /**
         * Set a Matrix2 to the identity matrix
         *
         * @param {Matrix2} out the receiving matrix
         * @returns {Matrix2} out
         */
        Matrix2.identity = function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
        };
        /**
         * Create a new Matrix2 with the given values
         *
         * @param {Number} m00 Component in column 0, row 0 position (index 0)
         * @param {Number} m01 Component in column 0, row 1 position (index 1)
         * @param {Number} m10 Component in column 1, row 0 position (index 2)
         * @param {Number} m11 Component in column 1, row 1 position (index 3)
         * @returns {Matrix2} out A new 2x2 matrix
         */
        Matrix2.fromValues = function (m00, m01, m10, m11) {
            var out = Matrix2.create();
            out[0] = m00;
            out[1] = m01;
            out[2] = m10;
            out[3] = m11;
            return out;
        };
        /**
         * Set the components of a Matrix2 to the given values
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Number} m00 Component in column 0, row 0 position (index 0)
         * @param {Number} m01 Component in column 0, row 1 position (index 1)
         * @param {Number} m10 Component in column 1, row 0 position (index 2)
         * @param {Number} m11 Component in column 1, row 1 position (index 3)
         * @returns {Matrix2} out
         */
        Matrix2.set = function (out, m00, m01, m10, m11) {
            out[0] = m00;
            out[1] = m01;
            out[2] = m10;
            out[3] = m11;
            return out;
        };
        /**
         * Inverts a Matrix2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        Matrix2.invert = function (out, a) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], 
            // Calculate the determinant
            det = a0 * a3 - a2 * a1;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = a3 * det;
            out[1] = -a1 * det;
            out[2] = -a2 * det;
            out[3] = a0 * det;
            return out;
        };
        /**
         * Calculates the adjugate of a Matrix2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the source matrix
         * @returns {Matrix2} out
         */
        Matrix2.adjoint = function (out, a) {
            // Caching this value is nessecary if out == a
            var a0 = a[0];
            out[0] = a[3];
            out[1] = -a[1];
            out[2] = -a[2];
            out[3] = a0;
            return out;
        };
        /**
         * Calculates the determinant of a Matrix2
         *
         * @param {Matrix2} a the source matrix
         * @returns {Number} determinant of a
         */
        Matrix2.determinant = function (a) {
            return a[0] * a[3] - a[2] * a[1];
        };
        /**
         * Multiplies two Matrix2's
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @returns {Matrix2} out
         */
        Matrix2.mul = function (out, a, b) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
            var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            return out;
        };
        /**
         * Rotates a Matrix2 by the given angle
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix2} out
         */
        Matrix2.rotate = function (out, a, rad) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            return out;
        };
        /**
         * Scales the Matrix2 by the dimensions in the given vec2
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the matrix to rotate
         * @param {vec2} v the vec2 to scale the matrix by
         * @returns {Matrix2} out
         **/
        Matrix2.scale = function (out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            return out;
        };
        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     Matrix2.identity(dest);
         *     Matrix2.scale(dest, dest, vec);
         *
         * @param {Matrix2} out Matrix2 receiving operation result
         * @param {vec2} v Scaling vector
         * @returns {Matrix2} out
         */
        Matrix2.fromScaling = function (out, v) {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = v[1];
            return out;
        };
        /**
         * Returns a string representation of a Matrix2
         *
         * @param {Matrix2} a matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        Matrix2.toString = function (a) {
            return 'Matrix2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
        };
        /**
         * Returns Frobenius norm of a Matrix2
         *
         * @param {Matrix2} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        Matrix2.frob = function (a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)));
        };
        /**
         * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
         * @param {Matrix2} L the lower triangular matrix
         * @param {Matrix2} D the diagonal matrix
         * @param {Matrix2} U the upper triangular matrix
         * @param {Matrix2} a the input matrix to factorize
         */
        Matrix2.LDU = function (L, D, U, a) {
            L[2] = a[2] / a[0];
            U[0] = a[0];
            U[1] = a[1];
            U[3] = a[3] - L[2] * U[1];
            return [L, D, U];
        };
        /**
         * Adds two Matrix2's
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @returns {Matrix2} out
         */
        Matrix2.add = function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            return out;
        };
        /**
         * Subtracts matrix b from matrix a
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @returns {Matrix2} out
         */
        Matrix2.sub = function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            return out;
        };
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         *
         * @param {Matrix2} a The first matrix.
         * @param {Matrix2} b The second matrix.
         * @returns {Boolean} True if the matrices are equal, false otherwise.
         */
        Matrix2.equals = function (a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
        };
        /**
         * Multiply each element of the matrix by a scalar.
         *
         * @param {Matrix2} out the receiving matrix
         * @param {Matrix2} a the matrix to scale
         * @param {Number} b amount to scale the matrix's elements by
         * @returns {Matrix2} out
         */
        Matrix2.multiplyScalar = function (out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            return out;
        };
        /**
         * Adds two Matrix2's after multiplying each element of the second operand by a scalar value.
         *
         * @param {Matrix2} out the receiving vector
         * @param {Matrix2} a the first operand
         * @param {Matrix2} b the second operand
         * @param {Number} scale the amount to scale b's elements by before adding
         * @returns {Matrix2} out
         */
        Matrix2.multiplyScalarAndAdd = function (out, a, b, scale) {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            out[2] = a[2] + (b[2] * scale);
            out[3] = a[3] + (b[3] * scale);
            return out;
        };
        return Matrix2;
    }(Float32Array));
    /**
     * Transpose the values of a Matrix2
     *
     * @param {Matrix2} out the receiving matrix
     * @param {Matrix2} a the source matrix
     * @returns {Matrix2} out
     */
    Matrix2.transpose = function (out, a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            var a1 = a[1];
            out[1] = a[2];
            out[2] = a1;
        }
        else {
            out[0] = a[0];
            out[1] = a[2];
            out[2] = a[1];
            out[3] = a[3];
        }
        return out;
    };
    /**
     * Creates a matrix from a given angle
     * This is equivalent to (but much faster than):
     *
     *     Matrix2.identity(dest);
     *     Matrix2.rotate(dest, dest, rad);
     *
     * @param {Matrix2} out Matrix2 receiving operation result
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Matrix2} out
     */
    Matrix2.fromRotation = function (out, rad) {
        var s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        return out;
    };
    s2d.Matrix2 = Matrix2;
})(s2d || (s2d = {}));
//Port of glMatrix, taken from: https://github.com/toji/gl-matrix
var s2d;
(function (s2d) {
    /* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE. */
    /**
     * @class 2x3 Matrix
     * @name Matrix2d
     *
     * @description
     * A Matrix2d contains six elements defined as:
     * <pre>
     * [a, c, tx,
     *  b, d, ty]
     * </pre>
     * This is a short form for the 3x3 matrix:
     * <pre>
     * [a, c, tx,
     *  b, d, ty,
     *  0, 0, 1]
     * </pre>
     * The last row is ignored so the array is shorter and operations are faster.
     * Array order is:
     * <pre>
     * [0, 2, 4,
     *  1, 3, 5]
     * </pre>
     */
    var Matrix2d = (function (_super) {
        __extends(Matrix2d, _super);
        function Matrix2d() {
            return _super.apply(this, arguments) || this;
        }
        /**
         * Creates a new identity Matrix2d
         *
         * @returns {Matrix2d} a new 2x3 matrix
         */
        Matrix2d.create = function () {
            var a = new Float32Array(6);
            a[0] = 1;
            a[1] = 0;
            a[2] = 0;
            a[3] = 1;
            a[4] = 0;
            a[5] = 0;
            return a;
        };
        /**
         * Creates a new Matrix2d initialized with values from an existing matrix
         *
         * @param {Matrix2d} a matrix to clone
         * @returns {Matrix2d} a new 2x3 matrix
         */
        Matrix2d.clone = function (a) {
            var out = Matrix2d.create();
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        };
        /**
         * Copy the values from one Matrix2d to another
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the source matrix
         * @returns {Matrix2d} out
         */
        Matrix2d.copy = function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[4] = a[4];
            out[5] = a[5];
            return out;
        };
        /**
         * Set a Matrix2d to the identity matrix
         *
         * @param {Matrix2d} out the receiving matrix
         * @returns {Matrix2d} out
         */
        Matrix2d.identity = function (out) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = 0;
            out[5] = 0;
            return out;
        };
        /**
         * Create a new Matrix2d with the given values
         *
         * @param {Number} a Component A (index 0)
         * @param {Number} b Component B (index 1)
         * @param {Number} c Component C (index 2)
         * @param {Number} d Component D (index 3)
         * @param {Number} tx Component TX (index 4)
         * @param {Number} ty Component TY (index 5)
         * @returns {Matrix2d} A new Matrix2d
         */
        Matrix2d.fromValues = function (a, b, c, d, tx, ty) {
            var out = Matrix2d.create();
            out[0] = a;
            out[1] = b;
            out[2] = c;
            out[3] = d;
            out[4] = tx;
            out[5] = ty;
            return out;
        };
        /**
         * Set the components of a Matrix2d to the given values
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Number} a Component A (index 0)
         * @param {Number} b Component B (index 1)
         * @param {Number} c Component C (index 2)
         * @param {Number} d Component D (index 3)
         * @param {Number} tx Component TX (index 4)
         * @param {Number} ty Component TY (index 5)
         * @returns {Matrix2d} out
         */
        Matrix2d.set = function (out, a, b, c, d, tx, ty) {
            out[0] = a;
            out[1] = b;
            out[2] = c;
            out[3] = d;
            out[4] = tx;
            out[5] = ty;
            return out;
        };
        /**
         * Inverts a Matrix2d
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the source matrix
         * @returns {Matrix2d} out
         */
        Matrix2d.invert = function (out, a) {
            var aa = a[0], ab = a[1], ac = a[2], ad = a[3], atx = a[4], aty = a[5];
            var det = aa * ad - ab * ac;
            if (!det) {
                return null;
            }
            det = 1.0 / det;
            out[0] = ad * det;
            out[1] = -ab * det;
            out[2] = -ac * det;
            out[3] = aa * det;
            out[4] = (ac * aty - ad * atx) * det;
            out[5] = (ab * atx - aa * aty) * det;
            return out;
        };
        /**
         * Calculates the determinant of a Matrix2d
         *
         * @param {Matrix2d} a the source matrix
         * @returns {Number} determinant of a
         */
        Matrix2d.determinant = function (a) {
            return a[0] * a[3] - a[1] * a[2];
        };
        /**
         * Multiplies two Matrix2d's
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the first operand
         * @param {Matrix2d} b the second operand
         * @returns {Matrix2d} out
         */
        Matrix2d.mul = function (out, a, b) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
            out[0] = a0 * b0 + a2 * b1;
            out[1] = a1 * b0 + a3 * b1;
            out[2] = a0 * b2 + a2 * b3;
            out[3] = a1 * b2 + a3 * b3;
            out[4] = a0 * b4 + a2 * b5 + a4;
            out[5] = a1 * b4 + a3 * b5 + a5;
            return out;
        };
        /**
         * Rotates a Matrix2d by the given angle
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the matrix to rotate
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix2d} out
         */
        Matrix2d.rotate = function (out, a, rad) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], s = Math.sin(rad), c = Math.cos(rad);
            out[0] = a0 * c + a2 * s;
            out[1] = a1 * c + a3 * s;
            out[2] = a0 * -s + a2 * c;
            out[3] = a1 * -s + a3 * c;
            out[4] = a4;
            out[5] = a5;
            return out;
        };
        /**
         * Scales the Matrix2d by the dimensions in the given Vector2
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the matrix to translate
         * @param {Vector2} v the Vector2 to scale the matrix by
         * @returns {Matrix2d} out
         **/
        Matrix2d.scale = function (out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
            out[0] = a0 * v0;
            out[1] = a1 * v0;
            out[2] = a2 * v1;
            out[3] = a3 * v1;
            out[4] = a4;
            out[5] = a5;
            return out;
        };
        /**
         * Translates the Matrix2d by the dimensions in the given Vector2
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the matrix to translate
         * @param {Vector2} v the Vector2 to translate the matrix by
         * @returns {Matrix2d} out
         **/
        Matrix2d.translate = function (out, a, v) {
            var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], v0 = v[0], v1 = v[1];
            out[0] = a0;
            out[1] = a1;
            out[2] = a2;
            out[3] = a3;
            out[4] = a0 * v0 + a2 * v1 + a4;
            out[5] = a1 * v0 + a3 * v1 + a5;
            return out;
        };
        /**
         * Creates a matrix from a given angle
         * This is equivalent to (but much faster than):
         *
         *     Matrix2d.identity(dest);
         *     Matrix2d.rotate(dest, dest, rad);
         *
         * @param {Matrix2d} out Matrix2d receiving operation result
         * @param {Number} rad the angle to rotate the matrix by
         * @returns {Matrix2d} out
         */
        Matrix2d.fromRotation = function (out, rad) {
            var s = Math.sin(rad), c = Math.cos(rad);
            out[0] = c;
            out[1] = s;
            out[2] = -s;
            out[3] = c;
            out[4] = 0;
            out[5] = 0;
            return out;
        };
        /**
         * Creates a matrix from a vector scaling
         * This is equivalent to (but much faster than):
         *
         *     Matrix2d.identity(dest);
         *     Matrix2d.scale(dest, dest, vec);
         *
         * @param {Matrix2d} out Matrix2d receiving operation result
         * @param {Vector2} v Scaling vector
         * @returns {Matrix2d} out
         */
        Matrix2d.fromScaling = function (out, v) {
            out[0] = v[0];
            out[1] = 0;
            out[2] = 0;
            out[3] = v[1];
            out[4] = 0;
            out[5] = 0;
            return out;
        };
        /**
         * Creates a matrix from a vector translation
         * This is equivalent to (but much faster than):
         *
         *     Matrix2d.identity(dest);
         *     Matrix2d.translate(dest, dest, vec);
         *
         * @param {Matrix2d} out Matrix2d receiving operation result
         * @param {Vector2} v Translation vector
         * @returns {Matrix2d} out
         */
        Matrix2d.fromTranslation = function (out, v) {
            out[0] = 1;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            out[4] = v[0];
            out[5] = v[1];
            return out;
        };
        /**
         * Returns a string representation of a Matrix2d
         *
         * @param {Matrix2d} a matrix to represent as a string
         * @returns {String} string representation of the matrix
         */
        Matrix2d.toString = function (a) {
            return 'Matrix2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
                a[3] + ', ' + a[4] + ', ' + a[5] + ')';
        };
        /**
         * Returns Frobenius norm of a Matrix2d
         *
         * @param {Matrix2d} a the matrix to calculate Frobenius norm of
         * @returns {Number} Frobenius norm
         */
        Matrix2d.frob = function (a) {
            return (Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1));
        };
        /**
         * Adds two Matrix2d's
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the first operand
         * @param {Matrix2d} b the second operand
         * @returns {Matrix2d} out
         */
        Matrix2d.add = function (out, a, b) {
            out[0] = a[0] + b[0];
            out[1] = a[1] + b[1];
            out[2] = a[2] + b[2];
            out[3] = a[3] + b[3];
            out[4] = a[4] + b[4];
            out[5] = a[5] + b[5];
            return out;
        };
        /**
         * Subtracts matrix b from matrix a
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the first operand
         * @param {Matrix2d} b the second operand
         * @returns {Matrix2d} out
         */
        Matrix2d.sub = function (out, a, b) {
            out[0] = a[0] - b[0];
            out[1] = a[1] - b[1];
            out[2] = a[2] - b[2];
            out[3] = a[3] - b[3];
            out[4] = a[4] - b[4];
            out[5] = a[5] - b[5];
            return out;
        };
        /**
         * Multiply each element of the matrix by a scalar.
         *
         * @param {Matrix2d} out the receiving matrix
         * @param {Matrix2d} a the matrix to scale
         * @param {Number} b amount to scale the matrix's elements by
         * @returns {Matrix2d} out
         */
        Matrix2d.multiplyScalar = function (out, a, b) {
            out[0] = a[0] * b;
            out[1] = a[1] * b;
            out[2] = a[2] * b;
            out[3] = a[3] * b;
            out[4] = a[4] * b;
            out[5] = a[5] * b;
            return out;
        };
        /**
         * Adds two Matrix2d's after multiplying each element of the second operand by a scalar value.
         *
         * @param {Matrix2d} out the receiving vector
         * @param {Matrix2d} a the first operand
         * @param {Matrix2d} b the second operand
         * @param {Number} scale the amount to scale b's elements by before adding
         * @returns {Matrix2d} out
         */
        Matrix2d.multiplyScalarAndAdd = function (out, a, b, scale) {
            out[0] = a[0] + (b[0] * scale);
            out[1] = a[1] + (b[1] * scale);
            out[2] = a[2] + (b[2] * scale);
            out[3] = a[3] + (b[3] * scale);
            out[4] = a[4] + (b[4] * scale);
            out[5] = a[5] + (b[5] * scale);
            return out;
        };
        /**
         * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
         *
         * @param {Matrix2d} a The first matrix.
         * @param {Matrix2d} b The second matrix.
         * @returns {Boolean} True if the matrices are equal, false otherwise.
         */
        Matrix2d.equals = function (a, b) {
            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
        };
        return Matrix2d;
    }(Float32Array));
    s2d.Matrix2d = Matrix2d;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    /**
     * Rect
     * uses 4 values: x, y, width and height
     */
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect() {
            return _super.apply(this, arguments) || this;
        }
        Rect.create = function () {
            var a = new Float32Array(4);
            a[0] = 0;
            a[1] = 0;
            a[2] = 0;
            a[3] = 0;
            return a;
        };
        Rect.clone = function (a) {
            var out = Rect.create();
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        };
        Rect.fromValues = function (x, y, width, height) {
            var out = Rect.create();
            out[0] = x;
            out[1] = y;
            out[2] = width;
            out[3] = height;
            return out;
        };
        Rect.copy = function (out, a) {
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            return out;
        };
        Rect.set = function (out, x, y, width, height) {
            out[0] = x;
            out[1] = y;
            out[2] = width;
            out[3] = height;
            return out;
        };
        Rect.containts = function (rect, x, y) {
            var rx = rect[0];
            var ry = rect[1];
            var rwidth = rect[2];
            var rheight = rect[3];
            return x >= rx && x <= rx + rwidth && y >= ry && y <= ry + rheight;
        };
        return Rect;
    }(Float32Array));
    s2d.Rect = Rect;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var SMath = (function () {
        function SMath() {
        }
        SMath.clamp = function (v, min, max) {
            if (v < min)
                return min;
            else if (v > max)
                return max;
            return v;
        };
        SMath.randomInRangeFloat = function (min, max) {
            return min + Math.random() * (max - min);
        };
        SMath.randomInRangeInteger = function (min, max) {
            return Math.floor(min + Math.random() * (max - min));
        };
        return SMath;
    }());
    SMath.deg2rad = Math.PI / 180;
    SMath.rad2deg = 180 / Math.PI;
    SMath.EPSILON = 0.000001;
    SMath.equals = function (a, b) {
        return Math.abs(a - b) <= SMath.EPSILON;
    };
    s2d.SMath = SMath;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var RenderVertex = (function () {
        function RenderVertex() {
        }
        RenderVertex.prototype.copyFrom = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.color = v.color;
            this.u = v.u;
            this.v = v.v;
            return this;
        };
        RenderVertex.prototype.transformMat2d = function (m) {
            var x = this.x, y = this.y;
            this.x = m[0] * x + m[2] * y + m[4];
            this.y = m[1] * x + m[3] * y + m[5];
            return this;
        };
        RenderVertex.prototype.setXYUV = function (x, y, u, v) {
            this.x = x;
            this.y = y;
            this.u = u;
            this.v = v;
            return this;
        };
        return RenderVertex;
    }());
    s2d.RenderVertex = RenderVertex;
})(s2d || (s2d = {}));
/// <reference path="RenderBuffer.ts" />
/// <reference path="RenderProgram.ts" />
/// <reference path="RenderVertex.ts" />
var s2d;
(function (s2d) {
    var RenderMesh = (function () {
        function RenderMesh(maxTriangles) {
            if (maxTriangles === void 0) { maxTriangles = 1024; }
            this.backingVertexArray = null;
            this.positions = null;
            this.colors = null;
            this.uvs = null;
            this.backingIndexArray = null;
            this.indexes = null;
            this.indexesOffset = 0;
            this.vertexOffset = 0;
            this.maxVertex = 0;
            this.maxIndex = 0;
            this._maxTriangles = 0;
            this._maxTriangles = maxTriangles;
            this.maxVertex = maxTriangles * 3;
            this.maxIndex = maxTriangles * 3;
            this.backingVertexArray = new ArrayBuffer(this.maxVertex * RenderMesh.VERTEX_SIZE);
            this.positions = new Float32Array(this.backingVertexArray);
            this.colors = new Uint32Array(this.backingVertexArray);
            this.uvs = new Uint16Array(this.backingVertexArray);
            this.backingIndexArray = new ArrayBuffer(this.maxIndex * RenderMesh.INDEX_SIZE);
            this.indexes = new Uint16Array(this.backingIndexArray);
        }
        Object.defineProperty(RenderMesh.prototype, "vertexCount", {
            get: function () {
                return this.vertexOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderMesh.prototype, "indexCount", {
            get: function () {
                return this.indexesOffset;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderMesh.prototype, "vertexArray", {
            get: function () {
                return this.backingVertexArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderMesh.prototype, "indexArray", {
            get: function () {
                return this.backingIndexArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RenderMesh.prototype, "maxTriangles", {
            get: function () {
                return this._maxTriangles;
            },
            enumerable: true,
            configurable: true
        });
        RenderMesh.prototype.reset = function () {
            this.vertexOffset = 0;
            this.indexesOffset = 0;
        };
        RenderMesh.prototype.canDrawRectSimple = function () {
            return this.vertexOffset + 4 <= this.maxVertex && this.indexesOffset + 6 <= this.maxIndex;
        };
        RenderMesh.prototype.drawRectSimple = function (mat, size, uvRect, color) {
            var tmpV1 = RenderMesh.tmpV1;
            var tmpV2 = RenderMesh.tmpV2;
            var tmpV3 = RenderMesh.tmpV3;
            var tmpV4 = RenderMesh.tmpV4;
            var u0 = uvRect[0];
            var v0 = uvRect[1];
            var u1 = uvRect[0] + uvRect[2];
            var v1 = uvRect[1] + uvRect[3];
            //Top left
            tmpV1.x = 0;
            tmpV1.y = 0;
            tmpV1.color = color.abgrHex;
            tmpV1.u = u0;
            tmpV1.v = v0;
            //Top right
            tmpV2.x = size[0];
            tmpV2.y = 0;
            tmpV2.color = color.abgrHex;
            tmpV2.u = u1;
            tmpV2.v = v0;
            //Bottom right
            tmpV3.x = size[0];
            tmpV3.y = size[1];
            tmpV3.color = color.abgrHex;
            tmpV3.u = u1;
            tmpV3.v = v1;
            //Bottom left
            tmpV4.x = 0;
            tmpV4.y = size[1];
            tmpV4.color = color.abgrHex;
            tmpV4.u = u0;
            tmpV4.v = v1;
            tmpV1.transformMat2d(mat);
            tmpV2.transformMat2d(mat);
            tmpV3.transformMat2d(mat);
            tmpV4.transformMat2d(mat);
            this.drawRect(tmpV1, tmpV2, tmpV3, tmpV4);
        };
        RenderMesh.prototype.canDrawRect9Slice = function () {
            //Draws 9 rects
            return this.vertexOffset + 4 * 9 <= this.maxVertex && this.indexesOffset + 6 * 9 <= this.maxIndex;
        };
        RenderMesh.prototype.drawRect9Slice = function (mat, size, rect, uvRect, innerRect, innerUvRect, color) {
            var tmpV1 = RenderMesh.tmpV1;
            var tmpV2 = RenderMesh.tmpV2;
            var tmpV3 = RenderMesh.tmpV3;
            var tmpV4 = RenderMesh.tmpV4;
            var u0 = uvRect[0];
            var v0 = uvRect[1];
            var u1 = uvRect[0] + uvRect[2];
            var v1 = uvRect[1] + uvRect[3];
            var iu0 = innerUvRect[0];
            var iv0 = innerUvRect[1];
            var iu1 = innerUvRect[0] + innerUvRect[2];
            var iv1 = innerUvRect[1] + innerUvRect[3];
            //Draws a total of 9 rects
            tmpV1.color = tmpV2.color = tmpV3.color = tmpV4.color = color.abgrHex;
            var x0 = 0;
            var y0 = 0;
            var x1 = size[0];
            var y1 = size[1];
            var leftWidth = innerRect[0] - rect[0];
            var rightWidth = rect[0] + rect[2] - (innerRect[0] + innerRect[2]);
            var topHeight = innerRect[1] - rect[1];
            var bottomHeight = rect[1] + rect[3] - (innerRect[1] + innerRect[3]);
            var ix0 = x0 + leftWidth;
            var iy0 = y0 + topHeight;
            var ix1 = x1 - rightWidth;
            var iy1 = y1 - bottomHeight;
            /**
             * Reference:
             *
             *  x0,y0                             x1,y0
             *   /----------------------------------\
             *   |                                  |
             *   |  ix0,iy0               ix1,iy0   |
             *   |   /-----------------------\      |
             *   |   |                       |      |
             *   |   |                       |      |
             *   |   |                       |      |
             *   |   \-----------------------/      |
             *   |  ix0,iy1               ix1,iy1   |
             *   |                                  |
             *   \----------------------------------/
             *  x0,y1                             x1,y1
             *
             *
             *
             */
            //TODO: OPTIMIZE!!!
            //This can be done with only 16 vertexes, since all vertexes share uv / colors 
            //Top left corner
            this.drawRect(tmpV1.setXYUV(x0, y0, u0, v0).transformMat2d(mat), tmpV2.setXYUV(ix0, y0, iu0, v0).transformMat2d(mat), tmpV3.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat), tmpV4.setXYUV(x0, iy0, u0, iv0).transformMat2d(mat));
            //Top middle
            this.drawRect(tmpV1.setXYUV(ix0, y0, iu0, v0).transformMat2d(mat), tmpV2.setXYUV(ix1, y0, iu1, v0).transformMat2d(mat), tmpV3.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat), tmpV4.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat));
            //Top right corner
            this.drawRect(tmpV1.setXYUV(ix1, y0, iu1, v0).transformMat2d(mat), tmpV2.setXYUV(x1, y0, u1, v0).transformMat2d(mat), tmpV3.setXYUV(x1, iy0, u1, iv0).transformMat2d(mat), tmpV4.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat));
            //Center left
            this.drawRect(tmpV1.setXYUV(x0, iy0, u0, iv0).transformMat2d(mat), tmpV2.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat), tmpV3.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat), tmpV4.setXYUV(x0, iy1, u0, iv1).transformMat2d(mat));
            //Center middle
            this.drawRect(tmpV1.setXYUV(ix0, iy0, iu0, iv0).transformMat2d(mat), tmpV2.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat), tmpV3.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat), tmpV4.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat));
            //Center right
            this.drawRect(tmpV1.setXYUV(ix1, iy0, iu1, iv0).transformMat2d(mat), tmpV2.setXYUV(x1, iy0, u1, iv0).transformMat2d(mat), tmpV3.setXYUV(x1, iy1, u1, iv1).transformMat2d(mat), tmpV4.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat));
            //Bottom left corner
            this.drawRect(tmpV1.setXYUV(x0, iy1, u0, iv1).transformMat2d(mat), tmpV2.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat), tmpV3.setXYUV(ix0, y1, iu0, v1).transformMat2d(mat), tmpV4.setXYUV(x0, y1, u0, v1).transformMat2d(mat));
            //Bottom middle
            this.drawRect(tmpV1.setXYUV(ix0, iy1, iu0, iv1).transformMat2d(mat), tmpV2.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat), tmpV3.setXYUV(ix1, y1, iu1, v1).transformMat2d(mat), tmpV4.setXYUV(ix0, y1, iu0, v1).transformMat2d(mat));
            //Bottom right corner
            this.drawRect(tmpV1.setXYUV(ix1, iy1, iu1, iv1).transformMat2d(mat), tmpV2.setXYUV(x1, iy1, u1, iv1).transformMat2d(mat), tmpV3.setXYUV(x1, y1, u1, v1).transformMat2d(mat), tmpV4.setXYUV(ix1, y1, iu1, v1).transformMat2d(mat));
        };
        RenderMesh.prototype.canDrawRect = function () {
            return this.vertexOffset + 4 <= this.maxVertex && this.indexesOffset + 6 <= this.maxIndex;
        };
        RenderMesh.prototype.drawRect = function (tmpV1, tmpV2, tmpV3, tmpV4) {
            if (this.vertexOffset + 4 > this.maxVertex || this.indexesOffset + 6 > this.maxIndex) {
                s2d.EngineConsole.error("Mesh is full!!!");
                return;
            }
            var vertexOffset = this.vertexOffset;
            var indexesOffset = this.indexesOffset;
            var positions = this.positions;
            var colors = this.colors;
            var uvs = this.uvs;
            var indexes = this.indexes;
            var positionsOffset = vertexOffset * 4;
            var colorsOffset = vertexOffset * 4;
            var uvsOffset = vertexOffset * 8;
            //Add 4 vertexes
            positions[positionsOffset + 0] = tmpV1.x;
            positions[positionsOffset + 1] = tmpV1.y;
            colors[colorsOffset + 2] = tmpV1.color;
            uvs[uvsOffset + 6] = tmpV1.u * 65535;
            uvs[uvsOffset + 7] = tmpV1.v * 65535;
            positions[positionsOffset + 4] = tmpV2.x;
            positions[positionsOffset + 5] = tmpV2.y;
            colors[colorsOffset + 6] = tmpV2.color;
            uvs[uvsOffset + 14] = tmpV2.u * 65535;
            uvs[uvsOffset + 15] = tmpV2.v * 65535;
            positions[positionsOffset + 8] = tmpV3.x;
            positions[positionsOffset + 9] = tmpV3.y;
            colors[colorsOffset + 10] = tmpV3.color;
            uvs[uvsOffset + 22] = tmpV3.u * 65535;
            uvs[uvsOffset + 23] = tmpV3.v * 65535;
            positions[positionsOffset + 12] = tmpV4.x;
            positions[positionsOffset + 13] = tmpV4.y;
            colors[colorsOffset + 14] = tmpV4.color;
            uvs[uvsOffset + 30] = tmpV4.u * 65535;
            uvs[uvsOffset + 31] = tmpV4.v * 65535;
            //Add 2 triangles
            //First triangle (0 -> 1 -> 2)
            indexes[indexesOffset + 0] = vertexOffset + 0;
            indexes[indexesOffset + 1] = vertexOffset + 1;
            indexes[indexesOffset + 2] = vertexOffset + 2;
            //Second triangle (2 -> 3 -> 0)
            indexes[indexesOffset + 3] = vertexOffset + 2;
            indexes[indexesOffset + 4] = vertexOffset + 3;
            indexes[indexesOffset + 5] = vertexOffset + 0;
            this.vertexOffset += 4;
            this.indexesOffset += 6;
        };
        return RenderMesh;
    }());
    RenderMesh.VERTEX_SIZE = 2 * 4 + 4 * 1 + 2 * 2; //(2 floats [X,Y] + 4 byte [A,B,G,R] + 2 byte (U,V) )
    RenderMesh.INDEX_SIZE = 2; //16 bits
    RenderMesh.tmpV1 = new s2d.RenderVertex();
    RenderMesh.tmpV2 = new s2d.RenderVertex();
    RenderMesh.tmpV3 = new s2d.RenderVertex();
    RenderMesh.tmpV4 = new s2d.RenderVertex();
    s2d.RenderMesh = RenderMesh;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var EmbeddedAssets = (function () {
        function EmbeddedAssets() {
        }
        EmbeddedAssets.init = function () {
            s2d.loader.loadRenderFontFromUrl("defaultFont", "assets/font.xml");
            s2d.loader.loadRenderSpriteAtlasFromUrl("defaultSkinAtlas", "assets/gui_skin.xml");
        };
        Object.defineProperty(EmbeddedAssets, "defaultFont", {
            get: function () {
                if (EmbeddedAssets._defaultFont === null)
                    EmbeddedAssets._defaultFont = s2d.loader.getAsset("defaultFont");
                return EmbeddedAssets._defaultFont;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EmbeddedAssets, "defaultSkinAtlas", {
            get: function () {
                if (EmbeddedAssets._defaultSkinAtlas === null)
                    EmbeddedAssets._defaultSkinAtlas = s2d.loader.getAsset("defaultSkinAtlas");
                return EmbeddedAssets._defaultSkinAtlas;
            },
            enumerable: true,
            configurable: true
        });
        return EmbeddedAssets;
    }());
    //Default font is KenPixel.ttf at 12px height
    EmbeddedAssets._defaultFont = null;
    EmbeddedAssets._defaultSkinAtlas = null;
    s2d.EmbeddedAssets = EmbeddedAssets;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var EmbeddedData = (function () {
        function EmbeddedData() {
        }
        return EmbeddedData;
    }());
    s2d.EmbeddedData = EmbeddedData;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var EngineConfiguration = (function () {
        function EngineConfiguration() {
        }
        return EngineConfiguration;
    }());
    EngineConfiguration.RENDER_ENABLED = true;
    EngineConfiguration.LOG_PERFORMANCE = false;
    s2d.EngineConfiguration = EngineConfiguration;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var EngineConsole = (function () {
        function EngineConsole() {
        }
        EngineConsole.error = function (message, target) {
            if (target === void 0) { target = null; }
            var prefix = "";
            if (target instanceof s2d.Component) {
                var componentClassName = EngineConsole.getClassName(target);
                prefix = target.entity.name + "->" + componentClassName + ": ";
            }
            else if (target instanceof s2d.Entity) {
                prefix = target.name + ": ";
            }
            console.error(prefix + message);
        };
        EngineConsole.warning = function (message, target) {
            if (target === void 0) { target = null; }
            var prefix = "";
            if (target instanceof s2d.Component) {
                var componentClassName = EngineConsole.getClassName(target);
                prefix = target.entity.name + "->" + componentClassName + ": ";
            }
            else if (target instanceof s2d.Entity) {
                prefix = target.name + ": ";
            }
            console.warn(prefix + message);
        };
        EngineConsole.info = function (message, target) {
            if (target === void 0) { target = null; }
            var prefix = "";
            if (target instanceof s2d.Component) {
                var componentClassName = EngineConsole.getClassName(target);
                prefix = target.entity.name + "->" + componentClassName + ": ";
            }
            else if (target instanceof s2d.Entity) {
                prefix = target.name + ": ";
            }
            console.info(prefix + message);
        };
        EngineConsole.getClassName = function (instance) {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(instance["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        };
        return EngineConsole;
    }());
    s2d.EngineConsole = EngineConsole;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var Pool = (function () {
        function Pool(classOrFactoryMethod, precreateCount) {
            if (precreateCount === void 0) { precreateCount = 5; }
            this._instances = new Array();
            this._factoryMethod = null;
            this._clazz = null;
            this._createdInstancesCount = 0;
            if (classOrFactoryMethod instanceof Function)
                this._factoryMethod = classOrFactoryMethod;
            else
                this._clazz = classOrFactoryMethod;
            for (var i = 0; i < precreateCount; i++)
                this._instances.push(this.getNew());
        }
        Object.defineProperty(Pool.prototype, "createdInstancesCount", {
            get: function () {
                return this._createdInstancesCount;
            },
            enumerable: true,
            configurable: true
        });
        Pool.prototype.getNew = function () {
            this._createdInstancesCount++;
            if (this._clazz !== null)
                return new this._clazz();
            else
                return this._factoryMethod.call(null);
        };
        Pool.prototype.get = function () {
            if (this._instances.length > 0)
                return this._instances.pop();
            return this.getNew();
        };
        Pool.prototype.return = function (instance) {
            this._instances.push(instance);
        };
        return Pool;
    }());
    s2d.Pool = Pool;
})(s2d || (s2d = {}));
var s2d;
(function (s2d) {
    var Pools = (function () {
        function Pools() {
        }
        Pools.initPools = function () {
            Pools.vector2 = new s2d.Pool(s2d.Vector2.create);
            Pools.matrix2d = new s2d.Pool(s2d.Matrix2d.create);
        };
        return Pools;
    }());
    s2d.Pools = Pools;
})(s2d || (s2d = {}));
/// <reference path="EngineConfiguration.ts" />
var s2d;
(function (s2d) {
    var Stats = (function () {
        function Stats() {
            this.lastFpsTime = 0;
            this.fpsCounter = 0;
            this.accumulatedUpdateTime = 0;
            this._lastFps = 0;
            this._lastUpdateTime = 0;
            this._lastDrawcalls = 0;
            this._drawcalls = 0;
        }
        Object.defineProperty(Stats.prototype, "lastFps", {
            get: function () {
                return this._lastFps;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stats.prototype, "lastUpdateTime", {
            get: function () {
                return this._lastUpdateTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stats.prototype, "lastDrawcalls", {
            get: function () {
                return this._lastDrawcalls;
            },
            enumerable: true,
            configurable: true
        });
        Stats.prototype.init = function () {
            this.lastFpsTime = performance.now();
        };
        Stats.prototype.startFrame = function () {
            this._drawcalls = 0;
        };
        Stats.prototype.incrmentDrawcalls = function () {
            this._drawcalls++;
        };
        Stats.prototype.endFrame = function () {
            this._lastDrawcalls = this._drawcalls;
        };
        Stats.prototype.startUpdate = function () {
            this.updateStartTime = performance.now();
        };
        Stats.prototype.endUpdate = function () {
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
                if (s2d.EngineConfiguration.LOG_PERFORMANCE)
                    console.log("fps: " + Math.round(fps) + " updateTime: " + updateTime.toFixed(2) + " ms");
            }
        };
        return Stats;
    }());
    s2d.Stats = Stats;
})(s2d || (s2d = {}));

//# sourceMappingURL=main.js.map
