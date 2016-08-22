module s2d {
    export class Color {
        public rgbaHex : number;

        public get r() {
            return (this.rgbaHex >> 24) & 0xFF;
        }
        
        public get g() {
            return (this.rgbaHex >> 16) & 0xFF;
        }
        
        public get b() {
            return (this.rgbaHex >> 8) & 0xFF;
        }

        public get a() {
            return (this.rgbaHex >> 0) & 0xFF;
        }

        static fromRgba(r:number, g:number, b:number, a:number=255) { 
            let c = new Color();
            r = SMath.clamp(r, 0, 255);
            g = SMath.clamp(g, 0, 255);
            b = SMath.clamp(b, 0, 255);
            a = SMath.clamp(a, 0, 255);
            c.rgbaHex = (r << 24) | (g << 16) | (b << 8) | a;
            return c;
        }

        static fromHex(rgbaHex : number) { 
            let c = new Color();
            c.rgbaHex = rgbaHex;
            return c;
        }
    }
}