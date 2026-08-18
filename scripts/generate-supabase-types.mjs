import {
  closeSync,
  copyFileSync,
  mkdtempSync,
  openSync,
  rmSync,
  statSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'bakery-supabase-types-'))
const temporaryFile = join(temporaryDirectory, 'database.types.ts')
const targetFile = resolve('src/types/database.types.ts')
const output = openSync(temporaryFile, 'w')
const executable = process.platform === 'win32' ? 'supabase.cmd' : 'supabase'

try {
  const result = spawnSync(
    executable,
    ['gen', 'types', 'typescript', '--local', '--schema', 'public'],
    { stdio: ['inherit', output, 'inherit'] },
  )
  closeSync(output)

  if (result.error) {
    console.error(`No se pudo ejecutar Supabase CLI: ${result.error.message}`)
    process.exitCode = 1
  } else if (result.status !== 0) {
    process.exitCode = result.status ?? 1
  } else if (statSync(temporaryFile).size === 0) {
    console.error(
      'Supabase CLI terminó sin generar tipos; se conserva el archivo actual.',
    )
    process.exitCode = 1
  } else {
    copyFileSync(temporaryFile, targetFile)
    console.log(`Tipos Supabase actualizados en ${targetFile}.`)
  }
} finally {
  try {
    closeSync(output)
  } catch {
    // The descriptor is already closed after the CLI finishes normally.
  }
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
