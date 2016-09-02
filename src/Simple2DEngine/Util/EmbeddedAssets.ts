module s2d {
    export class EmbeddedAssets {

        //Default font is KenPixel.ttf at 12px height
        private static _defaultFont: RenderFont = null;
        private static _defaultSkinAtlas: RenderSpriteAtlas = null;

        public static init() {
            loader.loadRenderFontFromUrl("defaultFont", "assets/font.xml");
            loader.loadRenderSpriteAtlasFromUrl("defaultSkinAtlas", "assets/gui_skin.xml");
        }

        public static get defaultFont() {
            if (EmbeddedAssets._defaultFont === null)
                EmbeddedAssets._defaultFont = loader.getAsset("defaultFont");

            return EmbeddedAssets._defaultFont;
        }

        public static get defaultSkinAtlas() {
            if (EmbeddedAssets._defaultSkinAtlas === null)
                EmbeddedAssets._defaultSkinAtlas = loader.getAsset("defaultSkinAtlas");

            return EmbeddedAssets._defaultSkinAtlas;
        }
    }
}