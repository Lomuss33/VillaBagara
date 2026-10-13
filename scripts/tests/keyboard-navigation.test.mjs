import assert from 'node:assert/strict'
import test from 'node:test'
import {isPlainActivation, navigationFocusIndex} from '../../src/hooks/navigationAccessibility.js'

test('plain link activation handles the primary button and keyboard activation', () => {
    assert.equal(isPlainActivation({button: 0}), true)
    assert.equal(isPlainActivation({}), true)
    assert.equal(isPlainActivation({button: 1}), false)
    assert.equal(isPlainActivation({button: 2}), false)
})

test('modified links keep the browser behavior for opening a destination', () => {
    for(const modifier of ['altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
        assert.equal(isPlainActivation({button: 0, [modifier]: true}), false, modifier)
    }
})

test('section navigation wraps in its own orientation and offers Home/End', () => {
    assert.equal(navigationFocusIndex('ArrowUp', 'vertical', 0, 7), 6)
    assert.equal(navigationFocusIndex('ArrowDown', 'vertical', 6, 7), 0)
    assert.equal(navigationFocusIndex('ArrowLeft', 'horizontal', 0, 4), 3)
    assert.equal(navigationFocusIndex('ArrowRight', 'horizontal', 3, 4), 0)
    assert.equal(navigationFocusIndex('Home', 'vertical', 5, 7), 0)
    assert.equal(navigationFocusIndex('End', 'horizontal', 1, 4), 3)
    assert.equal(navigationFocusIndex('ArrowRight', 'horizontal', 0, 1), 0)
})

test('unrelated keys, empty groups and detached controls have no navigation shortcut', () => {
    for(const key of ['Tab', 'Enter', ' ', 'Escape', 'a', 'ArrowLeft', 'ArrowRight']) {
        assert.equal(navigationFocusIndex(key, 'vertical', 0, 7), null, key)
    }
    assert.equal(navigationFocusIndex('ArrowDown', 'horizontal', 0, 4), null)
    assert.equal(navigationFocusIndex('Home', 'vertical', 0, 0), null)
    assert.equal(navigationFocusIndex('Home', 'vertical', -1, 7), null)
    assert.equal(navigationFocusIndex('End', 'horizontal', 4, 4), null)
})
