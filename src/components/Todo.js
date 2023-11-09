import {
    TextField,
    Button,
    Typography,
    Checkbox,
    List,
    ListItem,
    Container,
    makeStyles
  } from "@material-ui/core";
  import { useState } from "react";
  import "./styles.css";
  
  const useStyles = makeStyles({
    input: {
      width: "70%",
      marginBottom: 30
    },
    addButton: {
      height: 55,
      marginBottom: 30
    },
    container: {
      textAlign: "center",
      marginTop: 100
    },
    list: {
      width: "80%",
      margin: "auto",
      display: "flex",
      justifyContent: "space-around",
      border: "1px solid light-gray"
    },
    text: {
      width: "70%"
    },
    listButtons: {
      marginLeft: 10
    }
  });
  
  function Todo() {
    const [inputVal, setInputVal] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdited, setIsEdited] = useState(false);
    const [editedId, setEditedId] = useState(null);
    const classes = useStyles();
  
    const onChange = (e) => {
      setInputVal(e.target.value);
    };
  
    const handleClick = () => {
      if (!isEdited) {
        setTodos([
          ...todos,
          { val: inputVal, isDone: false, id: new Date().getTime() }
        ]);
      } else {
        setTodos([...todos, { val: inputVal, isDone: false, id: editedId }]);
      }
      setInputVal("");
      setIsEdited(false);
    };
  
    const onDelete = (id) => {
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
    };
  
    const handleDone = (id) => {
      const updated = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      setTodos(updated);
    };
  
    const handleEdit = (id) => {
      const newTodos = todos.filter((todo) => todo.id !== id);
      const editVal = todos.find((todo) => todo.id === id);
      setEditedId(editVal.id);
      setInputVal(editVal.val);
      setTodos(newTodos);
      setIsEdited(true);
    };
  
    return (
      <Container component="main" className={classes.container}>
        <TextField
          variant="outlined"
          onChange={onChange}
          label="type your task"
          value={inputVal}
          className={classes.input}
        />
        <Button
          size="large"
          variant={isEdited ? "outlined" : "contained"}
          color="primary"
          onClick={handleClick}
          className={classes.addButton}
          disabled={inputVal ? false : true}
        >
          {isEdited ? "Edit Task" : "Add Task"}
        </Button>
        <List>
          {todos.map((todo) => {
            return (
              <>
                <ListItem divider="bool" className={classes.list}>
                  <Checkbox
                    onClick={() => handleDone(todo.id)}
                    checked={todo.isDone}
                  />
                  <Typography
                    className={classes.text}
                    style={{ color: todo.isDone ? "green" : "" }}
                    key={todo.id}
                  >
                    {todo.val}
                  </Typography>
                  <Button
                    onClick={() => handleEdit(todo.id)}
                    variant="contained"
                    className={classes.listButtons}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(todo.id)}
                    color="secondary"
                    variant="contained"
                    className={classes.listButtons}
                  >
                    delete
                  </Button>
                </ListItem>
              </>
            );
          })}
        </List>
      </Container>
    );
  }
  
  export default Todo;
  