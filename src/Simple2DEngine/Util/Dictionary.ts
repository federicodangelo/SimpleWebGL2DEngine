module s2d {
    export class StringDictionary<V> {

        private _data:any = {};

        public get data() {
            return this._data;
        }

        public add(key:string, value:V) {
            this._data[key] = value;
        }

        public remove(key:string) {
            delete this._data[key];
        }

        public has(key:string) {
            return this._data[key] === undefined;
        }

        public get(key:string) {
            var v:V = this._data[key];
            if (v === undefined)
                v = null;
            return v;
        }
    }
}