#!/usr/bin/env node
const { spawn, execSync } = require('child_process')

const next = spawn('./node_modules/.bin/next', ['dev', '--turbopack'], {
  stdio: ['inherit', 'pipe', 'inherit'],
})

let opened = false

next.stdout.on('data', (chunk) => {
  process.stdout.write(chunk)
  if (!opened && chunk.toString().includes('Ready in')) {
    opened = true
    setTimeout(() => execSync('open http://localhost:3000'), 300)
  }
})

next.on('exit', (code) => process.exit(code ?? 0))
process.on('SIGINT', () => next.kill('SIGINT'))
process.on('SIGTERM', () => next.kill('SIGTERM'))
