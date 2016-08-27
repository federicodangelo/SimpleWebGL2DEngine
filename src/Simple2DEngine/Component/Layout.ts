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

        //private _xAnchorMode : LayoutAnchorMode = LayoutAnchorMode.None;
        //private _yAnchorMode : LayoutAnchorMode = LayoutAnchorMode.None;

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

        public get sizeOffset(): Vector2 {
            return this._sizeOffset;
        }

        public set sizeOffset(value: Vector2) {
            Vector2.copy(this._sizeOffset, value);
        }

        public updateLayout() {

            if (this._widthSizeMode === LayoutSizeMode.MatchDrawerBest ||
                this._heightSizeMode === LayoutSizeMode.MatchDrawerBest) {

                let drawer = this.entity.firstDrawer;

                if (drawer !== null) {
                    //DON'T MUTATE THIS VECTOR!!
                    let bestSize = drawer.getBestSize();

                    if (this._widthSizeMode === LayoutSizeMode.MatchDrawerBest)
                        this.entity.transform.sizeX = bestSize[0] + this._sizeOffset[0];

                    if (this._heightSizeMode === LayoutSizeMode.MatchDrawerBest)
                        this.entity.transform.sizeY = bestSize[1] + this._sizeOffset[1];
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
                            this.entity.transform.sizeX = bestSize[0] + this._sizeOffset[0];

                        if (this._heightSizeMode === LayoutSizeMode.MatchChildrenBest)
                            this.entity.transform.sizeY = bestSize[1] + this._sizeOffset[1];

                    } else {
                        EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchChildrenBest' but children with drawer is missing", this);
                    }
                } else {
                    EngineConsole.error("Layout.updateLayout(): Size mode is 'MatchChildrenBest' but not children found", this);
                }
            }        
        }
    }
}