const simpleGit = require('simple-git/promise')
var projectInfo = require('./package.json')
const git = simpleGit()
const time = new Date().getTime()
git.init()

const _tag = `tag-v${projectInfo.version}.${time}`
console.log(_tag)
git.addTag(_tag)
// git.commit(`TAG-SUBMIT.v${projectInfo.version}`)
git.push('origin', _tag)
