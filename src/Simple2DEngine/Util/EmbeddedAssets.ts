module s2d {
    export class EmbeddedAssets {

        private static _defaultFont: RenderFont = null;
        private static _defaultSkinAtlas: RenderSpriteAtlas = null;

        public static get defaultFont() {
            if (EmbeddedAssets._defaultFont === null)
                EmbeddedAssets._defaultFont = new RenderFont().loadFromEmbeddedData(window.atob(EmbeddedData.fontXmlBase64), EmbeddedData.fontTextureBase64);

            return EmbeddedAssets._defaultFont;
        }

        public static get defaultSkinAtlas() {
            if (EmbeddedAssets._defaultSkinAtlas === null)
                EmbeddedAssets._defaultSkinAtlas = new RenderSpriteAtlas().loadFromEmbeddedData(window.atob(EmbeddedData.guiSkinAtlasXmlBase64), EmbeddedData.guiSkinTextureBase64);

            return EmbeddedAssets._defaultSkinAtlas;
        }
    }
}