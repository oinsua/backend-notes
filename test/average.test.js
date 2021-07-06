const { average } = require('../testFunction')

describe('average', () => {
  test('of one value is the value ifself', () => {
    expect(average([1])).toBe(1)
  })

  test('of many is calculate correctly', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5)
  })

  test('of empty array is zero', () => {
    expect(average([])).toBe(0)
  })

  test('of empty array is zero', () => {
    expect(average()).toBeUndefined()
  })
})
