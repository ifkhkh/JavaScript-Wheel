/**
 * judge type of js object
 * @param {Object} o
 * @returns {string} for:Funtion, Array, Object, String, Number, RegExp...
 */
const isTypeOf = (o) => {
    let key = Object.prototype.toString.call(o)
    let r = key.split(' ')[1].split(']')[0]
    return r
}

// compare with result of isTypeOf func
class JSType {
    static function() {
        return 'Function'
    }
    static array() {
        return 'Array'
    }
    static string() {
        return 'String'
    }
    static regexp() {
        return 'Regexp'
    }
    static number() {
        return 'Number'
    }
}
