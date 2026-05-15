import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDemoUser() {
  const email = 'demo@amlcomply.com'
  const password = 'Demo123!'
  
  console.log('Creating demo user...')
  
  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  
  if (authError) {
    if (authError.message.includes('already been registered')) {
      console.log('User already exists. Resetting password...')
      
      // Get user by email
      const { data: users } = await supabase.auth.admin.listUsers()
      const existingUser = users?.users?.find(u => u.email === email)
      
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, {
          password,
        })
        console.log('\n✅ Password reset successfully!')
        console.log('\n📧 Email: demo@amlcomply.com')
        console.log('🔑 Password: Demo123!')
        return
      }
    }
    console.error('Auth error:', authError.message)
    return
  }
  
  if (!authData.user) {
    console.error('No user created')
    return
  }
  
  // Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: 'Demo Law Firm',
      industry: 'legal',
      subscription_tier: 'professional',
    })
    .select()
    .single()
  
  if (orgError) {
    console.error('Org error:', orgError.message)
    return
  }
  
  // Create user profile
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      full_name: 'Demo Manager',
      organization_id: org.id,
      role: 'admin',
    })
  
  if (userError) {
    console.error('User error:', userError.message)
    return
  }
  
  console.log('\n✅ Demo user created successfully!')
  console.log('\n📧 Email: demo@amlcomply.com')
  console.log('🔑 Password: Demo123!')
  console.log('🏢 Organization: Demo Law Firm')
}

createDemoUser()
