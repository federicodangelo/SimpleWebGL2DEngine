module Simple2DEngine {
    
    export class Transform extends Component {

        private _parent : Transform;
        private _position : Vector2;
        private _rotation : number;
        private _scale : Vector2;
        private _size : Vector2;

        public get parent() {
            return this._parent;
        }

        public set parent(p:Transform) {
            this._parent = p;
        }

        public get localPosition() {
            return this._position;
        }

        public set localPosition(p:Vector2) {
            Vector2.copy(this._position, p);
        }

        public get localX() {
            return this._position[0];
        }

        public set localX(v:number) {
            this._position[0] = v;
        }

        public get localY() {
            return this._position[1];
        }

        public set localY(v:number) {
            this._position[1] = v;
        }

        public get localRotationRadians() {
            return this._rotation;
        }

        public set localRotationRadians(rad:number) {
            this._rotation = rad;
        }

        public get localRotationDegrees() {
            return this._rotation * SMath.rad2deg;
        }

        public set localRotationDegrees(deg:number) {
            this._rotation = deg * SMath.deg2rad;
        }

        public get localScale() { 
            return this._scale;
        }

        public set localScale(s:Vector2) {
            Vector2.copy(this._scale, s);
        }

        public get localScaleX() { 
            return this._scale[0];
        }

        public set localScaleX(v:number) { 
            this._scale[0] = v;
        }

        public get localScaleY() { 
            return this._scale[1];
        }

        public set localScaleY(v:number) { 
            this._scale[1] = v;
        }

        public get size() {
            return this._size;
        }

        public set size(s:Vector2) {
            Vector2.copy(this._size, s);
        }

        public get sizeX() {
            return this._size[0];
        }

        public set sizeX(v:number) {
            this._size[0] = v;
        }

        public get sizeY() {
            return this._size[1];
        }

        public set sizeY(v:number) {
            this._size[1] = v;
        }

        public constructor() {
            super();
            this._position = Vector2.create();
            this._rotation = 0;
            this._scale = Vector2.fromValues(1, 1); 
            this._size = Vector2.fromValues(32, 32);
        }

        public getLocalMatrix(out:Matrix3) : Matrix3 {
            Matrix3.fromTranslation(out, this._position);
            Matrix3.scale(out, out, this._scale);
            Matrix3.rotate(out, out, this._rotation);
            return out;
        }

        static tmp : Matrix3;

        public getLocalToGlobalMatrix(out:Matrix3) : Matrix3 {
            this.getLocalMatrix(out);
            if (this._parent != null) {
                if (Transform.tmp == null)
                    Transform.tmp = Matrix3.create();
                this._parent.getLocalToGlobalMatrix(Transform.tmp);
                Matrix3.mul(out, Transform.tmp, out);
            }
            return out;
        }

        public getGlobalToLocalMatrix(out:Matrix3) : Matrix3 {
            this.getLocalToGlobalMatrix(out);
            Matrix3.invert(out, out);
            return out;
        }
    }
}