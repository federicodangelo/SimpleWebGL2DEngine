module s2d {
    export class EngineConsole {
        public static error(message:string, target:any = null) {

            let prefix = "";

            if (target instanceof Component) {
                let componentClassName = EngineConsole.getClassName(target);
                prefix = target.entity.name + "->" + componentClassName + ": ";
            } else if (target instanceof Entity) {
                prefix = target.name + ": ";
            }

            console.error(prefix + message);
        } 

        private static getClassName(instance:any) {
            var funcNameRegex = /function (.{1,})\(/;
            var results  = (funcNameRegex).exec(instance["constructor"].toString());
            return (results && results.length > 1) ? results[1] : "";
        }
    }
}