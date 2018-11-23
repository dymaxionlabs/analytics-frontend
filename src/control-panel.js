import React from 'react';

class ControlPanel extends React.PureComponent {

  render() {
    return (
      <div className="columns ">
        <div className="column " >
          <p className="Line-control">0.83km </p>
          <p className="Control"> area size </p>
          <p className="Line-control">Cars, Ships, Boats</p>
          <p className="Control Line-control"> selected analyses</p>
        </div>
        <div className="columns">
          <div className="column control">
            <button> cancelar </button>
          </div>
          <div className="column control">
            <button> confirmar </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlPanel
