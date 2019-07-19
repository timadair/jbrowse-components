import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'
import propTypes from 'prop-types'
import React, { useState, useEffect } from 'react'

const styles = theme => ({
  root: {},
  searchDrawer: {
    marginLeft: theme.spacing(1),
    borderLeft: `1px solid ${theme.palette.secondary.main}`,
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  searchField: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
})

const Search = props => {
  const { classes, model } = props
  const [search, setSearch] = useState('')
  const [locstring, setLocstring] = useState('')
  const navTo = () => {
    const [refSeq, rest = ''] = locstring.split(':')
    const [start, end] = rest.split('..')
    if (refSeq !== undefined && start !== undefined && end !== undefined) {
      model.target.navTo({ refSeq, start, end })
    }
  }
  const searchForm = () => {}
  return (
    <>
      <Typography>Search for features or enter a locstring</Typography>
      <form
        onSubmit={event => {
          navTo()
          event.preventDefault()
        }}
      >
        <TextField
          label="Enter location string e.g. chr1:1..1000"
          className={classes.searchField}
          onChange={event => setLocstring(event.target.value)}
        />
      </form>
      <form
        onSubmit={event => {
          searchForm()
          event.preventDefault()
        }}
      >
        <TextField
          label="Search for feature"
          className={classes.searchField}
          onChange={event => setSearch(event.target.value)}
        />
      </form>
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
