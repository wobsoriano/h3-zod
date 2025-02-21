import type { App } from 'h3'
import type { Test } from 'supertest'
import type TestAgent from 'supertest/lib/agent'
import { createApp, eventHandler, toNodeListener } from 'h3'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSafeValidatedQuery, useValidatedQuery, z } from '../src'

describe('useValidatedQuery', () => {
  let app: App
  let request: TestAgent<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(toNodeListener(app))
  })

  const querySchema = z.object({
    required: z.string(),
  })

  it('returns 200 OK if query matches validation schema', async () => {
    app.use('/validate', eventHandler(event => useValidatedQuery(event, querySchema)))

    const res = await request.get('/validate?required')

    expect(res.status).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })

  it('throws 400 Bad Request if query does not match validation schema', async () => {
    app.use('/validate', eventHandler(event => useValidatedQuery(event, querySchema)))

    const res = await request.get('/validate')

    expect(res.status).toEqual(400)
    expect(res.body).toMatchSnapshot()
  })

  it('doesn\'t throw 400 Bad Request if query does not match validation schema', async () => {
    app.use('/validate', eventHandler(event => useSafeValidatedQuery(event, querySchema)))

    const res = await request.get('/validate')

    expect(res.status).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })
})
