import React from 'react'

function LazyWrapper(props: { ReactComponent: React.FunctionComponent }) {
  const { ReactComponent, ...other } = props
  return <ReactComponent {...other} />
}

export default LazyWrapper
