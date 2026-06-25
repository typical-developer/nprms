// Starts the backend (server/) and the Next.js frontend together.
// No extra dependencies — just Node's child_process. Ctrl+C stops both.
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run(name, cwd, color) {
  const child = spawn(npm, ['run', 'dev'], { cwd, shell: process.platform === 'win32' })
  const prefix = `\x1b[${color}m[${name}]\x1b[0m `
  const pipe = (stream, out) => {
    let buf = ''
    stream.on('data', (d) => {
      buf += d.toString()
      const parts = buf.split('\n')
      buf = parts.pop() || ''
      for (const line of parts) out.write(prefix + line + '\n')
    })
  }
  pipe(child.stdout, process.stdout)
  pipe(child.stderr, process.stderr)
  child.on('exit', (code) => {
    process.stdout.write(prefix + `exited with code ${code}\n`)
    procs.forEach((p) => p !== child && p.kill())
    process.exit(code ?? 0)
  })
  return child
}

const procs = [
  run('api', path.join(root, 'server'), '36'), // cyan
  run('web', root, '35'),                       // magenta
]

const stop = () => { procs.forEach((p) => p.kill()); process.exit(0) }
process.on('SIGINT', stop)
process.on('SIGTERM', stop)

console.log('Starting NPRMS — API on :4000, web on :3000. Press Ctrl+C to stop both.\n')
