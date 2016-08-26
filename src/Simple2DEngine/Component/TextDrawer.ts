/// <reference path="Component.ts" />
/// <reference path="../Math/Matrix3.ts" />
/// <reference path="../Math/Vector2.ts" />

module s2d {

    export class TextDrawer extends Drawer {

        public font: RenderFont;
        public color: Color = Color.fromRgba(255, 255, 255, 255);
        public text: string = "Nice FPS drawing!!";
        public scale: number = 1;

        static tmpRight: Vector2;
        static tmpDown: Vector2;
        static tmpV1: RenderVertex;
        static tmpV2: RenderVertex;
        static tmpV3: RenderVertex;
        static tmpV4: RenderVertex;
        static tmpTopLeft: Vector2;

        static initStatic() {
            TextDrawer.tmpRight = Vector2.create();
            TextDrawer.tmpDown = Vector2.create();
            TextDrawer.tmpV1 = new RenderVertex();
            TextDrawer.tmpV2 = new RenderVertex();
            TextDrawer.tmpV3 = new RenderVertex();
            TextDrawer.tmpV4 = new RenderVertex();
            TextDrawer.tmpTopLeft = Vector2.create();
        }

        public draw(commands: RenderCommands): void {

            let font = this.font;
            let text = this.text;
            let scale = this.scale;

            if (font.texture === null)
                return; //Texture not loaded yet

            let texture = font.texture;
            let textureWidth = font.textureWidth;
            let textureHeight = font.textureHeight;
            let lineHeight = font.lineHeight;

            let right = TextDrawer.tmpRight;
            let down = TextDrawer.tmpDown;
            let tmpV1 = TextDrawer.tmpV1;
            let tmpV2 = TextDrawer.tmpV2;
            let tmpV3 = TextDrawer.tmpV3;
            let tmpV4 = TextDrawer.tmpV4;
            let topLeft = TextDrawer.tmpTopLeft;

            let trans = this.entity.transform;
            let matrix = Drawer.tmpMatrix;

            tmpV1.color = tmpV2.color = tmpV3.color = tmpV4.color = this.color.abgrHex;

            trans.getLocalToGlobalMatrix(matrix);

            //By scaling the right / down vector with "scale", everything is automatically
            //correctly scaled!
            Vector2.set(right, 1 * scale, 0);
            Vector2.transformMat2dNormal(right, right, matrix);

            Vector2.set(down, 0, 1 * scale);
            Vector2.transformMat2dNormal(down, down, matrix);

            Vector2.set(topLeft, 0, 0);
            Vector2.transformMat2d(topLeft, topLeft, matrix);

            let startX = topLeft[0];
            let startY = topLeft[1];
            let lines = 0;

            for (let i = 0; i < text.length; i++) {

                let charCode = text.charCodeAt(i);

                if (charCode === 10) { //'\n'

                    lines++;
                    topLeft[0] = startX + down[0] * lines * lineHeight;
                    topLeft[1] = startY + down[1] * lines * lineHeight;

                } else {

                    let charData = font.chars[charCode];

                    if (charData) {

                        var charWidth = charData.width;
                        var charHeight = charData.height;

                        var dx = charData.xoffset;
                        var dy = charData.yoffset;

                        var ox = topLeft[0];
                        var oy = topLeft[1];

                        //offset char dx / dy
                        topLeft[0] += right[0] * dx + down[0] * dy;
                        topLeft[1] += right[1] * dx + down[1] * dy;

                        tmpV1.x = topLeft[0];
                        tmpV1.y = topLeft[1];
                        tmpV1.u = charData.x / textureWidth;
                        tmpV1.v = charData.y / textureHeight;

                        tmpV2.x = topLeft[0] + right[0] * charWidth;
                        tmpV2.y = topLeft[1] + right[1] * charWidth;
                        tmpV2.u = (charData.x + charWidth) / textureWidth;
                        tmpV2.v = charData.y / textureHeight;

                        tmpV3.x = topLeft[0] + right[0] * charWidth + down[0] * charHeight;
                        tmpV3.y = topLeft[1] + right[1] * charWidth + down[1] * charHeight;
                        tmpV3.u = (charData.x + charWidth) / textureWidth;
                        tmpV3.v = (charData.y + charHeight) / textureHeight;

                        tmpV4.x = topLeft[0] + down[0] * charHeight;
                        tmpV4.y = topLeft[1] + down[1] * charHeight;
                        tmpV4.u = charData.x / textureWidth;
                        tmpV4.v = (charData.y + charHeight) / textureHeight;

                        //draw char
                        commands.drawRect(tmpV1, tmpV2, tmpV3, tmpV4, texture);

                        //offset char xadvance
                        topLeft[0] = ox + right[0] * charData.xadvance;
                        topLeft[1] = oy + right[1] * charData.xadvance;
                    }
                }
            }
        }
    }
}
