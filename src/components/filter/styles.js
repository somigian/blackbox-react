import merge from 'lodash/merge'

export default ({ background, foreground, styles, input }, { rhythm, colors, treatments }) => {
  const defaultStyles = {
    root: {
      position: 'relative',
      marginBottom: rhythm(0.5),
      backgroundColor: background && colors[background],
      color: foreground && colors[foreground]
    },

    icon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    },

    input: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      height: rhythm(2),
      paddingLeft: rhythm(0.5),
      paddingRight: rhythm(1.5),
      borderBottom: `1px solid ${colors.shade} !important`,
      fontSize: '1rem',
      borderRadius: '3px',
      border: `solid 1px ${colors.gray03}`,
      ...treatments[input],
    }
  }

  return merge(defaultStyles, styles)
}
