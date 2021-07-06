const palindrome = (string) => {
  if (typeof string !== 'undefined') { return string.split('').reverse().join('') }
  return false
}

const average = (array) => {
  if (array === undefined) return
  if (array.length > 0) {
    let sum = 0
    array.forEach(num => { sum += num })
    return sum / array.length
  } else { return 0 }
}

module.exports = { palindrome, average }
