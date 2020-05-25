import React from 'react'

export default props => {
  return (
    <input
      data-testid={props['data-testid']}
      onChange={props.onChange}
      onSubmit={props.onSubmit}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      value={props.value}
      defaultValue={props.defaultValue}
      type="text"
    />
  )
}
