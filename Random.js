var randomNum = (lowerValue, upperValue) => {
    var choices = upperValue - lowerValue + 1
    var result = Math.floor(Math.random() * choices + lowerValue)
    return result
}
