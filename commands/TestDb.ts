import { BaseCommand } from '@adonisjs/core/ace'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TestDb extends BaseCommand {
  static commandName = 'test-db'
  static description = 'Test database connection'

  async run() {
    try {
      console.log('Testing database connection...')
      
      // Test simple query
      const result = await Database.query().select('1 as test')
      console.log('Simple query result:', result)
      
      // Test users table
      const users = await Database.query().select('id', 'username', 'email').from('users').limit(1)
      console.log('Users table result:', users)
      
      // Test pessoas table
      const pessoas = await Database.query().select('id', 'nome_completo').from('pessoas').limit(1)
      console.log('Pessoas table result:', pessoas)
      
      console.log('Database connection successful!')
    } catch (error) {
      console.error('Database connection failed:', error)
    }
  }
} 