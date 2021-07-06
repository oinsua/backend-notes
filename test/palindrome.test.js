const { palindrome } = require('../testFunction')

test('palindrome of packages', () => {
  const result = palindrome('packages')
  expect(result).toBe('segakcap')
})

test('palindrome of empty string', () => {
  const result = palindrome('')
  expect(result).toBe('')
})
test('palindrome of undefined', () => {
  const result = palindrome()
  expect(result).toBe(false)
})
