import type { SuperTest, Test } from 'supertest'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import type { App } from 'h3'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { useSafeValidatedBody, useValidatedBody, z } from '../src'

describe('useValidatedBody', () => {
  let app: App
  let request: SuperTest<Test>

  beforeEach(() => {
    app = createApp({ debug: false })
    request = supertest(toNodeListener(app))
  })

  const bodySchema = z.object({
    optional: z.string().optional(),
    required: z.boolean(),
  })

  it('returns 200 OK if body matches validation schema', async () => {
    app.use('/validate', eventHandler(event => useValidatedBody(event, bodySchema)))

    const res = await request.post('/validate').send({ required: true })

    expect(res.status).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })

  it('throws 400 Bad Request if body does not match validation schema', async () => {
    app.use('/validate', eventHandler(event => useValidatedBody(event, bodySchema)))

    const res = await request.post('/validate').send({})

    expect(res.status).toEqual(400)
    expect(res.body).toMatchSnapshot()
  })

  it('doesn\'t throw 400 Bad Request if body does not match validation schema', async () => {
    app.use('/validate', eventHandler(event => useSafeValidatedBody(event, bodySchema)))

    const res = await request.post('/validate').send({})

    expect(res.status).toEqual(200)
    expect(res.body).toMatchSnapshot()
  })
})
