import {test} from 'node:test'
import assert from 'node:assert/strict'
import {documentationOnly} from '../check-ci-scope.mjs'

test('documentation fast path excludes runtime files and publicly served Markdown', () => {
    assert.equal(documentationOnly(['docs/STATE.md', 'README.md']), true)
    for(const files of [[], ['public/README.md'], ['docs/STATE.md', 'index.html'], ['package.json'], ['docs/nested/file.md'], ['.github/workflows/deploy.yml']]) {
        assert.equal(documentationOnly(files), false)
    }
})
