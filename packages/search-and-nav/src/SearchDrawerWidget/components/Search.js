import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'
import propTypes from 'prop-types'
import React, { useState } from 'react'

const styles = theme => ({
  searchDrawer: {
    marginLeft: theme.spacing(1),
    borderLeft: `1px solid ${theme.palette.secondary.main}`,
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})

const Search = props => {
  const { classes, model } = props
  const [search, setSearch] = useState()
  const [locstring, setLocstring] = useState()
  return (
    <>
      <TextField
        label="Enter location string e.g. chr1:1..1000"
        onChange={event => setLocstring(event.target.value)}
      />
      <TextField
        label="Search for feature"
        onChange={event => setSearch(event.target.value)}
      />
    </>
  )
}

Search.propTypes = {
  classes: propTypes.shape({
    root: propTypes.string.isRequired,
  }).isRequired,
  model: MobxPropTypes.objectOrObservableObject.isRequired,
}

export default withStyles(styles)(observer(Search))
