import type { RequestHandler } from '@sveltejs/kit'
import db from '~/db'

export const get: RequestHandler = async ({ url: { searchParams } }) => {
  // TODO
  // const query = db('CZ110DGA')...
  return {
    body: {
      count: 0,
      data: [],
    },
  }
}
