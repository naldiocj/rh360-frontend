import { BaseCommand } from '@adonisjs/core/ace'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

export default class CreateTestUser extends BaseCommand {
  static commandName = 'create-test-user'
  static description = 'Create a test user'

  async run() {
    try {
      console.log('Creating test user...')
      
      // Create pessoa first
      const pessoa = await Database.table('pessoas').insert({
        nome_completo: 'Test User',
        created_at: new Date(),
        updated_at: new Date()
      }).returning('id')
      
      console.log('Pessoa created with ID:', pessoa[0].id)
      
      // Create user
      const user = await Database.table('users').insert({
        username: 'testuser',
        email: 'test@test.com',
        password: await Hash.make('sic_minint_salt_2024test'),
        pessoa_id: pessoa[0].id,
        user_id: 'test123',
        activo: true,
        forcar_alterar_senha: false,
        aceder_painel_piips: true,
        aceder_departamento: true,
        aceder_seccao: true,
        aceder_posto_policial: true,
        aceder_todos_agentes: true,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('id')
      
      console.log('User created with ID:', user[0].id)
      
      // Create role
      const role = await Database.table('roles').insert({
        nome: 'Test Role',
        name: 'test_role',
        created_at: new Date(),
        updated_at: new Date()
      }).returning('id')
      
      console.log('Role created with ID:', role[0].id)
      
      // Assign role to user
      await Database.table('user_roles').insert({
        user_id: user[0].id,
        role_id: role[0].id,
        created_at: new Date(),
        updated_at: new Date()
      })
      
      console.log('Test user created successfully!')
      console.log('Email: test@test.com')
      console.log('Password: test')
      
    } catch (error) {
      console.error('Error creating test user:', error)
    }
  }
} 