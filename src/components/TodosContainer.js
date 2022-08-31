import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

class TodosContainer extends Component {
  
 
  constructor(props) {
    super(props)
	  const hostname = '<change-to-your-personal-environment-hostname>'
    this.url =  `https://${hostname}/ToDoAPI/rest/`
    this.state = {
      todos: [],
      inputValue: ''
    }
	}

	

  getTodos() {
	
    axios.get(this.url + 'api/v1/todos')
    .then(response => {
      this.setState({todos: response.data})
    })
    .catch(error => console.log(error))
  }
  
  createTodo = (e) => {
    if (e.key === 'Enter' && !(e.target.value === '')) {
      axios.post(this.url + 'api/v1/todos', {todo: {title: e.target.value}})
      .then(response => {
        const todos = update(this.state.todos, {})
        this.setState({
          todos: todos,
          inputValue: ''
        })
        this.getTodos()
      })
      .catch(error => console.log(error))      
    }    
  }

  handleChange = (e) => {
    this.setState({inputValue: e.target.value});
  }

  updateTodo = (e, id) => {
    axios.put(this.url + `api/v1/todos/?Id=${id}`, {todo: {done: e.target.checked}})
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === response.data.id)
      const todos = update(this.state.todos, {
        [todoIndex]: {$set: response.data}
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))      
  }

  deleteTodo = (id) => {
    axios.delete(this.url + `api/v1/todos/?Id=${id}`)
    .then(response => {
      const todoIndex = this.state.todos.findIndex(x => x.id === id)
      const todos = update(this.state.todos, {
        $splice: [[todoIndex, 1]]
      })
      this.setState({
        todos: todos
      })
    })
    .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getTodos()
	}

  render() {
    return (
      <div>
        <div className="inputContainer">
          <input className="taskInput" type="text" 
            placeholder="Add a new task" maxLength="50"
            onKeyPress={this.createTodo}
            value={this.state.inputValue} onChange={this.handleChange} />
        </div>        
        <div className="listWrapper">
          <ul className="taskList">
            {this.state.todos.map((todo) => {
              return(
                <li className="task" key={todo.id}>
                  <input className="taskCheckbox" type="checkbox" 
                    checked={todo.done}
                    onChange={(e) => this.updateTodo(e, todo.id)} />              
                  <label className="taskLabel">{todo.title}</label>
                  <span className="deleteTaskBtn" 
                    onClick={(e) => this.deleteTodo(todo.id)}>
                    x
                  </span>
                </li>
              )       
            })}        
          </ul>
        </div>
      </div>
    )
  }
}

export default TodosContainer
