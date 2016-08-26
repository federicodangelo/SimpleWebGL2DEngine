/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class TextDrawer extends Drawer {

        public font : RenderFont;
        public color : Color = Color.fromRgba(255, 255, 255, 255);
        public text : string = "Nice FPS drawing!!";

        static tmpRight : Vector2;
        static tmpDown : Vector2;
        static tmpV1 : RenderVertex;
        static tmpV2 : RenderVertex;
        static tmpV3 : RenderVertex;
        static tmpV4 : RenderVertex;
        static tmpTopLeft : Vector2;

        static initStatic() {
            TextDrawer.tmpRight = Vector2.create();
            TextDrawer.tmpDown = Vector2.create();
            TextDrawer.tmpV1 = new RenderVertex();
            TextDrawer.tmpV2 = new RenderVertex();
            TextDrawer.tmpV3 = new RenderVertex();
            TextDrawer.tmpV4 = new RenderVertex();
            TextDrawer.tmpTopLeft = Vector2.create(); 
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
            var right = TextDrawer.tmpRight;
            var down = TextDrawer.tmpDown;
            var tmpV1 = TextDrawer.tmpV1;
            var tmpV2 = TextDrawer.tmpV2;
            var tmpV3 = TextDrawer.tmpV3;
            var tmpV4 = TextDrawer.tmpV4;
            var topLeft = TextDrawer.tmpTopLeft;

            var trans = this.entity.transform;
            var matrix = Drawer.tmpMatrix;

            tmpV1.color = tmpV2.color = tmpV3.color = tmpV4.color = this.color.abgrHex;

            trans.getLocalToGlobalMatrix(matrix);

            Vector2.set(right, 1, 0);
            Vector2.transformMat2dNormal(right, right, matrix);

            Vector2.set(down, 0, 1);
            Vector2.transformMat2dNormal(down, down, matrix);
            
            Vector2.set(topLeft, 0, 0);
            Vector2.transformMat2d(topLeft, topLeft, matrix);
            
            for (let i = 0; i < text.length; i++) {

                var charCode = text.charCodeAt(i);
                var charData = font.chars[charCode];

                if (charData !== null) {
                    tmpV1.x = topLeft[0];
                    tmpV1.y = topLeft[1];
                    tmpV1.u = charData.x / textureWidth;
                    tmpV1.v = charData.y / textureHeight;

                    tmpV2.x = topLeft[0] + right[0] * charData.width;
                    tmpV2.y = topLeft[1] + right[1] * charData.width;
                    tmpV2.u = (charData.x + charData.width) / textureWidth;
                    tmpV2.v = charData.y / textureHeight;
                    
                    tmpV3.x = topLeft[0] + right[0] * charData.width + down[0] * charData.height;
                    tmpV3.y = topLeft[1] + right[1] * charData.width + down[1] * charData.height;
                    tmpV3.u = (charData.x + charData.width) / textureWidth;
                    tmpV3.v = (charData.y + charData.height) / textureHeight;

                    tmpV4.x = topLeft[0] + down[0] * charData.height;
                    tmpV4.y = topLeft[1] + down[1] * charData.height;
                    tmpV4.u = charData.x / textureWidth;
                    tmpV4.v = (charData.y + charData.height) / textureHeight;

                    //draw char
                    commands.drawRect(tmpV1, tmpV2, tmpV3, tmpV4, texture);

                    //offset char xadvance
                    topLeft[0] += right[0] * charData.xadvance;
                    topLeft[1] += right[1] * charData.xadvance;
                } 
            }

        }
   }
}