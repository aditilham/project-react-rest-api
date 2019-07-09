import React from "react";
import axios from "axios";
import "./App.css";

export default class Todos extends React.Component {
  state = {
    description: "",
    // description: "",
    tasks: [],
    showingTask: true,
    showingEdit: false,
    id: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  deleteSubmit = index => {
    axios.delete(`${process.env.REACT_APP_API}/${index}`).then(res => {
      this.setState({
        tasks: res.data
      });
      if (res.status === 200) {
        alert("Data Deleted!");
      }
      console.log(res);
    });
  };

  toggleEdit = (description, id) => {
    this.setState({
      showingEdit: true,
      showingTask: false,
      id,
      description
    });
  };

  editTask = index => {
    axios
      .put(`${process.env.REACT_APP_API}/${index}`, {
        description: this.state.description
      })
      .then(res => {
        this.setState({
          tasks: res.data,
          editTask: false,
          showingTask: true,
          id: ""
        });
        if (res.status === 200) {
          alert("Data Updated!");
        }
      });
  };

  componentDidMount() {
    axios.get(process.env.REACT_APP_API).then(res => {
      const tasks = res.data;
      this.setState({ tasks });
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    axios
      .post(process.env.REACT_APP_API, {
        description: this.state.description
      })
      .then(res => {
        console.log(res);
        this.setState({
          tasks: res.data
        });
        console.log(res.data);
      });
  };

  // console.log(process.env.API_STRING);
  render() {
    return (
      <div className="App App-header">
        <h1>Tasks</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Your Task :
            <input
              type="text"
              name="description"
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Add</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Done</th>
              <th>Delete</th>
              <th>Edit/Update</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tasks.map((data, index) => {
              return (
                <tr key={index}>
                  <td>
                    {this.state.id === index && (
                      <input
                        type="text"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange}
                      />
                    )}
                    {this.state.id !== index && (
                      <span style={{ color: "white" }}>{data.description}</span>
                    )}
                  </td>
                  <td>{data.done === true ? "✓" : "x"}</td>
                  <td>
                    <button onClick={() => this.deleteSubmit(index)}>
                      Delete
                    </button>
                  </td>
                  <td>
                    {this.state.showingTask === true ? (
                      <button
                        onClick={() => this.toggleEdit(data.description, index)}
                      >
                        edit
                      </button>
                    ) : this.state.id === index ? (
                      <button onClick={() => this.editTask(index)}>
                        update
                      </button>
                    ) : (
                      <button
                        onClick={() => this.toggleEdit(data.description, index)}
                      >
                        edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
