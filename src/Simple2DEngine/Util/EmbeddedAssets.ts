module s2d {
    export class EmbeddedAssets {

        private static _defaultFont : RenderFont;

        public static get defaultFont() {
            if (!EmbeddedAssets._defaultFont)
                EmbeddedAssets._defaultFont = new RenderFont().loadFromEmbeddedData(window.atob(EmbeddedData.fontXmlBase64), EmbeddedData.fontTextureBase64);

            return EmbeddedAssets._defaultFont;
        }

    }
}