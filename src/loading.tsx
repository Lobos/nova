import { createUseStyles } from "react-jss"

const useStyles = createUseStyles({
  loading: {
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#6FB98F',
    margin: '0 4px',
    animation: '$loading 1.5s ease-in-out infinite',

    '&:nth-child(2)': {
      animationDelay: '0.5s',
    },

    '&:nth-child(3)': {
      animationDelay: '1s',
    },
  },
  
  '@keyframes loading': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.5)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
})

export default function Loading() {
  const styles = useStyles()

  return <div className={styles.loading}>
    <span className={styles.dot} />
    <span className={styles.dot} />
    <span className={styles.dot} />
  </div>
}