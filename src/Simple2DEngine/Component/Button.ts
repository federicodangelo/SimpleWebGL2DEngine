/// <reference path="Interactable.ts" />

module s2d {
    export class Button extends Interactable {
        private _onClick: Event<Button> = new Event<Button>();
        private _buttonSprite: RenderSprite = null;
        private _buttonSpriteDown: RenderSprite = null;

        public get buttonSprite(): RenderSprite {
            return this._buttonSprite;
        }

        public set buttonSprite(value: RenderSprite) {
            this._buttonSprite = value;
        }

        public get buttonSpriteDown(): RenderSprite {
            return this._buttonSpriteDown;
        }

        public set buttonSpriteDown(value: RenderSprite) {
            this._buttonSpriteDown = value;
        }

        private _spriteDrawer: SpriteDrawer = null;

        protected onInit() {
            this._buttonSprite = EmbeddedAssets.defaultSkinAtlas.getSprite("button");
            this._buttonSpriteDown = EmbeddedAssets.defaultSkinAtlas.getSprite("button_down");

            if (!(this.entity.firstDrawer instanceof SpriteDrawer)) {
                EngineConsole.error("Missing SpriteDrawer", this);
            } else {
                this._spriteDrawer = <SpriteDrawer>this.entity.firstDrawer;
                this._spriteDrawer.sprite = this._buttonSprite;
            }
        }

        public get onClick() {
            return this._onClick;
        }

        public onPointerDown(pointer: InputPointer) {
            if (this._spriteDrawer !== null && this._buttonSpriteDown !== null)
                this._spriteDrawer.sprite = this._buttonSpriteDown;
        }

        public onPointerUp(pointer: InputPointer) {
            if (this._spriteDrawer !== null)
                this._spriteDrawer.sprite = this._buttonSprite;

            this._onClick.post(this);
        }
    }
}