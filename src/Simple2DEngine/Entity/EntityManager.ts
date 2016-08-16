module Simple2DEngine {
    
    export class EntityManager {

        private _entities : Array<Entity> = new Array<Entity>();

        public get entities() {
            return this._entities;
        }

        constructor() {
        }

        public addEntity() : Entity {
            var entity = new Entity(); 
            this._entities.push(entity);
            return entity;
        }
    }
}