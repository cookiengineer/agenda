
export const IsArray    = (obj) => Object.prototype.toString.call(obj) === "[object Array]";
export const IsBoolean  = (obj) => Object.prototype.toString.call(obj) === "[object Boolean]";
export const IsFunction = (obj) => Object.prototype.toString.call(obj) === "[object Function]";
export const IsNumber   = (obj) => Object.prototype.toString.call(obj) === "[object Number]";
export const IsObject   = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
export const IsString   = (obj) => Object.prototype.toString.call(obj) === "[object String]";
