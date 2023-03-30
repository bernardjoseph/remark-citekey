/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('micromark-extension-citekey').Options} Options
 */

import {citekey} from '@bernardjoseph/micromark-extension-citekey'
import {citekeyToMarkdown, citekeyFromMarkdown} from '@bernardjoseph/mdast-util-citekey'

/**
 * Plugin to support Pandoc-style citation keys ().
 *
 * @type {import('unified').Plugin<[Options?], Root>}
 */
export default function remarkCitekey(options = {strict: false}) {
  const data = this.data()

  add('micromarkExtensions', citekey(options))
  add('fromMarkdownExtensions', citekeyFromMarkdown)
  add('toMarkdownExtensions', citekeyToMarkdown)

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list = /** @type {unknown[]} */ (
      // Other extensions
      /* c8 ignore next 2 */
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}
