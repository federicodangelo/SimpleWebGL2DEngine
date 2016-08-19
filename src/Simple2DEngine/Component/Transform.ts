/// <reference path="Component.ts" />

module s2d {

    export class Transform extends Component {

        private static MAX_NESTING: number = 128;

        private _parent: Transform = null;
        private _position: Vector2 = Vector2.create();
        private _rotation: number = 0;
        private _scale: Vector2 = Vector2.fromValues(1, 1);
        private _halfSize: Vector2 = Vector2.fromValues(16, 16);

        //Linked list of children
        private _firstChild: Transform = null;
        private _lastChild: Transform = null;

        //Linked list of siblings
        private _prevSibling: Transform = null;
        private _nextSibling: Transform = null;

        private _localMatrix : Matrix2d = Matrix2d.create();
        //private _localMatrixDirty : boolean = true;

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
            //this._localMatrixDirty = true;

            this._localMatrix[4] = this._position[0];
            this._localMatrix[5] = this._position[1];
        }

        public get localX() {
            return this._position[0];
        }

        public set localX(v: number) {
            this._position[0] = v;
            //this._localMatrixDirty = true;

            this._localMatrix[4] = this._position[0];
        }

        public get localY() {
            return this._position[1];
        }

        public set localY(v: number) {
            this._position[1] = v;
            //this._localMatrixDirty = true;

            this._localMatrix[5] = this._position[1];
        }

        public get localRotationRadians() {
            return this._rotation;
        }

        public set localRotationRadians(rad: number) {
            this._rotation = rad;
            //this._localMatrixDirty = true;

            var ss = this._scale;
            var s = Math.sin(rad);
            var c = Math.cos(rad);

            this._localMatrix[0] = ss[0] * c;
            this._localMatrix[1] = ss[1] * s;
            this._localMatrix[2] = ss[0] * -s;
            this._localMatrix[3] = ss[1] * c;
        }

        public get localRotationDegrees() {
            return this._rotation * SMath.rad2deg;
        }

        public set localRotationDegrees(deg: number) {
            this.localRotationRadians = deg * SMath.deg2rad;
        }

        public get localScale() {
            return this._scale;
        }

        public set localScale(ss: Vector2) {
            Vector2.copy(this._scale, ss);
            //this._localMatrixDirty = true;

            var s = Math.sin(this._rotation);
            var c = Math.cos(this._rotation);

            this._localMatrix[0] = ss[0] * c;
            this._localMatrix[1] = ss[1] * s;
            this._localMatrix[2] = ss[0] * -s;
            this._localMatrix[3] = ss[1] * c;
        }

        public get localScaleX() {
            return this._scale[0];
        }

        public set localScaleX(v: number) {
            this._scale[0] = v;
            //this._localMatrixDirty = true;

            var ss = this._scale;
            var s = Math.sin(this._rotation);
            var c = Math.cos(this._rotation);

            this._localMatrix[0] = ss[0] * c;
            this._localMatrix[2] = ss[0] * -s;
        }

        public get localScaleY() {
            return this._scale[1];
        }

        public set localScaleY(v: number) {
            this._scale[1] = v;
            //this._localMatrixDirty = true;

            var ss = this._scale;
            var s = Math.sin(this._rotation);
            var c = Math.cos(this._rotation);

            this._localMatrix[1] = ss[1] * s;
            this._localMatrix[3] = ss[1] * c;
        }

        public get halfSize() {
            return this._halfSize;
        }

        public set halfSize(s: Vector2) {
            Vector2.copy(this._halfSize, s);
        }

        public get halfSizeX() {
            return this._halfSize[0];
        }

        public set halfSizeX(v: number) {
            this._halfSize[0] = v;
        }

        public get halfSizeY() {
            return this._halfSize[1];
        }

        public set halfSizeY(v: number) {
            this._halfSize[1] = v;
        }

        /*
        private getLocalMatrix(): Matrix2d {
            var localMatrix = this._localMatrix;

            if (this._localMatrixDirty) {

                //Matrix2d.fromTranslation(localMatrix, this._position);
                //Matrix2d.scale(localMatrix,localMatrix, this._scale);
                //Matrix2d.rotate(localMatrix, localMatrix, this._rotation);

                var pp = this._position;
                var ss = this._scale;

                var s = Math.sin(this._rotation);
                var c = Math.cos(this._rotation);

                localMatrix[0] = ss[0] * c;
                localMatrix[1] = ss[1] * s;
                localMatrix[2] = ss[0] * -s;
                localMatrix[3] = ss[1] * c;
                localMatrix[4] = pp[0];
                localMatrix[5] = pp[1];

                this._localMatrixDirty = false;
            }

            return localMatrix;
        }
        */

        public getLocalToGlobalMatrix(out: Matrix2d): Matrix2d {
            if (this._parent !== null) {
                this._parent.getLocalToGlobalMatrix(out);
                Matrix2d.mul(out, out, this._localMatrix);
            } else {
                Matrix2d.copy(out, this._localMatrix);
            }
            return out;
        }

        public getGlobalToLocalMatrix(out: Matrix2d): Matrix2d {
            this.getLocalToGlobalMatrix(out);
            Matrix2d.invert(out, out);
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