import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { withStyles } from '@material-ui/core/styles'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { getMembers } from 'mobx-state-tree'
import propTypes from 'prop-types'
import React, { Fragment } from 'react'
import { iterMap } from '@gmod/jbrowse-core/util'

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
  return <p>Hello world</p>
}

Search.propTypes = {
  classes: propTypes.shape({
    root: propTypes.string.isRequired,
  }).isRequired,
  model: MobxPropTypes.objectOrObservableObject.isRequired,
}

export default withStyles(styles)(observer(Search))
