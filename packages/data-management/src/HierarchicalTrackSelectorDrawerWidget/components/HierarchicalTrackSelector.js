import { getSession } from '@gmod/jbrowse-core/util'
import Fab from '@material-ui/core/Fab'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { PropTypes as MobxPropTypes } from 'mobx-react'
import { observer } from 'mobx-react-lite'
import propTypes from 'prop-types'
import React, { useState } from 'react'
import { readConfObject } from '@gmod/jbrowse-core/configuration'
import Contents from './Contents'

const styles = theme => ({
  root: {
    textAlign: 'left',
    padding: theme.spacing(1),
  },
  searchBox: {
    marginBottom: theme.spacing(2),
  },
  fab: {
    float: 'right',
    position: 'sticky',
    marginTop: theme.spacing(2),
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  connectionsPaper: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  tabs: {
    marginBottom: theme.spacing(1),
  },
})

function HierarchicalTrackSelector(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const [assemblyIdx, setAssemblyIdx] = useState(0)

  const { model, classes } = props
  const session = getSession(model)

  function handleTabChange(event, newIdx) {
    setAssemblyIdx(newIdx)
  }

  function handleFabClick(event) {
    setAnchorEl(event.currentTarget)
  }

  function handleFabClose() {
    setAnchorEl(null)
  }

  function handleInputChange(event) {
    model.setFilterText(event.target.value)
  }

  function addConnection() {
    handleFabClose()
    if (!session.drawerWidgets.get('addConnectionDrawerWidget'))
      session.addDrawerWidget(
        'AddConnectionDrawerWidget',
        'addConnectionDrawerWidget',
      )
    session.showDrawerWidget(
      session.drawerWidgets.get('addConnectionDrawerWidget'),
    )
  }

  function addTrack() {
    handleFabClose()
    session.addDrawerWidget('AddTrackDrawerWidget', 'addTrackDrawerWidget', {
      view: model.view.id,
    })
    session.showDrawerWidget(session.drawerWidgets.get('addTrackDrawerWidget'))
  }

  function filter(trackConfig) {
    if (!model.filterText) return true
    const name = readConfObject(trackConfig, 'name')
    return name.toLowerCase().includes(model.filterText.toLowerCase())
  }

  const { assemblyNames } = model
  const assemblyName = assemblyNames[assemblyIdx]
  const filterError =
    model.trackConfigurations(assemblyName) > 0 &&
    model.trackConfigurations(assemblyName).filter(filter).length === 0

  return (
    <div
      key={model.view.id}
      className={classes.root}
      data-testid="hierarchical_track_selector"
    >
      {assemblyNames.length > 1 ? (
        <Tabs
          className={classes.tabs}
          value={assemblyIdx}
          onChange={handleTabChange}
        >
          {assemblyNames.map(name => (
            <Tab key={name} label={name} />
          ))}
        </Tabs>
      ) : null}
      <TextField
        className={classes.searchBox}
        label="Filter Tracks"
        value={model.filterText}
        error={filterError}
        helperText={filterError ? 'No matches' : ''}
        onChange={handleInputChange}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={model.clearFilterText}>
                <Icon>clear</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Contents
        model={model}
        filterPredicate={filter}
        assemblyName={assemblyName}
        top
      />
      {session.connections.size ? (
        <>
          <Typography variant="h5">Connections:</Typography>
          {Array.from(session.connections.keys()).map(connectionName => (
            <Paper
              key={connectionName}
              className={classes.connectionsPaper}
              elevation={8}
            >
              <Typography variant="h6">{connectionName}</Typography>
              <Contents
                model={model}
                filterPredicate={filter}
                connection={connectionName}
                assemblyName={assemblyName}
                top
              />
            </Paper>
          ))}
        </>
      ) : null}

      <Fab color="secondary" className={classes.fab} onClick={handleFabClick}>
        <Icon>add</Icon>
      </Fab>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFabClose}
      >
        <MenuItem onClick={addConnection}>Add connection</MenuItem>
        <MenuItem onClick={addTrack}>Add track</MenuItem>
      </Menu>
    </div>
  )
}

HierarchicalTrackSelector.propTypes = {
  classes: propTypes.objectOf(propTypes.string).isRequired,
  model: MobxPropTypes.observableObject.isRequired,
}

export default withStyles(styles)(observer(HierarchicalTrackSelector))
