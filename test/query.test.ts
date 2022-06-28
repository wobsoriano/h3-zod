import { beforeEach, describe, expect, it } from 'vitest'
import type { SuperTest, Test } from 'supertest'
import supertest from 'supertest'
import type { App, CompatibilityEvent } from 'h3'
import { createApp } from 'h3'
import { useValidatedQuery, z } from '../src'

describe('useValidatedQuery', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(app)
  })

  const querySchema = z.object({
    required: z.string(),
  })

  it('returns 200 OK if query matches validation schema', async () => {
    app.use('/validate', (req: CompatibilityEvent) => useValidatedQuery(req, querySchema))

    const res = await request.get('/validate?required')

    expect(res.status).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })

  it('throws 400 Bad Request if query does not match validation schema', async () => {
    app.use('/validate', (req: CompatibilityEvent) => useValidatedQuery(req, querySchema))

    const res = await request.get('/validate')

    expect(res.status).toEqual(400)
    expect(res.body).toMatchSnapshot()
  })
})
