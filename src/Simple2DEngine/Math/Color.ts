module s2d {
    export class Color {
        //public rgbaHex : number;
        public abgrHex : number;

        public get r() {
            return (this.abgrHex >> 0) & 0xFF;
        }
        
        public get g() {
            return (this.abgrHex >> 8) & 0xFF;
        }
        
        public get b() {
            return (this.abgrHex >> 16) & 0xFF;
        }

        public get a() {
            return (this.abgrHex >> 24) & 0xFF;
        }

        public copyFrom(c:Color) {
            this.abgrHex = c.abgrHex;
        }

        public setFromRgba(r:number, g:number, b:number, a:number=255) { 
            r = SMath.clamp(r, 0, 255);
            g = SMath.clamp(g, 0, 255);
            b = SMath.clamp(b, 0, 255);
            a = SMath.clamp(a, 0, 255);
            this.abgrHex = (r << 0) | (g << 8) | (b << 16) | (a << 24);
        }

        static fromRgba(r:number, g:number, b:number, a:number=255) { 
            let c = new Color();
            c.setFromRgba(r,g,b,a);
            return c;
        }

        static fromHex(abgrHex : number) { 
            let c = new Color();
            c.abgrHex = abgrHex;
            return c;
        }
    }
}