/// <reference path="../Drawer.ts" />

module s2d {

    export class TextDrawer extends Drawer {

        private _font: RenderFont = EmbeddedAssets.defaultFont;
        private _color: Color = Color.fromRgba(255, 255, 255, 255);
        private _text: string = "Text";
        private _fontScale: number = 1;
        private _textVertexGenerator: TextVertextGenerator = new TextVertextGenerator();

        public get font(): RenderFont {
            return this._font;
        }

        public set font(value: RenderFont) {
            this._font = value;
        }

        public get color(): Color {
            return this._color;
        }

        public set color(value: Color) {
            this._color.copyFrom(value);
        }

        public get text(): string {
            return this._text;
        }

        public set text(value: string) {
            this._text = value;
        }

        public get fontScale(): number {
            return this._fontScale;
        }

        public set fontScale(value: number) {
            this._fontScale = value;
        }

        private static tmpRight: Vector2;
        private static tmpDown: Vector2;
        private static tmpV1: RenderVertex;
        private static tmpV2: RenderVertex;
        private static tmpV3: RenderVertex;
        private static tmpV4: RenderVertex;
        private static tmpTopLeft: Vector2;

        public static initStatic() {
            TextDrawer.tmpRight = Vector2.create();
            TextDrawer.tmpDown = Vector2.create();
            TextDrawer.tmpV1 = new RenderVertex();
            TextDrawer.tmpV2 = new RenderVertex();
            TextDrawer.tmpV3 = new RenderVertex();
            TextDrawer.tmpV4 = new RenderVertex();
            TextDrawer.tmpTopLeft = Vector2.create();
        }

        public getBestSize() : Vector2 {
            this.updateTextVertexGenerator();
            return this._textVertexGenerator.size;
        }

        private updateTextVertexGenerator() {
            this._textVertexGenerator.update(this._font, this._fontScale, this._text);
        }

        public draw(commands: RenderCommands): void {

            let texture = this.font.texture;

            if (texture == null)
                return; //Texture not loaded yet

            this.updateTextVertexGenerator();

            let trans = this.entity.transform;

            let tmpMatrix = Drawer.tmpMatrix;
            let tmpVector = Drawer.tmpVector;

            let colorNumber = this._color.abgrHex;

            trans.getLocalToGlobalMatrix(tmpMatrix);

            let vertexChars = this._textVertexGenerator.vertexChars;

            let tmpV1 = TextDrawer.tmpV1;
            let tmpV2 = TextDrawer.tmpV2;
            let tmpV3 = TextDrawer.tmpV3;
            let tmpV4 = TextDrawer.tmpV4;

            //Offset matrix by pivot, vertex coordinates are generated starting at (0,0) and going (right,down)
            //so we need to offset the pivot by (1, 1) to get the expected behavior

            tmpVector[0] = -trans.sizeX * 0.5 * (trans.pivotX + 1);
            tmpVector[1] = -trans.sizeY * 0.5 * (trans.pivotY + 1);
            Matrix2d.translate(tmpMatrix, tmpMatrix, tmpVector);
            
            for (let i = 0; i < vertexChars.length; i++) {

                let vertexChar = vertexChars[i];

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
        }
    }
}
