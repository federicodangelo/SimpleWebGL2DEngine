module s2d {

    export enum LayoutSizeMode {
        None,
        MatchDrawerBest,
        MatchChildrenBest,
        //MatchParent
    }

    export enum LayoutAnchorMode {
        None,
        RelativeToParent
    }

    export class LayoutRectOffset {
        public top: number = 0;
        public left: number = 0;
        public bottom: number = 0;
        public right: number = 0;

        public set all(offset: number) {
            this.left = this.right = this.top = this.bottom = offset;
        }
    }

    export class Layout extends Component {

        private _widthSizeMode: LayoutSizeMode = LayoutSizeMode.None;
        private _heightSizeMode: LayoutSizeMode = LayoutSizeMode.None;
        private _sizeOffset: Vector2 = Vector2.create();

        private _xAnchorMode: LayoutAnchorMode = LayoutAnchorMode.None;
        private _yAnchorMode: LayoutAnchorMode = LayoutAnchorMode.None;
        private _anchorModePivot: Vector2 = Vector2.create();
        private _anchorModeOffset: Vector2 = Vector2.create();

        public get widthSizeMode(): LayoutSizeMode {
            return this._widthSizeMode;
        }

        public set widthSizeMode(value: LayoutSizeMode) {
            this._widthSizeMode = value;
        }

        public get heightSizeMode(): LayoutSizeMode {
            return this._heightSizeMode;
        }

        public set heightSizeMode(value: LayoutSizeMode) {
            this._heightSizeMode = value;
        }

        public set sizeMode(value: LayoutSizeMode) {
            this._heightSizeMode = this._widthSizeMode = value;
        }

        public setSizeMode(widthSizeMode: LayoutSizeMode, heightSizeMode: LayoutSizeMode) {
            this._widthSizeMode = widthSizeMode;
            this._heightSizeMode = heightSizeMode;
            return this;
        }

        public get sizeOffset(): Vector2 {
            return this._sizeOffset;
        }

        public set sizeOffset(value: Vector2) {
            Vector2.copy(this._sizeOffset, value);
        }

        public setSizeOffset(x: number, y: number) {
            this._sizeOffset[0] = x;
            this._sizeOffset[1] = y;
            return this;
        }

        public get xAnchorMode(): LayoutAnchorMode {
            return this._xAnchorMode;
        }

        public set xAnchorMode(value: LayoutAnchorMode) {
            this._xAnchorMode = value;
        }

        public get yAnchorMode(): LayoutAnchorMode {
            return this._yAnchorMode;
        }

        public set yAnchorMode(value: LayoutAnchorMode) {
            this._yAnchorMode = value;
        }

        public setAnchorMode(xMode: LayoutAnchorMode, yMode: LayoutAnchorMode) {
            this.xAnchorMode = xMode;
            this.yAnchorMode = yMode;
            return this;
        }

        public get anchorModePivot(): Vector2 {
            return this._anchorModePivot;
        }

        public set anchorModePivot(value: Vector2) {
            this._anchorModePivot[0] = SMath.clamp(value[0], -1, 1);
            this._anchorModePivot[1] = SMath.clamp(value[1], -1, 1);;
        }

        public setAnchorModePivot(x: number, y: number) {
            this._anchorModePivot[0] = SMath.clamp(x, -1, 1);
            this._anchorModePivot[1] = SMath.clamp(y, -1, 1);;
            return this;
        }

        public get anchorModeOffset(): Vector2 {
            return this._anchorModeOffset;
        }

        public set anchorModeOffset(value: Vector2) {
            Vector2.copy(this._anchorModeOffset, value);
        }

        public setAnchorModeOffset(x: number, y: number) {
            this._anchorModeOffset[0] = x;
            this._anchorModeOffset[1] = y;
            return this;
        }

        public updateLayout() {

            let transform = this.entity.transform;

            if (this._widthSizeMode === LayoutSizeMode.MatchDrawerBest ||
                this._heightSizeMode === LayoutSizeMode.MatchDrawerBest) {

                let drawer = this.entity.firstDrawer;

                if (drawer !== null) {
                    //DON'T MUTATE THIS VECTOR!!
                    let bestSize = drawer.getBestSize();

                    if (this._widthSizeMode === LayoutSizeMode.MatchDrawerBest)
                        transform.sizeX = bestSize[0] + this._sizeOffset[0];

                    if (this._heightSizeMode === LayoutSizeMode.MatchDrawerBest)
                        transform.sizeY = bestSize[1] + this._sizeOffset[1];
                } else {
                    EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchThisDrawerBest' but drawer is missing", this);
                }
            }

            if (this._widthSizeMode === LayoutSizeMode.MatchChildrenBest ||
                this._heightSizeMode === LayoutSizeMode.MatchChildrenBest) {

                let firstChild = this.entity.transform.getFirstChild();

                if (firstChild !== null) {
                    let firstChildDrawer = firstChild.entity.firstDrawer;

                    if (firstChildDrawer !== null) {

                        //DON'T MUTATE THIS VECTOR!!
                        let bestSize = firstChildDrawer.getBestSize();

                        if (this._widthSizeMode === LayoutSizeMode.MatchChildrenBest)
                            transform.sizeX = bestSize[0] + this._sizeOffset[0];

                        if (this._heightSizeMode === LayoutSizeMode.MatchChildrenBest)
                            transform.sizeY = bestSize[1] + this._sizeOffset[1];

                    } else {
                        EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchChildrenBest' but children with drawer is missing", this);
                    }
                } else {
                    EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchChildrenBest' but no children found", this);
                }
            }

            if (this._xAnchorMode === LayoutAnchorMode.RelativeToParent || this._yAnchorMode === LayoutAnchorMode.RelativeToParent) {
                let parent = transform.parent;

                if (parent !== null) {

                    let parentSize = parent.size;

                    if (this._xAnchorMode === LayoutAnchorMode.RelativeToParent)
                        transform.localX = parentSize[0] * 0.5 * (this._anchorModePivot[0] + 1) + this._anchorModeOffset[0];

                    if (this._yAnchorMode === LayoutAnchorMode.RelativeToParent)
                        transform.localY = parentSize[1] * 0.5 * (this._anchorModePivot[1] + 1) + this._anchorModeOffset[1];

                } else {
                    EngineConsole.error("Layout.updateLayout(): Anchor mode is 'RelativeToParent' but no parent found", this);
                }
            }
        }
    }
}