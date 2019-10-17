
const rhythm = (value = 1, unit = 'rem', basis = 1.5) => (
  Array.isArray(value)
    ? value.map(v => `${basis * v}${unit}`).join(' ')
    : `${basis * value}${unit}`
)

const colors = {
  light: '#FFFFFF',
  dark: '#1B1C1D',
  grey: '#767676',
  lightGrey: '#999999',
  paleGrey: '#f5f5f5',
  primary: '#F2711C',
  secondary: '#FBBD08',
  tertiary: '#203a44',
  danger: '#DB2828'
}

const theme = {
  color: {
    baseBackground: colors.light,
    border: colors.paleGrey,
    codeBackground: colors.paleGrey,
    error: colors.danger,
    light: colors.grey,
    lightest: colors.lightGrey,
    name: colors.primary,
    type: colors.secondary,
    base: colors.dark,
    link: colors.primary,
    linkHover: colors.tertiary,
    sidebarBackground: colors.dark
  },
  fontFamily: {
    base: "'Raleway', 'Helvetica', 'sans-serif'",
    monospace: 'Consolas, "Liberation Mono", Menlo, monospace'
  },
  fontSize: {
    base: 14,
    text: 14,
    small: 12,
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 16,
    h5: 14,
    h6: 12
  },
  maxWidth: 780,
  sidebarWidth: 240
}

const styles = {
  ComponentsList: {
    heading: {
      fontWeight: '700 !important'
    }
  },
  Heading: {
    heading1: {
      display: 'block',
      position: 'relative',
      paddingBottom: rhythm(0.75),
      marginBottom: rhythm(0.75),
      fontWeight: 700,
      '&:before': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: rhythm(3),
        height: '4px',
        backgroundColor: colors.primary,
        borderRadius: '4px'
      },
      '& > a': {
        fontWeight: '700 !important'
      }
    },
    heading2: {
      marginBottom: rhythm(0.5)
    },
    heading3: {
      borderBottom: `thin solid ${colors.lightGrey}`,
      paddingBottom: rhythm(0.25),
      marginBottom: rhythm(1),
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  },
  ReactComponent: {
    tabs: {
      backgroundColor: colors.paleGrey,
      padding: rhythm([0.5, 1]),
      overflow: 'auto'
    },
    tabButtons: {
      marginBottom: 0
    }
  },
  SectionHeading: {
    sectionName: {
      display: 'block',
      paddingTop: `${rhythm(1)} !important`,
      textDecoration: 'none !important',
      '&:hover': {
        opacity: 0.75
      }
    }
  },
  StyleGuide: {
    content: {
      paddingTop: rhythm(2.5),
      '@media (max-width: 600px)': {
        padding: rhythm(1)
      }
    },
    logo: {
      border: 0,
      paddingBottom: 0,
      '& .rsg-logo': {
        display: 'block',
        color: colors.tertiary,
        margin: rhythm(-0.5),
        padding: rhythm(0.5),
        fontSize: theme.fontSize.h3,
        fontFamily: theme.fontFamily.base,
        transition: 'all 250ms ease',
        cursor: 'pointer',
        '&:after, &:hover:after': {
          content: '"\\2197"',
          position: 'absolute',
          top: 0,
          right: 0,
          padding: rhythm(0.5),
          opacity: 0.25,
          transition: 'all 250ms ease',
          cursor: 'pointer'
        },
        '&:hover:after': {
          opacity: 0.75,
          color: colors.dark
        }
      },
      '& .rsg-logo-name, & .rsg-logo-version': {
        display: 'inline-block',
        verticalAlign: 'middle',
        pointerEvents: 'none'
      },
      '& .rsg-logo-name': {
        fontWeight: 700
      },
      '& .rsg-logo-version': {
        marginLeft: rhythm(0.25),
        opacity: 0.5
      }
    },
    sidebar: {
      border: 0,
      '& li > a': {
        color: `${colors.light} !important`
      }
    }
  },
  Logo: {
    logo: {
      color: colors.primary
    }
  },
  TabButton: {
    button: {
      width: '100%'
    },
    isActive: {
      border: 0
    }
  },
  Table: {
    table: {
      marginTop: rhythm(0.5),
      marginBottom: rhythm(0.5),
      minWidth: '600px'
    },
    cellHeading: {
      borderBottom: `thin solid ${colors.lightGrey}`
    },
    cell: {
      paddingBottom: 0,
      '& p': {
        marginBottom: `${rhythm(0.125)} !important`
      },
      '& div[class*="para"]': {
        marginBottom: `${rhythm(0.125)} !important`
      }
    }
  }
}

module.exports = {
  styles: styles,
  theme: theme
}
