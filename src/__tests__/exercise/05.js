// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { build, fake } from '@jackfranklin/test-data-bot'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import renderer from 'react-test-renderer'

import Login from '../../components/login-submission'
import { handlers } from 'test/server-handlers'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password())
  }
})

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const { username, password } = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)

  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByText(username)).toBeInTheDocument()
})

test('error message is displayed if username is not provided', async () => {
  render(<Login />)

  const { password } = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i))
  userEvent.type(screen.getByLabelText(/password/i), password)

  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"username required"`
  )
})

test('error message is displayed if password is not provided', async () => {
  render(<Login />)
  const { username } = buildLoginForm()

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i))

  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password is required"`
  )
})

test('unknow server error display error message', async () => {
  const errorMessage = 'something is wrong'

  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (_, res, ctx) =>
        res(ctx.status(500), ctx.json({ message: errorMessage }))
    )
  )

  render(<Login />)
  userEvent.click(screen.getByRole('button', { name: /submit/i }))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  expect(screen.getByRole('alert')).toHaveTextContent(errorMessage)
})
