import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.argv[2] ?? process.env.LOCAL_ADMIN_EMAIL
const password = process.argv[3] ?? process.env.LOCAL_ADMIN_PASSWORD

if (!url || !serviceRoleKey || !email || !password) {
  console.error(
    'Uso: npm run admin:create-local -- admin@example.test "contraseña-local" (requiere SUPABASE_URL/VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY).',
  )
  process.exit(1)
}
const parsedUrl = new URL(url)
if (!['localhost', '127.0.0.1'].includes(parsedUrl.hostname)) {
  console.error(
    `Abortado: ${parsedUrl.hostname} no es una instancia local permitida.`,
  )
  process.exit(1)
}
if (password.length < 8) {
  console.error('La contraseña local debe tener al menos 8 caracteres.')
  process.exit(1)
}

const client = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
let userId
const { data: created, error: createError } =
  await client.auth.admin.createUser({ email, password, email_confirm: true })
if (!createError) {
  userId = created.user.id
} else if (/already|registered|exists/i.test(createError.message)) {
  let page = 1
  while (!userId) {
    const { data, error } = await client.auth.admin.listUsers({
      page,
      perPage: 100,
    })
    if (error) throw error
    userId = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    )?.id
    if (userId || data.users.length < 100) break
    page += 1
  }
  if (!userId) throw createError
  const { error } = await client.auth.admin.updateUserById(userId, {
    password,
    email_confirm: true,
  })
  if (error) throw error
} else {
  throw createError
}
const { error: profileError } = await client
  .from('admin_profiles')
  .upsert({ user_id: userId, role: 'admin', active: true })
if (profileError) throw profileError
console.log(`Administrador local activo: ${email} (${userId}).`)
