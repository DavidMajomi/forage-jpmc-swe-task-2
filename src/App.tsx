import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';
import { setInterval } from 'timers';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,     // Added showGrapgh as a property in preparation to add graph display functionality
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,     // Made showgraph initial state false until user clicks "Start Streaming Data"
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    if(this.state.showGraph){
      return (<Graph data={this.state.data}/>)    // Modified to rendeer graph only when the `showGraph` property is `true`
    }
  }

  /**
   * Get new data from server and update the state with the new data
   * Added modifications to ensure data is retrrieved continously using the `setInterval` method
   */
  getDataFromServer() {
    let x = 0;  // Counter to ensure to stop the interval process when necessary
    const interval = setInterval(() => {      
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server

        this.setState({
          data: serverResponds,
          showGraph: true,
        });
  
        // this.setState({ data: [...this.state.data, ...serverResponds] });
      });
      
      x++;

      if(x > 1000){
        clearInterval(interval);    // Stop the interval process once counter is over a 1000
      }


    },100);
    
    
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
