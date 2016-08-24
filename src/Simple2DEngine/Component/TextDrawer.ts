/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class TextDrawer extends Drawer {

        public font : RenderFont;
        public color : Color = Color.fromRgba(255, 255, 255, 255);
        public text : string = "Nice FPS drawing!!";

        static tmpUVTopLeft : Vector2;
        static tmpUVBottomRight : Vector2;
        static tmpTranslate : Vector2;
        static tmpSize : Vector2;

        static initStatic() {
            TextDrawer.tmpUVTopLeft = Vector2.create();
            TextDrawer.tmpUVBottomRight = Vector2.create();
            TextDrawer.tmpTranslate = Vector2.create();
            TextDrawer.tmpSize = Vector2.create();
        }

        public draw(commands : RenderCommands) : void {

            var font = this.font;
            var color = this.color;
            var text = this.text;

            if (font.texture === null)
                return; //Texture not loaded yet

            var texture = font.texture;
            var textureWidth = font.textureWidth;
            var textureHeight = font.textureHeight;
            var uvTopLeft = TextDrawer.tmpUVTopLeft;
            var uvBottomRight = TextDrawer.tmpUVBottomRight;
            var translate = TextDrawer.tmpTranslate;
            var size = TextDrawer.tmpSize;

            var trans = this.entity.transform;
            var matrix = Drawer.tmpMatrix;

            var oldX:number = 0;
            var oldY:number = 0;

            trans.getLocalToGlobalMatrix(matrix);

            for (let i = 0; i < text.length; i++) {
                var charCode = text.charCodeAt(i);

                var charData = font.chars[charCode];

                if (charData !== null) {

                    size[0] = charData.width * 0.5;
                    size[1] = charData.height * 0.5;

                    uvTopLeft[0] = charData.x / textureWidth;
                    uvTopLeft[1] = charData.y / textureHeight;

                    uvBottomRight[0] = (charData.x + charData.width) / textureWidth;
                    uvBottomRight[1] = (charData.y + charData.height) / textureHeight;

                    //offset half-size (save last positions to restore later)
                    oldX = matrix[4];
                    oldY = matrix[5];
                    Matrix2d.translate(matrix, matrix, size);

                    //draw char
                    commands.drawRect(matrix, size, texture, uvTopLeft, uvBottomRight, color);

                    //un-offset half-size
                    matrix[4] = oldX;
                    matrix[5] = oldY;

                    //offset char xadvance
                    translate[0] = charData.xadvance;
                    translate[1] = 0;
                    Matrix2d.translate(matrix, matrix, translate);
                } 
            }

        }
   }
}