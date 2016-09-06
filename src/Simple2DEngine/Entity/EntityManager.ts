/// <reference path="Entity.ts" />

module s2d {

    export class EntityManager {

        private _root: Transform = new Transform();
        
        private _entitiesToDestroy: Array<Entity> = null;
        private _entitiesToDestroy1: Array<Entity> = new Array<Entity>();
        private _entitiesToDestroy2: Array<Entity> = new Array<Entity>();
        private _insideDestroy: boolean = false;

        public get root() {
            return this._root;
        }

        constructor() {
            this._entitiesToDestroy = this._entitiesToDestroy1;
        }

        public init() {
            //this._root.pivotX = -1;
            //this._root.pivotY = -1;
            //this._root.sizeX = renderer.screenWidth;
            //this._root.sizeY = renderer.screenHeight;
        }

        public getComponentsInChildren<T extends Component>(clazz: { new (): T }, toReturn: Array<T>, includeInactive: boolean = false): number {
            return this._root.getComponentsInChildren(clazz, toReturn, includeInactive);
        }

        private tmpBehaviors: Array<Behavior> = new Array<Behavior>(1024);

        public update(): void {

            //this._root.sizeX = renderer.screenWidth;
            //this._root.sizeY = renderer.screenHeight;

            var behaviors: Array<Behavior> = this.tmpBehaviors;

            var behaviorsLen = this.getComponentsInChildren(Behavior, behaviors);

            for (var i = 0; i < behaviorsLen; i++) {
                var behavior = behaviors[i];
                behavior.update();
            }

            //Destroy all entities registered for destruction
            this.destroyEntities();
        }

        private destroyEntities() : void {
            if (this._entitiesToDestroy.length > 0) {

                this._insideDestroy = true;

                let tmp = this._entitiesToDestroy;

                //Swap array where new destroyed entities will be stored, just in case that
                //the destroy function registers new entities for destruction
                if (this._entitiesToDestroy === this._entitiesToDestroy1)
                    this._entitiesToDestroy = this._entitiesToDestroy2;
                else
                    this._entitiesToDestroy = this._entitiesToDestroy1;

                for (let i = 0; i < tmp.length; i++)
                    tmp[i].__internal_destroy();
                tmp.length = 0;

                this._insideDestroy = false;
            }
        }

        public destroyEntity(entity: Entity) {
            if (!entity.destroyed) {
                if (!this._insideDestroy) {
                    //Destruction is delayed
                    this._entitiesToDestroy.push(entity);
                } else {
                    //We are already in the destroy loop, no need to delay the destruction
                    entity.__internal_destroy();
                }
            }
        }
    }
}