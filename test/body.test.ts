import type { SuperTest, Test } from 'supertest'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import type { App, CompatibilityEvent } from 'h3'
import { createApp } from 'h3'
import { useValidatedBody, z } from '../src'

describe('useValidatedBody', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(app)
  })

  const bodySchema = z.object({
    optional: z.string().optional(),
    required: z.boolean(),
  })

  it('returns 200 OK if body matches validation schema', async () => {
    app.use('/validate', async (req: CompatibilityEvent) => await useValidatedBody(req, bodySchema))

    const res = await request.post('/validate').send({ required: true })

    expect(res.status).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })

  it('throws 400 Bad Request if body does not match validation schema', async () => {
    app.use('/validate', async (req: CompatibilityEvent) => await useValidatedBody(req, bodySchema))

    const res = await request.post('/validate').send({})

    expect(res.status).toEqual(400)
    expect(res.body).toMatchSnapshot()
  })
})
