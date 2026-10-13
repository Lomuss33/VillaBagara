import {readFileSync, appendFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'

export function documentationOnly(files) {
    return files.length > 0 && files.every(file => /^(?:docs\/[^/]+\.md|(?:AGENTS|README|MAINTANER|USER_GUIDE)\.md)$/.test(file))
}

if(process.argv[1] === fileURLToPath(import.meta.url)) {
    let application = true
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
    // A single-commit push makes HEAD's parent the complete changed range.
    // PRs, multi-commit pushes and unknown event shapes keep all quality gates.
    if(process.env.GITHUB_EVENT_NAME === 'push' && event.commits?.length === 1 && event.after === process.env.GITHUB_SHA) {
        try {
            const files = execFileSync('git', ['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'], {encoding: 'utf8'}).trim().split('\n').filter(Boolean)
            application = !documentationOnly(files)
        } catch { /* Full checks are the safe default. */ }
    }
    appendFileSync(process.env.GITHUB_OUTPUT, `application=${application}\n`)
    console.log(application ? 'Application changes: run full release gates.' : 'Documentation only: run the fast documentation check.')
}
