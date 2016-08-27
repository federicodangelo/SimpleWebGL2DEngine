module s2d {

    export class TextVertextGeneratorChar {
        public v1 : RenderVertex = new RenderVertex();
        public v2 : RenderVertex = new RenderVertex();
        public v3 : RenderVertex = new RenderVertex();
        public v4 : RenderVertex = new RenderVertex();
        public charCode:number;
    }

    export class TextVertextGenerator {

        private _font: RenderFont = null;
        private _text: string = null;
        private _scale: number = -1;
        private _vertexChars: Array<TextVertextGeneratorChar> = new Array<TextVertextGeneratorChar>();
        private _current : Vector2 = Vector2.create();
        private _size: Vector2 = Vector2.create();
        
        public get vertexChars() {
            return this._vertexChars;
        }
        
        public get size() {
            return this._size;
        }

        public update(font:RenderFont, scale:number, text:string) {

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
        }

        private updateChars() {

            let font = this._font;
            let text = this._text;
            let textLen = text.length;
            let scale = this._scale;

            let texture = font.texture;
            let textureWidth = font.textureWidth;
            let textureHeight = font.textureHeight;
            let lineHeight = font.lineHeight * scale;

            let current = this._current;

            let startX = 0;
            let startY = 0;
            let lines = 0;

            let maxX = 0;
            let maxY = lineHeight;

            current[0] = 0;
            current[1] = 0;

            let vertexChars = this._vertexChars;
            let vertexCharsIndex = 0;
            
            for (let i = 0; i < textLen; i++) {

                let charCode = text.charCodeAt(i);
                
                if (charCode === 10) { //'\n'

                    lines++;
                    current[0] = 0;
                    current[1] += lineHeight;
                    maxY = lineHeight;

                } else {

                    let charData = font.chars[charCode];

                    if (charData) {

                        let vertexChar : TextVertextGeneratorChar = null;

                        if (vertexCharsIndex === vertexChars.length) {
                            vertexChar = new TextVertextGeneratorChar();
                            vertexChars.push(vertexChar);
                        } else {
                            vertexChar = vertexChars[vertexCharsIndex];
                        }
                        vertexCharsIndex++;

                        vertexChar.charCode = charCode;

                        let charWidth = charData.width;
                        let charHeight = charData.height;

                        let dx = charData.xoffset * scale;
                        let dy = charData.yoffset * scale;

                        let ox = current[0];
                        let oy = current[1];

                        let tmpV1 = vertexChar.v1;
                        let tmpV2 = vertexChar.v2;
                        let tmpV3 = vertexChar.v3;
                        let tmpV4 = vertexChar.v4;

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
        }
    }
}
