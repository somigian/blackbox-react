import merge from 'lodash/merge'

export default (
  { border, color, font, gutter, toggled, styles },
  { colors, scale, rhythm, treatments, justifyContent }
) => {
  const borderStyles = border
    ? {
      paddingLeft: rhythm(0.5),
      border: `1px solid ${colors.gray01}`,
      borderLeft: `2px solid ${toggled ? colors[color] : colors.shade}`
    }
    : {}

  const defaultStyles = {
    root: {
      position: 'relative',
      paddingTop: rhythm(0.5),
      paddingBottom: rhythm(0.5),
      // background: colors.gray01,
      ...borderStyles
    },

    head: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      ...justifyContent('flex-start'),
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      fontSize: '1rem',
      textAlign: 'left',
      paddingLeft: '0',
      //background: colors.gray01,
      paddingRight: rhythm(gutter),
      '&:focus:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        //boxShadow: `0 0 1rem ${colors.shade}`,
        pointerEvents: 'none'
      }
    },

    toggle: {
      flexBasis: rhythm(gutter),
      display: 'flex',
      alignItems: 'flex-end',
      flex: `0 0 ${rhythm(1)}`,
      //color: toggled ? colors[color] : colors.lightGrey,
      color: toggled ? colors[color] : colors.gray05,
      position: 'absolute',
      right: '10px',
      fontSize: '0.875rem',
    },

    title: {
      ...treatments[font],
      //fontWeight: '500 !important'
    },

    body: {
      display: toggled ? 'block' : 'none',
      padding: rhythm(0.5),
      //paddingLeft: rhythm(gutter),
      paddingTop: '0',
      paddingLeft: '0',
    }
  }

  return merge(defaultStyles, styles)
}
