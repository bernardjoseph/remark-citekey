import test from 'tape'
import {unified} from 'unified'
import {remark} from 'remark'
import remarkCitekey from './index.js'

test('remark-citekey', (t) => {
  t.doesNotThrow(() => {
    remark().use(remarkCitekey).freeze()
  }, 'should not throw if not passed options')

  t.doesNotThrow(() => {
    unified().use(remarkCitekey).freeze()
  }, 'should not throw if without parser or compiler')

  let proc = remark().use(remarkCitekey).freeze()

  t.deepEqual(
    proc.parse('@a.müller. @{a.müller.}'),
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'citekey',
              children: [
                {
                  type: 'citekeyMarker',
                  value: '@',
                  position: {
                    start: {line: 1, column: 1, offset: 0},
                    end: {line: 1, column: 2, offset: 1}
                  }
                },
                {
                  type: 'citekeyId',
                  value: 'a.müller',
                  position: {
                    start: {line: 1, column: 2, offset: 1},
                    end: {line: 1, column: 10, offset: 9}
                  }
                }
              ],
              position: {
                start: {line: 1, column: 1, offset: 0},
                end: {line: 1, column: 10, offset: 9}
              }
            },
            {
              type: 'text',
              value: '. ',
              position: {
                start: {line: 1, column: 10, offset: 9},
                end: {line: 1, column: 12, offset: 11}
              }
            },
            {
              type: 'citekey',
              children: [
                {
                  type: 'citekeyMarker',
                  value: '@',
                  position: {
                    start: {line: 1, column: 12, offset: 11},
                    end: {line: 1, column: 13, offset: 12}
                  }
                },
                {
                  type: 'citekeyStart',
                  value: '{',
                  position: {
                    start: {line: 1, column: 13, offset: 12},
                    end: {line: 1, column: 14, offset: 13}
                  }
                },
                {
                  type: 'citekeyId',
                  value: 'a.müller.',
                  position: {
                    start: {line: 1, column: 14, offset: 13},
                    end: {line: 1, column: 23, offset: 22}
                  }
                },
                {
                  type: 'citekeyEnd',
                  value: '}',
                  position: {
                    start: {line: 1, column: 23, offset: 22},
                    end: {line: 1, column: 24, offset: 23}
                  }
                }
              ],
              position: {
                start: {line: 1, column: 12, offset: 11},
                end: {line: 1, column: 24, offset: 23}
              }
            }
          ],
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 24, offset: 23}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 24, offset: 23}
      }
    },
    'should parse Unicode citation keys'
  )

  t.equal(
    String(proc.processSync('@a.müller. @{a.müller.}')),
    '@a.müller. @{a.müller.}\n',
    'should process Unicode citation keys'
  )

  proc = remark().use(remarkCitekey, {strict: true}).freeze()

  t.deepEqual(
    proc.parse('@a.müller. @{a.müller.}'),
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'citekey',
              children: [
                {
                  type: 'citekeyMarker',
                  value: '@',
                  position: {
                    start: {line: 1, column: 1, offset: 0},
                    end: {line: 1, column: 2, offset: 1}
                  }
                },
                {
                  type: 'citekeyId',
                  value: 'a.m',
                  position: {
                    start: {line: 1, column: 2, offset: 1},
                    end: {line: 1, column: 5, offset: 4}
                  }
                }
              ],
              position: {
                start: {line: 1, column: 1, offset: 0},
                end: {line: 1, column: 5, offset: 4}
              }
            },
            {
              type: 'text',
              value: 'üller. @{a.müller.}',
              position: {
                start: {line: 1, column: 5, offset: 4},
                end: {line: 1, column: 24, offset: 23}
              }
            }
          ],
          position: {
            start: {line: 1, column: 1, offset: 0},
            end: {line: 1, column: 24, offset: 23}
          }
        }
      ],
      position: {
        start: {line: 1, column: 1, offset: 0},
        end: {line: 1, column: 24, offset: 23}
      }
    },
    'should parse ASCII citation keys'
  )

  t.equal(
    String(proc.processSync('@a.müller. @{a.müller.}')),
    '@a.müller. @{a.müller.}\n',
    'should process ASCII citation keys'
  )

  t.end()
})
