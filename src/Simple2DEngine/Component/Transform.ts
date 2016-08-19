/// <reference path="Component.ts" />

module Simple2DEngine {
    
    export class Transform extends Component {

        private static MAX_NESTING : number = 128;

        private _parent : Transform;
        private _position : Vector2;
        private _rotation : number;
        private _scale : Vector2;
        private _size : Vector2;

        //Linked list of children
        private _firstChild : Transform;
        private _lastChild : Transform;

        //Linked list of siblings
        private _prevSibling : Transform;
        private _nextSibling : Transform;

        public get parent() {
            return this._parent;
        }

        protected onInit() : void {
            engine.entities.root.addChild(this);
        }

        public set parent(p:Transform) {
            if (this._parent == null)
                engine.entities.root.removeChild(this);
            else
                this._parent.removeChild(this);

            this._parent = p;

            if (this._parent == null)
                engine.entities.root.addChild(this);
            else
                this._parent.addChild(this);
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

        static initStatic() {
            Transform.tmpMatsIndex = 0;
            Transform.tmpMats = new Array<Matrix3>(Transform.MAX_NESTING);
            for (let i = 0; i < Transform.MAX_NESTING; i++)
                Transform.tmpMats[i] = Matrix3.create();
        }

        static tmpMatsIndex : number;
        static tmpMats : Array<Matrix3>;

        public getLocalToGlobalMatrix(out:Matrix3) : Matrix3 {
            this.getLocalMatrix(out);
            if (this._parent != null) {
                var tmp = Transform.tmpMats[Transform.tmpMatsIndex++];
                this._parent.getLocalToGlobalMatrix(tmp);
                Matrix3.mul(out, tmp, out);
                Transform.tmpMatsIndex--;
            }
            return out;
        }

        public getGlobalToLocalMatrix(out:Matrix3) : Matrix3 {
            this.getLocalToGlobalMatrix(out);
            Matrix3.invert(out, out);
            return out;
        }

        private addChild(p:Transform) {
            if (this._firstChild == null) {
                this._firstChild = this._lastChild = p;
            } else {
                this._lastChild._nextSibling = p;
                p._prevSibling = this._lastChild;
                this._lastChild = p;
            }
        }

        private removeChild(p:Transform) {
            if (p._nextSibling != null)
                p._nextSibling._prevSibling = p._prevSibling;

            if (p._prevSibling != null)
                p._prevSibling._nextSibling = p._nextSibling;

            if (p == this._firstChild)
                this._firstChild = p._nextSibling;

            if (p == this._lastChild)
                this._lastChild = p._prevSibling;

            p._nextSibling = null;
            p._prevSibling = null;
        }

        public getFirstChild() : Transform {
            return this._firstChild;
        }

        public getNextChild(prevChild : Transform) {
            return prevChild._nextSibling;
        }

        public getComponentInChildren<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : Array<T> {

            if (toReturn == null)
                toReturn = new Array<T>();
            else
                toReturn.length = 0;

            this.getComponentInChildrenInternal(clazz, toReturn);

            return toReturn;
        }

        private getComponentInChildrenInternal<T extends Component>(clazz : {new() : T}, toReturn:Array<T>) : void {

            var comp =  this.getComponent(clazz);
            if (comp != null)
                toReturn.push(comp);

            var child = this._firstChild;

            while(child != null) {
                child.getComponentInChildrenInternal(clazz, toReturn);
                child = child._nextSibling;
            }
        }        
    }
}