export class Pagination {

  current_page: number = 1

  first_page: number = 1
  first_page_url?: string

  last_page: number = 0
  last_page_url?: string

  next_page_url?: string

  per_page: number = 10
  previous_page_url?: string

  total: number = 0

  deserialize(input: any): this {
    return Object.assign(this, input)
  }
}
