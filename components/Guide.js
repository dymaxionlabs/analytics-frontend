import { Popup, Button } from "semantic-ui-react";
import React, { Component } from "react";

const stepText = {
  initial: "Escriba una ciudad o busque en el mapa un lugar.",
  search_done: "Dibuje un polígono del área que desea analizar.",
  polygon_drawn: "Seleccione una o más capas de análisis.",
  layer_selected: "Si está de acuerdo con la selección, haga clic en Confirmar."
};

const stepPosition = {
  initial: "right center",
  search_done: "right center",
  polygon_drawn: "right center",
  layer_selected: "left center"
};

class Guide extends Component {
  state = { isOpen: true };

  render() {
    return (
      <Popup
        style={{ transition: "all 0.25s ease" }}
        content={stepText[this.props.step]}
        open={this.state.isOpen}
        size="large"
        className={this.props.step + " " + stepPosition[this.props.step]}
        position="top right"
      />
    );
  }
}

export default Guide;
