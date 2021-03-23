// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import { render, screen /* act */ } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import useCounter from 'components/use-counter'

const Counter = () => {
  const { count, increment, decrement } = useCounter({
    initialCount: 1,
    step: 2
  })
  return (
    <>
      <div role="contentinfo">{count}</div>
      <button name="increment" onClick={increment}>
        Increment
      </button>
      <button name="decrement" onClick={decrement}>
        Decrement
      </button>
    </>
  )
}

// function setup({ initialProps } = {}) {
//   // let returnVal = {}
//   const returnVal = {}
//   const TestCount = props => {
//     // Object.assign(returnVal, useCounter(...args))
//     // to fix binding problems
//     // (returnVal in function scope vs result in test block scope)
//     returnVal.current = useCounter(props)
//     return null
//   }

//   render(<TestCount {...initialProps} />)
//   return returnVal
// }

test('exposes the count and increment/decrement functions', () => {
  // render(<Counter />)

  // const increment = screen.getByRole('button', { name: /increment/i })
  // const decrement = screen.getByRole('button', { name: /decrement/i })
  // const count = screen.getByRole('contentinfo')
  // expect(count).toHaveTextContent(1)

  // userEvent.click(increment)
  // expect(count).toHaveTextContent(3)

  // userEvent.click(decrement)
  // expect(count).toHaveTextContent(1)

  // const result = setup()
  const { result } = renderHook(() => useCounter())
  expect(result.current.count).toBe(0)

  act(() => result.current.increment())
  expect(result.current.count).toBe(1)

  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('allows customization of the initial count', () => {
  // const result = setup({ initialProps: { initialCount: 10 } })
  const { result } = renderHook(useCounter, {
    initialProps: { initialCount: 10 }
  })
  expect(result.current.count).toBe(10)
})

test('allows customization of the step', () => {
  // const result = setup({ initialProps: { step: 3 } })
  const { result } = renderHook(useCounter, { initialProps: { step: 3 } })
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(3)
  act(() => result.current.decrement())
  expect(result.current.count).toBe(0)
})

test('step can be changed', () => {
  // const result = setup({ initialProps: { step: 3 } })
  const { result, rerender } = renderHook(useCounter, {
    initialProps: { step: 2 }
  })
  expect(result.current.count).toBe(0)
  act(() => result.current.increment())
  expect(result.current.count).toBe(2)

  rerender({ step: 10 })
  act(() => result.current.increment())
  expect(result.current.count).toBe(12)
})

/* eslint no-unused-vars:0 */
