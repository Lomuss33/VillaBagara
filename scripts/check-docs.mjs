import {existsSync, readFileSync, readdirSync} from 'node:fs'
import {dirname, isAbsolute, join, relative, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const workspace = fileURLToPath(new URL('../', import.meta.url))
const documents = ['AGENTS.md', 'README.md', 'MAINTANER.md', 'USER_GUIDE.md',
    ...readdirSync(join(workspace, 'docs')).filter(name => name.endsWith('.md')).map(name => `docs/${name}`)]
const limits = JSON.parse(readFileSync(join(workspace, 'scripts/budgets.json'), 'utf8'))
const budgets = {'AGENTS.md': limits.agentGuideWords, 'docs/STATE.md': limits.handoffWords}
const errors = []
let startupWords = 0

for(const path of documents) {
    const text = readFileSync(join(workspace, path), 'utf8')
    const words = text.trim().split(/\s+/).length
    if(budgets[path]) {
        startupWords += words
        if(words > budgets[path]) errors.push(`${path}: ${words} words exceeds the ${budgets[path]} word budget`)
    }
    // Ignore examples in code fences; validate repository-relative Markdown links.
    const prose = text.replace(/```[\s\S]*?```/g, '')
    for(const [, rawTarget] of prose.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
        const target = rawTarget.trim().replace(/^<|>$/g, '')
        if(/^(?:https?:|mailto:|#)/.test(target)) continue
        const file = resolve(dirname(join(workspace, path)), decodeURIComponent(target.split('#')[0]))
        const local = relative(workspace, file)
        if(local.startsWith('..') || isAbsolute(local) || !existsSync(file)) {
            errors.push(`${path}: broken or nonportable link ${target}`)
        }
    }
}

if(errors.length) {
    console.error(errors.join('\n'))
    process.exitCode = 1
} else {
    console.log(`Docs checked: ${documents.length} files, valid links, ${startupWords} words for agent startup.`)
}
