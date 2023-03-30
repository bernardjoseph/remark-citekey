# remark-citekey

[**remark**][remark] plugin to support [Pandoc][]-style citation keys
(`@doe99`, `@{smith04}`).

## Install

This package is [ESM
only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install remark-citekey
```

## Use

Say we have the following file, `example.md`:

```markdown
See @wadler1989 [sec. 1.3; and @{hughes1990.}, pp. 4].
```

And our module, `example.js`, looks as follows:

```js
import {readSync} from 'to-vfile'
import {reporter} from 'vfile-reporter'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkCitekey from 'remark-citekey'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import {visit} from 'unist-util-visit'

unified()
  .use(remarkParse)
  .use(remarkCitekey)
  .use(citekeyPlugin)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(readSync('example.md'))
  .then((file) => {
    console.error(reporter(file))
    console.log(String(file))
  })

function citekeyPlugin() {
  return (tree) => {
    visit(tree, (node, _, parent) => {
      if (node.type === 'citekey') {
        const data = node.data || (node.data = {})
        data.hName = 'span'
        data.hProperties = {className: 'citation'}
      }

      if (node.type === 'citekeyId' && parent.type === 'citekey') {
        const data = parent.data || (parent.data = {})
        if (data.hProperties && data.hProperties.className === 'citation')
          data.hProperties['data-cite'] = node.value
      }
    })
  }
}
```

Now, running `node example` yields:

```txt
no issues found
```

```html
<p>See <span class="citation" data-cite="wadler1989">@wadler1989</span> [sec. 1.3; and <span class="citation" data-cite="hughes1990.">@{hughes1990.}</span>, pp. 4].</p>
```

## API

This package exports no identifiers.
The default export is `remarkCitekey`.

### `unified().use(remarkCitekey[, options])`

Configures remark so that it can parse and serialize [Pandoc][]-style citation
keys.
See the [mdast utility for the syntax tree][syntax-tree].

###### `options.strict`

Passed to [`micromark-extension-citekey`][micromark-extension-citekey-options].

## Security

Use of `remark-citekey` does not involve [**rehype**][rehype]
([**hast**][hast]) or user content so there are no openings for [cross-site
scripting (XSS)][xss] attacks.

## Related

*   [`unifiedjs/unified`][unified]
    — interface for processing text using syntax trees
*   [`remarkjs/remark`][remark]
    — markdown processor powered by plugins
*   [`micromark/micromark`][micromark]
    — the smallest commonmark-compliant markdown parser that exists
*   [`@bernardjoseph/mdast-util-citekey`][mdast-util-citekey]
    — mdast utility to support citation keys
*   [`@bernardjoseph/micromark-extension-citekey`][micromark-extension-citekey]
    — mdast utility to support citation keys

## Contribute

See [`contributing.md` in `micromark/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © Bernd Rellermeyer

<!-- Definitions -->

[npm]: https://docs.npmjs.com/cli/install

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[mdast-util-citekey]: https://github.com/bernardjoseph/mdast-util-citekey

[syntax-tree]: https://github.com/bernardjoseph/mdast-util-citekey#syntax-tree

[micromark]: https://github.com/micromark/micromark

[micromark-extension-citekey]: https://github.com/bernardjoseph/micromark-extension-citekey

[micromark-extension-citekey-options]: https://github.com/bernardjoseph/micromark-extension-citekey#optionsstrict

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[pandoc]: https://pandoc.org

[contributing]: https://github.com/unifiedjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/HEAD/support.md

[coc]: https://github.com/unifiedjs/.github/blob/HEAD/code-of-conduct.md

[license]: https://github.com/micromark/micromark/blob/main/license
