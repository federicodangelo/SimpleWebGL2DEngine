/// <reference path="Component.ts" />

module Simple2DEngine {

    export class Transform extends Component {

        private static MAX_NESTING: number = 128;

        private _parent: Transform = null;
        private _position: Vector2 = Vector2.create();
        private _rotation: number = 0;
        private _scale: Vector2 = Vector2.fromValues(1, 1);
        private _size: Vector2 = Vector2.fromValues(32, 32);

        //Linked list of children
        private _firstChild: Transform = null;
        private _lastChild: Transform = null;

        //Linked list of siblings
        private _prevSibling: Transform = null;
        private _nextSibling: Transform = null;

        private _localMatrix : Matrix3 = Matrix3.create();
        private _localMatrixDirty = true;

        public get parent() {
            return this._parent;
        }

        protected onInit(): void {
            engine.entities.root.addChild(this);
        }

        public set parent(p: Transform) {
            if (this._parent === null)
                engine.entities.root.removeChild(this);
            else
                this._parent.removeChild(this);

            this._parent = p;

            if (this._parent === null)
                engine.entities.root.addChild(this);
            else
                this._parent.addChild(this);
        }

        public get localPosition() {
            return this._position;
        }

        public set localPosition(p: Vector2) {
            Vector2.copy(this._position, p);
            this._localMatrixDirty = true;
        }

        public get localX() {
            return this._position[0];
        }

        public set localX(v: number) {
            this._position[0] = v;
            this._localMatrixDirty = true;
        }

        public get localY() {
            return this._position[1];
        }

        public set localY(v: number) {
            this._position[1] = v;
            this._localMatrixDirty = true;
        }

        public get localRotationRadians() {
            return this._rotation;
        }

        public set localRotationRadians(rad: number) {
            this._rotation = rad;
            this._localMatrixDirty = true;
        }

        public get localRotationDegrees() {
            return this._rotation * SMath.rad2deg;
        }

        public set localRotationDegrees(deg: number) {
            this._rotation = deg * SMath.deg2rad;
            this._localMatrixDirty = true;
        }

        public get localScale() {
            return this._scale;
        }

        public set localScale(s: Vector2) {
            Vector2.copy(this._scale, s);
            this._localMatrixDirty = true;
        }

        public get localScaleX() {
            return this._scale[0];
        }

        public set localScaleX(v: number) {
            this._scale[0] = v;
            this._localMatrixDirty = true;
        }

        public get localScaleY() {
            return this._scale[1];
        }

        public set localScaleY(v: number) {
            this._scale[1] = v;
            this._localMatrixDirty = true;
        }

        public get size() {
            return this._size;
        }

        public set size(s: Vector2) {
            Vector2.copy(this._size, s);
            this._localMatrixDirty = true;
        }

        public get sizeX() {
            return this._size[0];
        }

        public set sizeX(v: number) {
            this._size[0] = v;
            this._localMatrixDirty = true;
        }

        public get sizeY() {
            return this._size[1];
        }

        public set sizeY(v: number) {
            this._size[1] = v;
            this._localMatrixDirty = true;
        }

        private getLocalMatrix(): Matrix3 {

            var localMatrix = this._localMatrix;

            if (this._localMatrixDirty) {
                Matrix3.fromTranslation(localMatrix, this._position);
                Matrix3.scale(localMatrix,localMatrix, this._scale);
                Matrix3.rotate(localMatrix, localMatrix, this._rotation);
                this._localMatrixDirty = false;
            }

            return localMatrix;
        }

        public getLocalToGlobalMatrix(out: Matrix3): Matrix3 {
            var localMatrix = this.getLocalMatrix();

            if (this._parent !== null) {
                this._parent.getLocalToGlobalMatrix(out);
                Matrix3.mul(out, out, localMatrix);
            } else {
                Matrix3.copy(out, localMatrix);
            }
            return out;
        }

        public getGlobalToLocalMatrix(out: Matrix3): Matrix3 {
            this.getLocalToGlobalMatrix(out);
            Matrix3.invert(out, out);
            return out;
        }

        private addChild(p: Transform) {
            if (this._firstChild === null) {
                this._firstChild = this._lastChild = p;
            } else {
                this._lastChild._nextSibling = p;
                p._prevSibling = this._lastChild;
                this._lastChild = p;
            }
        }

        private removeChild(p: Transform) {
            if (p._nextSibling !== null)
                p._nextSibling._prevSibling = p._prevSibling;

            if (p._prevSibling !== null)
                p._prevSibling._nextSibling = p._nextSibling;

            if (p === this._firstChild)
                this._firstChild = p._nextSibling;

            if (p === this._lastChild)
                this._lastChild = p._prevSibling;

            p._nextSibling = null;
            p._prevSibling = null;
        }

        public getFirstChild(): Transform {
            return this._firstChild;
        }

        public getNextChild(prevChild: Transform) {
            return prevChild._nextSibling;
        }

        public getComponentInChildren<T extends Component>(clazz: { new (): T }, toReturn: Array<T>): number {
            return this.getComponentInChildrenInternal(clazz, toReturn, 0);
        }

        private getComponentInChildrenInternal<T extends Component>(clazz: { new (): T }, toReturn: Array<T>, index : number): number {

            var comp = this.getComponent(clazz);
            if (comp !== null)
                toReturn[index++] = comp;

            var child = this._firstChild;

            while (child !== null) {
                index = child.getComponentInChildrenInternal(clazz, toReturn, index);
                child = child._nextSibling;
            }

            return index;
        }
    }
}