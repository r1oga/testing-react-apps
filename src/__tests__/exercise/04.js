// form testing
// http://localhost:3000/login

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import faker from 'faker'
import { build, fake } from '@jackfranklin/test-data-bot'

test('submitting the form calls onSubmit with username and password', () => {
  let submittedData

  const handleSubmit = jest.fn(data => {
    submittedData = data
  })
  const buildLoginForm = overrides => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides
  })

  const formBuilder = build('Form', {
    fields: {
      username: fake(f => f.name.findName()),
      password: fake(f => f.internet.password())
    }
  })

  render(<Login onSubmit={handleSubmit} />)

  // const { username, password } = buildLoginForm({ password: 'abc' })
  const { username, password } = formBuilder({ overrides: { password: 'abc' } })

  userEvent.type(screen.getByLabelText(/username/i), username)
  userEvent.type(screen.getByLabelText(/password/i), password)
  userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(submittedData).toEqual({ username, password })
  expect(handleSubmit).toHaveBeenCalledWith(submittedData)
})

/*
eslint
  no-unused-vars: "off",
*/
