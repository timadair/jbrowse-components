import { observer } from 'mobx-react'
import ReactPropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import { ChromePicker } from 'react-color'
import React, { useState } from 'react'

// this is needed because passing a entire color object into the react-color
// for alpha, can't pass in an rgba string for example
function serializeColor(color) {
  if (color instanceof Object) {
    const { r, g, b, a } = color
    return `rgb(${r},${g},${b},${a})`
  }
  return color
}
const useStyles = makeStyles({
  popover: {
    position: 'absolute',
    zIndex: 2,
  },
  cover: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
})

export function ColorPicker(props) {
  const { color, onChange } = props
  const classes = useStyles()
  const [displayColorPicker, setDisplayColorPicker] = useState(true)

  const handleClose = () => {
    setDisplayColorPicker(false)
  }
  return (
    <div>
      {displayColorPicker ? (
        <div className={classes.popover}>
          <div
            role="presentation"
            className={classes.cover}
            onClick={handleClose}
          />
          <ChromePicker color={color} onChange={onChange} />
        </div>
      ) : null}
    </div>
  )
}

ColorPicker.propTypes = {
  color: ReactPropTypes.string.isRequired,
  onChange: ReactPropTypes.func.isRequired,
}

export const ColorSlot = props => {
  const { value, label, TextFieldProps, onChange } = props
  const [displayed, setDisplayed] = useState(false)

  return (
    <>
      <TextField
        value={value}
        label={label}
        InputProps={{
          style: {
            color: value,
            borderRightWidth: '25px',
            borderRightStyle: 'solid',
            borderRightColor: value,
          },
        }}
        onClick={() => setDisplayed(!displayed)}
        onChange={event => {
          onChange(event.target.value)
        }}
        {...TextFieldProps}
      />
      {displayed ? (
        <ColorPicker
          color={value}
          onChange={event => {
            onChange(serializeColor(event.rgb))
          }}
        />
      ) : null}
    </>
  )
}
ColorSlot.propTypes = {
  onChange: ReactPropTypes.func.isRequired,
  label: ReactPropTypes.string,
  TextFieldProps: ReactPropTypes.shape({}),
  value: ReactPropTypes.string,
}
ColorSlot.defaultProps = {
  label: '',
  value: '#000',
  TextFieldProps: {},
}

function ColorEditorSlot(props) {
  const { slot } = props
  return (
    <ColorSlot
      label={slot.name}
      value={slot.value}
      onChange={color => {
        slot.set(color)
      }}
      TextFieldProps={{
        helperText: slot.description,
        fullWidth: true,
      }}
    />
  )
}
ColorEditorSlot.propTypes = {
  slot: ReactPropTypes.shape({
    name: ReactPropTypes.string.isRequired,
    description: ReactPropTypes.string,
    value: ReactPropTypes.string.isRequired,
    set: ReactPropTypes.func.isRequired,
  }).isRequired,
}
export default observer(ColorEditorSlot)
