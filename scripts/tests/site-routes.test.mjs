import {test} from 'node:test'
import assert from 'node:assert/strict'
import {pagePath, readPageRoute} from '../../src/hooks/siteRoutes.js'

test('real Pages URLs round-trip across all sections and locales, including root hosting', () => {
    for(const base of ['/', '/VillaBagara/']) {
        for(const section of ['home', 'stay', 'services', 'story', 'gallery', 'videos', 'contact']) {
            for(const language of ['en', 'de', 'hr', 'tr']) {
                const path = pagePath(section, language, base)
                assert.deepEqual(readPageRoute(path, base), {section, language: language === 'en' ? null : language})
                assert.deepEqual(readPageRoute(path + 'index.html', base), readPageRoute(path, base))
            }
        }
    }
})
test('unrecognized paths do not silently become property pages', () => {
    for(const path of ['/elsewhere/', '/VillaBagara/unknown/', '/VillaBagara/stay/extra/', '/VillaBagara/de/nonsense/']) {
        assert.equal(readPageRoute(path, '/VillaBagara/'), null)
    }
})
