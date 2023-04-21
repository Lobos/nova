import { createUseStyles } from "react-jss"

export const useStyles = createUseStyles({
  '@global': {
    '*': {
      boxSizing: 'border-box',
    },
    body: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      padding: 0,
      margin: 0,
    },
  },
  root: {
    maxWidth: 600,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },

  system: {
    padding: 20,

    '& label': {
      display: 'block',
      marginBottom: 10,
    },
  },

  messages: {
    flex: 1,

    '& > div': {
      position: 'relative',
      display: 'flex',
      padding: 20,
      // boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    }
  },

  message: {
    flex: 1,
    lineHeight: 1.5,
    padding: '0 10px',

    '& + a': {
      cursor: 'pointer',
      position: 'absolute',
      top: 0,
      right: 0,
    }
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: '#6FB98F',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 12,
    color: '#fff',
  },

  user: {
    background: '#f2f2f2',

    '& $avatar': {
      backgroundColor: '#333',
    }
  },

  assistant: {
    background: '#fff',
  },

  currentStatus: {
    '& > span': {
      margin: 'auto',
    },

    '& > a': {
      margin: 'auto',
      cursor: 'pointer',
    }
  },

  chat: {
    backgroundColor: '#fff',
    marginTop: 20,
  },

  input: {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    height: 'auto',
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 3,
    resize: 'none',
    lineHeight: 1.5,
    marginBottom: 10,
    transition: 'border-color 0.3s ease',
    outline: 'none',
    display: 'flex',

    '&:hover': {
      borderColor: '#6FB98F',
    },

    '&:focus': {
      borderColor: '#6FB98F',
    },

    '& input': {
      border: 0,
      flex: 1,
      outline: 'none',
      fontSize: 16,
    }
  },

  button: {
    display: 'inline-block',
    backgroundColor: '#6FB98F',
    color: '#fff',
    border: 'none',
    borderRadius: 3,
    fontSize: 16,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  }
})