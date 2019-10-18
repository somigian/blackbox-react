/**
 * Sizing and Rhythm
 */
export const rhythm = (value = 1, unit = 'rem', basis = 1.5) =>
  Array.isArray(value)
    ? value.map(v => `${basis * v}${unit}`).join(' ')
    : `${basis * value}${unit}`

export const scale = (exponent = 0, scale = 1.2) =>
  `${Math.pow(scale, exponent)}rem`

/**
 * Colors
 */
export const colors = {
  light          : '#FFFFFF',
  dark           : '#1B1C1D',
  grey           : '#767676',
  lightGrey      : '#999999',
  paleGrey       : '#f5f5f5',
  gray01         : '#f5f5f5',
  gray02         : '#EEEEEE',
  gray03         : '#CCCCCC',
  gray04         : '#999999',
  gray05         : '#767676',
  gray06         : '#333333',
  gray07         : '#222222',

  red            : '#DB2828',
  redBg          : '#ffc9c9',
  redTx          : '#863d3d',
  red30          : '#DB282830',
  red50          : '#DB282850',
  orange         : '#F2711C',
  yellow         : '#FBBD08',
  yellowBg       : '#ffe9aa',
  yellowTx       : '#7e5f04',
  olive          : '#B5CC18',
  green          : '#21BA45',
  greenBg        : '#d4edc7',
  greenTx        : '#557445',
  green30        : '#21BA4530',
  green50        : '#21BA4550',
  teal           : '#00B5AD',
  blue           : '#2185D0',
  blueTx         : '#31708f',
  blueBg         : '#d9edf7',
  violet         : '#6435C9',
  purple         : '#A333C8',
  pink           : '#E03997',
  brown          : '#A5673F',

  success        : '#21BA45',
  info           : '#2185D0',
  warning        : '#FBBD08',
  danger         : '#DB2828',
  disabled       : '#999999',

  primary        : '#F2711C',
  secondary      : '#FBBD08',
  tertiary       : '#EEEEEE',

  shade          : 'rgba(0, 0, 0, 0.125)',
  tint           : 'rgba(255, 255, 255, 0.25)',
  transparent    : 'transparent',
  inherit        : 'inherit',

  facebook       : '#3b5999',
  twitter        : '#55acee',
  instagram      : '#e4405f',
  youtube        : '#cd201f',
  linkedin       : '#0084bf',
  google         : '#dd4b39',
  vimeo          : '#1ab7ea',
  fitbit         : '#00b0b9',
  mapmyfitness   : '#004a8d',
  strava         : '#fc4c02',
  twitch         : '#6701B3',
  slack          : '#4a154b',
  whatsapp       : '#25d366',
  pinterest      : '#bd081c',
  messenger      : '#0084ff',
  reddit         : '#ff4500',
  danger         : '#DB2828',
  success        : '#5cb85c',
  blackbaud      : '#8cbe4f',
  everydayhero   : '#1bab6b',
  justgiving     : '#ad29b6'
}

/**
 * Fonts
 */
export const fonts = {
  head: "'Raleway', 'Helvetica', 'sans-serif'",
  body: "'Raleway', 'Helvetica', 'sans-serif'"
}

export const measures = {
  medium: 1.5
}

export const treatments = {
  head: {
    fontFamily: fonts.head,
    fontWeight: 700
  },
  body: {
    fontFamily: fonts.body
  },
  button: {
    fontFamily: fonts.head,
    textTransform: 'uppercase',
    fontWeight: 500,
    paddingTop: rhythm(0.35),
    paddingBottom: rhythm(0.35)
  },
  input: {
    boxSizing: 'border-box',
    fontFamily: fonts.body,
    fontSize: '1rem',
    borderRadius: '3px',
    border: `solid 1px ${colors.gray03}`
  },
  select: {
    fontFamily: fonts.body,
    fontSize: '1rem',
    borderRadius: '3px',
    border: `solid 1px ${colors.gray03}`
  },
  container: {
    maxWidth: rhythm(40)
  }
}

/**
 * Default background styles
 */
export const background = (url, size = 'cover') => ({
  backgroundImage: !!url && `url('${url}')`,
  backgroundSize: size,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
})

/**
 * Borders and Edges
 */
export const shadows = {
  none: 'none',
  light: '0 0 15px rgba(0, 0, 0, 0.125)'
}

export const radiuses = {
  none: 0,
  small: 0.1,
  medium: 0.25,
  large: 50
}

/**
 * Media Queries
 */
export const breakpoints = {
  xs: '24rem',
  sm: '36rem',
  md: '48rem',
  lg: '60rem',
  xl: '72rem'
}

export const mediaQuery = (size = 'sm', query = 'min-width') =>
  `@media (${query}: ${breakpoints[size]})`

/**
 * Effects, Animations, Transitions, Utils
 */
export const transitions = {
  easeOut: 'ease-out .25s'
}

export const utils = {
  fullSize: {
    position: 'absolute',
    content: '""',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
}

export const effects = {
  none: {},
  shade: {
    position: 'relative',
    '&:before': {
      transition: transitions.easeOut,
      ...utils.fullSize,
      backgroundColor: colors.shade,
      opacity: 0
    },
    '&:hover:before': {
      opacity: 1
    }
  },
  tint: {
    position: 'relative',
    '&:before': {
      transition: transitions.easeOut,
      ...utils.fullSize,
      backgroundColor: colors.tint,
      opacity: 0
    },
    '&:hover:before': {
      opacity: 1
    }
  },
  grow: {
    transition: transitions.easeOut,
    backfaceVisibility: 'hidden',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  shrink: {
    transition: transitions.easeOut,
    backfaceVisibility: 'hidden',
    '&:hover': {
      transform: 'scale(0.925)'
    }
  }
}

/**
 * Flexbox justifyContent style polyfill
 */
export const justifyContent = value => {
  const flexPack = {
    'flex-start': 'start',
    'flex-end': 'end',
    'space-between': 'justify',
    'space-around': 'distribute',
    center: 'center'
  }

  return {
    justifyContent: value,
    flexPack: flexPack[value]
  }
}

/**
 * Spacing - for handling spacing objects i.e. padding/margin props
 * e.g. { x: 1, y: 2 } or { l: 1, t: 2 } or 5 etc.
 */

export const calculateSpacing = (spacing, type = 'padding', args = {}) => {
  const defaultOptions = {
    multiplier: 1
  }

  const options = {
    ...defaultOptions,
    ...args
  }

  switch (typeof spacing) {
    case 'number':
      return {
        [type]: rhythm(
          spacing * options.multiplier,
          options.unit,
          options.basis
        )
      }
    case 'object':
      return Object.keys(spacing).reduce(
        (styles, direction) => ({
          ...styles,
          ...spacingDirection(direction, spacing[direction], type, options)
        }),
        {}
      )
    default:
      return {}
  }
}

const spacingDirection = (direction, space, type, options) => {
  const map = {
    t: ['Top'],
    r: ['Right'],
    b: ['Bottom'],
    l: ['Left'],
    x: ['Left', 'Right'],
    y: ['Top', 'Bottom']
  }

  const fields = map[direction] || []

  const styles = fields.reduce(
    (styles, property) => ({
      ...styles,
      [`${type}${property}`]: rhythm(
        space * options.multiplier,
        options.unit,
        options.basis
      )
    }),
    {}
  )

  return styles
}
