import merge from 'lodash/merge'

export default (
  { toggled, expanded, styles },
  { mediaQuery, rhythm, colors, scale, transitions, justifyContent }
) => {
  const open = expanded || toggled

  const defaultStyles = {
    root: {
      position: 'relative'
    },

    form: {
      maxWidth: rhythm(32),
      padding: rhythm(0.5),
      margin: '0 auto',

      [mediaQuery('sm')]: {
        display: 'flex',
        alignItems: 'center',
        flexPack: 'center',
        ...justifyContent('center')
      }
    },

    field: {
      position: 'relative',
      marginRight: rhythm(1),
      flex: 1,
      transition: transitions.easeOut
    },

    input: {
      display: 'block',
      width: '100%',
      boxSizing: 'border-box',
      height: rhythm(2),
      paddingLeft: rhythm(0.5),
      paddingRight: rhythm(1.5),
      borderBottom: `1px solid ${colors.shade} !important`,
      fontSize: '0.875rem',
      borderRadius: '3px',
      border: `solid 1px ${colors.gray03}`,
      paddingTop: rhythm(0.5),
      paddingBottom: rhythm(0.5),
      opacity: 0,
      transition: transitions.easeOut,
      ...(open && {
        width: '100%',
        opacity: 1
      })
    },

    label: {
      display: 'block',
      transform: `translateY(${rhythm(1)})`,
      fontSize: scale(2),
      whiteSpace: 'nowrap',
      marginBottom: rhythm(0.5),
      transition: transitions.easeOut,
      ...(open && {
        transform: 'translateY(0)',
        fontSize: scale(-1),
        marginTop: '0.6rem'
      })
    },

    results: {
      maxWidth: rhythm(32),
      paddingTop: rhythm(1),
      margin: '0 auto'
    }
  }

  return merge(defaultStyles, styles)
}
