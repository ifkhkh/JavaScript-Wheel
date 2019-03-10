//String ReplaceAll
// Regular Expression Based Implementation
String.prototype.replaceAll = function(search, replacement) {
    let target = this
    return target.replace(new RegExp(search, 'g'), replacement)
}

//Split and Join (Functional) Implementation
String.prototype.replaceAll = function(search, replacement) {
    var target = this
    return target.split(search).join(replacement)
}
