/// <reference path="Component.ts" />

module s2d {

    export class Transform extends Component {

        private _parent: Transform = null;
        private _position: Vector2 = Vector2.create();
        private _rotation: number = 0;
        private _scale: Vector2 = Vector2.fromValues(1, 1);
        private _size: Vector2 = Vector2.fromValues(0, 0);
        private _pivot: Vector2 = Vector2.create();

        //Linked list of children
        private _firstChild: Transform = null;
        private _lastChild: Transform = null;

        //Linked list of siblings
        private _prevSibling: Transform = null;
        private _nextSibling: Transform = null;

        private _localMatrixDirty: boolean = true;
        private _localMatrix: Matrix2d = Matrix2d.create();

        public get parent() {
            return this._parent;
        }

        protected onInit(): void {
            engine.entities.root.addChildLast(this);
            this.updateLocalMatrix();
        }

        protected onDestroy(): void {
            //Destroy child entities
            var child = this._firstChild;
            while (child !== null) {
                var tmp = child.entity;
                child = child._nextSibling;
                tmp.destroy();
            }

            if (this._parent === null)
                engine.entities.root.removeChild(this);
            else
                this._parent.removeChild(this);

            this._parent = null;
        }

        public set parent(p: Transform) {
            if (this._parent === null)
                engine.entities.root.removeChild(this);
            else
                this._parent.removeChild(this);

            this._parent = p;

            if (this._parent === null)
                engine.entities.root.addChildLast(this);
            else
                this._parent.addChildLast(this);
        }

        public setParent(p: Transform) {
            this.parent = p;
            return this;
        }

        public get localPosition() {
            return this._position;
        }

        public set localPosition(p: Vector2) {
            Vector2.copy(this._position, p);
            this.updateLocalMatrix();        
        }

        public get localX() {
            return this._position[0];
        }

        public set localX(v: number) {
            this._position[0] = v;
            this.updateLocalMatrix();        
        }

        public get localY() {
            return this._position[1];
        }

        public set localY(v: number) {
            this._position[1] = v;
            this.updateLocalMatrix();
        }

        public setLocalPosition(x: number, y: number) {
            this._position[0] = x;
            this._position[1] = y;
            this.updateLocalMatrix();
            return this;
        }

        public get localRotationRadians() {
            return this._rotation;
        }

        public set localRotationRadians(rad: number) {
            this._rotation = rad;
            this.updateLocalMatrix();
        }

        public get localRotationDegrees() {
            return this._rotation * SMath.rad2deg;
        }

        public set localRotationDegrees(deg: number) {
            this.localRotationRadians = deg * SMath.deg2rad;
        }

        public setLocalRotationRadians(rad: number) {
            this.localRotationRadians = rad;
            return this;
        }

        public setlocalRotationDegrees(deg: number) {
            this.localRotationDegrees = deg;
            return this;
        }

        public get localScale() {
            return this._scale;
        }

        public set localScale(ss: Vector2) {
            Vector2.copy(this._scale, ss);
            this.updateLocalMatrix();
        }

        public get localScaleX() {
            return this._scale[0];
        }

        public set localScaleX(v: number) {
            this._scale[0] = v;
            this.updateLocalMatrix();
        }

        public get localScaleY() {
            return this._scale[1];
        }

        public set localScaleY(v: number) {
            this._scale[1] = v;
            this.updateLocalMatrix();
        }

        public setLocalScale(x: number, y: number) {
            this._scale[0] = x;
            this._scale[1] = y;
            this.updateLocalMatrix();
            return this;
        }

        public get size() {
            return this._size;
        }

        public set size(s: Vector2) {
            Vector2.copy(this._size, s);
            this.updateLocalMatrix();
        }

        public get sizeX() {
            return this._size[0];
        }

        public set sizeX(v: number) {
            this._size[0] = v;
            this.updateLocalMatrix();
        }

        public get sizeY() {
            return this._size[1];
        }

        public set sizeY(v: number) {
            this._size[1] = v;
            this.updateLocalMatrix();
        }

        public setSize(x: number, y: number) {
            this._size[0] = x;
            this._size[1] = y;
            this.updateLocalMatrix();
            return this;
        }

        public get pivot() {
            return this._pivot;
        }

        public set pivot(p: Vector2) {
            this._pivot[0] = SMath.clamp(p[0], -1, 1);
            this._pivot[1] = SMath.clamp(p[1], -1, 1);
            this.updateLocalMatrix();
        }

        public get pivotX() {
            return this._pivot[0];
        }

        public set pivotX(v: number) {
            this._pivot[0] = SMath.clamp(v, -1, 1);
            this.updateLocalMatrix();
        }

        public get pivotY() {
            return this._pivot[1];
        }

        public set pivotY(v: number) {
            this._pivot[1] = SMath.clamp(v, -1, 1);
            this.updateLocalMatrix();
        }

        public setPivot(x: number, y: number) {
            this.pivot[0] = SMath.clamp(x, -1, 1);
            this.pivot[1] = SMath.clamp(y, -1, 1);
            this.updateLocalMatrix();
            return this;
        }

        private updateLocalMatrix() : void {
            this._localMatrixDirty = true;
        }

        private static tmpV1: Vector2;
        private static tmpV2: Vector2;
        private static tmpV3: Vector2;
        private static tmpV4: Vector2;
        private static tmpMatrix: Matrix2d;
        private static tmpSizeAndPivtot: Vector2;

        public static initStatic() {
            Transform.tmpV1 = Vector2.create();
            Transform.tmpV2 = Vector2.create();
            Transform.tmpV3 = Vector2.create();
            Transform.tmpV4 = Vector2.create();
            Transform.tmpMatrix = Matrix2d.create();
            Transform.tmpSizeAndPivtot = Vector2.create();
        }

        public getBounds(out: Rect): Rect {
            var tmpV1 = Transform.tmpV1;
            var tmpV2 = Transform.tmpV2;
            var tmpV3 = Transform.tmpV3;
            var tmpV4 = Transform.tmpV4;
            var tmpMatrix = Transform.tmpMatrix;

            this.getLocalToGlobalMatrix(tmpMatrix);

            //Top left
            tmpV1[0] = 0;
            tmpV1[1] = 0;

            //Top right
            tmpV2[0] = this._size[0];
            tmpV2[1] = 0;

            //Bottom right
            tmpV3[0] = this._size[0];
            tmpV3[1] = this._size[1];

            //Bottom left
            tmpV4[0] = 0;
            tmpV4[1] = this._size[1];

            Vector2.transformMat2d(tmpV1, tmpV1, tmpMatrix);
            Vector2.transformMat2d(tmpV2, tmpV2, tmpMatrix);
            Vector2.transformMat2d(tmpV3, tmpV3, tmpMatrix);
            Vector2.transformMat2d(tmpV4, tmpV4, tmpMatrix);

            var minX = Math.min(tmpV1[0], tmpV2[0], tmpV3[0], tmpV4[0]);
            var minY = Math.min(tmpV1[1], tmpV2[1], tmpV3[1], tmpV4[1]);

            var maxX = Math.max(tmpV1[0], tmpV2[0], tmpV3[0], tmpV4[0]);
            var maxY = Math.max(tmpV1[1], tmpV2[1], tmpV3[1], tmpV4[1]);

            Rect.set(out, minX, minY, maxX - minX, maxY - minY);

            return out;
        }

        private getLocalMatrix(): Matrix2d {
            let localMatrix = this._localMatrix;

            if (this._localMatrixDirty) {

                let localMatrix = this._localMatrix;
                let size = this._size;
                let pivot = this._pivot;
                let sizeAndPivot = Transform.tmpSizeAndPivtot;

                sizeAndPivot[0] = -size[0] * 0.5 * (pivot[0] + 1);
                sizeAndPivot[1] = -size[1] * 0.5 * (pivot[1] + 1);

                Matrix2d.fromTranslation(localMatrix, this._position);
                Matrix2d.scale(localMatrix, localMatrix, this._scale);
                Matrix2d.rotate(localMatrix, localMatrix, this._rotation);
                Matrix2d.translate(localMatrix, localMatrix, sizeAndPivot);

                this._localMatrixDirty = false;
            }

            return localMatrix;
        }

        public getLocalToGlobalMatrix(out: Matrix2d): Matrix2d {

            Matrix2d.copy(out, this.getLocalMatrix());
            let p = this._parent;
            while (p !== null) {
                Matrix2d.mul(out, p.getLocalMatrix(), out);
                p = p._parent;
            }

            return out;
        }

        public getGlobalToLocalMatrix(out: Matrix2d): Matrix2d {
            this.getLocalToGlobalMatrix(out);
            Matrix2d.invert(out, out);
            return out;
        }

        private addChildLast(p: Transform) {
            if (this._firstChild === null) {
                this._firstChild = this._lastChild = p;
            } else {
                this._lastChild._nextSibling = p;
                p._prevSibling = this._lastChild;
                this._lastChild = p;
            }
        }

        private addChildFirst(p: Transform) {
            p._nextSibling = this._firstChild;
            if (this._firstChild !== null)
                this._firstChild._prevSibling = p;
            this._firstChild = p;
            if (this._lastChild === null)
                this._lastChild = p;
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

        public getComponentsInChildren<T extends Component>(clazz: { new (): T }, toReturn: Array<T>, includeInactive: boolean = false): number {

            if (clazz === <any>Behavior)
                return this.getBehaviorsInChildrenInternal(<any>toReturn, 0, includeInactive);
            else if (clazz === <any>Drawer)
                return this.getDrawersInChildrenInternal(<any>toReturn, 0, includeInactive);
            else if (clazz === <any>Layout)
                return this.getLayoutsInChildrenInternal(<any>toReturn, 0, includeInactive);

            return this.getComponentsInChildrenInternal(clazz, toReturn, 0, includeInactive);
        }

        private getComponentsInChildrenInternal<T extends Component>(clazz: { new (): T }, toReturn: Array<T>, index: number, includeInactive: boolean): number {

            let entity = this.entity;

            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;

                let comp = entity.getComponent(clazz);
                if (comp !== null)
                    toReturn[index++] = comp;
            }

            let child = this._firstChild;

            while (child !== null) {
                index = child.getComponentsInChildrenInternal(clazz, toReturn, index, includeInactive);
                child = child._nextSibling;
            }

            return index;
        }

        private getBehaviorsInChildrenInternal(toReturn: Array<Behavior>, index: number, includeInactive: boolean): number {

            let entity = this.entity;

            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;

                if (this.entity.firstBehavior !== null)
                    toReturn[index++] = this.entity.firstBehavior;
            }

            let child = this._firstChild;

            while (child !== null) {
                index = child.getBehaviorsInChildrenInternal(toReturn, index, includeInactive);
                child = child._nextSibling;
            }

            return index;
        }

        private getDrawersInChildrenInternal(toReturn: Array<Drawer>, index: number, includeInactive: boolean): number {

            let entity = this.entity;

            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;

                if (entity.firstDrawer !== null)
                    toReturn[index++] = entity.firstDrawer;
            }

            let child = this._firstChild;

            while (child !== null) {
                index = child.getDrawersInChildrenInternal(toReturn, index, includeInactive);
                child = child._nextSibling;
            }

            return index;
        }

        private getLayoutsInChildrenInternal(toReturn: Array<Layout>, index: number, includeInactive: boolean): number {

            let entity = this.entity;

            if (entity !== null) {
                if (!entity.active && !includeInactive)
                    return index;

                if (entity.firstLayout !== null)
                    toReturn[index++] = entity.firstLayout;
            }

            let child = this._firstChild;

            while (child !== null) {
                index = child.getLayoutsInChildrenInternal(toReturn, index, includeInactive);
                child = child._nextSibling;
            }

            return index;
        }

        /**
         * Makes the transform the first child in the parent container
         */
        public moveToTop() {
            if (this._prevSibling !== null) {
                //We remove ourselve from our parent and then we add ourselves again
                //at the beginning
                let p = (this._parent === null) ? engine.entities.root : this._parent;

                p.removeChild(this);
                p.addChildFirst(this);
            }
        }

        /**
         * Makes the transform the last child in the parent container
         */
        public moveToBottom() {
            if (this._nextSibling !== null) {
                //We remove ourselve from our parent and then we add ourselves again,
                //which leaves us at the bottom.. 
                let p = (this._parent === null) ? engine.entities.root : this._parent;

                p.removeChild(this);
                p.addChildLast(this);
            }
        }
    }
}