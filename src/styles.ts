import { createUseStyles } from "react-jss"

export const useStyles = createUseStyles({
  "@global": {
    "*": {
      boxSizing: "border-box",
    },
    body: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      padding: 0,
      margin: 0,
    },
  },
  root: {
    position: "relative",
    maxWidth: 600,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },

  header: {
    height: 50,
    position: "fixed",
    zIndex: 100,
    width: "100%",
    maxWidth: 600,
    top: 0,
    backgroundColor: "#fff",
    borderBottom: "solid 1px #ccc",
    textAlign: "center",
    display: "flex",

    "& span": {
      margin: "auto",
      color: "#6FB98F",
      fontSize: 20,
      fontStyle: "italic",
      fontWeight: "bold",
      cursor: "pointer",
    },
  },

  system: {
    position: "fixed",
    backgroundColor: "#fff",
    top: 50,
    width: "100%",
    maxWidth: 600,
    padding: 20,
    zIndex: 100,

    "& label": {
      display: "flex",
      marginBottom: 10,

      "& span": {
        flex: 1,
      },

      "& button": {},
    },

    "& > div": {
      marginBottom: 30,

      "&:last-child": {
        marginBottom: 0,
      },
    },

    "& $button + $button": {
      marginLeft: 20,
    },
  },

  messages: {
    flex: 1,
    marginTop: 50,

    "& > div": {
      position: "relative",
      display: "flex",
      padding: 20,
    },
  },

  message: {
    flex: 1,
    lineHeight: 1.5,
    marginLeft: 15,

    "& + a": {
      cursor: "pointer",
      position: "absolute",
      top: 0,
      right: 0,
    },
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    backgroundColor: "#6FB98F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 12,
    color: "#fff",
    cursor: "pointer",

    "&$god": {
      backgroundColor: "red",
    },
  },

  god: {},

  user: {
    background: "#f2f2f2",

    "& $avatar": {
      backgroundColor: "#666",
    },
  },

  assistant: {
    background: "#fff",
  },

  currentStatus: {
    "& > span, & > button": {
      margin: "auto",
    },
  },

  chat: {
    position: "sticky",
    bottom: 0,
    background: "#fff",
    padding: "10px 10px 0",

    "& button": {
      backgroundColor: "transparent",
      border: 0,
      padding: 0,
      height: 20,
      marginLeft: 10,
      lineHeight: 1,
      cursor: "pointer",

      "& svg": {
        width: 20,
        height: 20,
        stroke: "#aaa",
      },
    },

    "& button:disabled svg": {
      stroke: "#eee",
    },
  },

  input: {
    fontFamily: "Arial, sans-serif",
    width: "100%",
    height: "auto",
    padding: 10,
    fontSize: 16,
    border: "1px solid #ccc",
    borderRadius: 3,
    resize: "none",
    lineHeight: 1.5,
    marginBottom: 10,
    transition: "border-color 0.3s ease",
    outline: "none",
    display: "flex",
    backgroundColor: "#fff",

    "&:hover": {
      borderColor: "#6FB98F",
    },

    "&:focus": {
      borderColor: "#6FB98F",
    },

    "& input": {
      border: 0,
      flex: 1,
      outline: "none",
      fontSize: 16,
    },
  },

  button: {
    display: "inline-block",
    backgroundColor: "#6FB98F",
    color: "#fff",
    border: "none",
    borderRadius: 3,
    fontSize: 16,
    padding: "10px 20px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },

  smallButton: {
    extend: "button",
    padding: "4px 10px",
  },
})
