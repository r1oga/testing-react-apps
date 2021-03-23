// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import { render, screen, act } from '@testing-library/react'
import Location from '../../examples/location'
import faker from 'faker'
import { useCurrentPosition } from 'react-use-geolocation'

jest.mock('react-use-geolocation')

beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn()
  }
})

// function deferred() {
//   let resolve, reject
//   const promise = new Promise((res, rej) => {
//     resolve = res
//     reject = rej
//   })
//   return { promise, resolve, reject }
// }

test('displays the users current location', async () => {
  const latitude = faker.address.latitude()
  const longitude = faker.address.longitude()
  const coords = { latitude, longitude }

  let setReturnValue
  const useMockCurrentPosition = () => {
    const state = React.useState([])
    setReturnValue = state[1]
    return state[0]
  }

  useCurrentPosition.mockImplementation(useMockCurrentPosition)
  // const { promise, resolve, _ } = deferred()
  // window.navigator.geolocation.getCurrentPosition.mockImplementation(cb => {
  //   promise.then(() => cb({ coords }))
  // })

  render(<Location />)
  expect(useCurrentPosition).toHaveBeenCalledWith()
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  // await act(async () => {
  //   resolve()
  //   await promise
  // })

  act(() => {
    setReturnValue([{ coords }])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(coords.latitude)
  expect(screen.getByText(/longitude/i)).toHaveTextContent(coords.longitude)
})

/*
eslint
  no-unused-vars: "off",
*/
