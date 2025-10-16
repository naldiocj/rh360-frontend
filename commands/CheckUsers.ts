import { BaseCommand } from '@adonisjs/core/ace'
import Database from '@ioc:Adonis/Lucid/Database'

export default class CheckUsers extends BaseCommand {
  static commandName = 'check-users'
  static description = 'Check existing users'

  async run() {
    try {
      console.log('Checking existing users...')
      
      const users = await Database.query()
        .select('id', 'username', 'email', 'activo')
        .from('users')
        .limit(5)
      
      console.log('Users found:', users)
      
      if (users.length === 0) {
        console.log('No users found in database')
      }
      
    } catch (error) {
      console.error('Error checking users:', error)
    }
  }
} 