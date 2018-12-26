import { Popup, Grid } from 'semantic-ui-react'
import React, { Component } from 'react'


const stepText = {
    initial: "Escriba una ciudad o busque en el mapa un lugar",
    search_done: "Dibuje un polígono del área que desea analizar",
    polygon_drawn: "Seleccione una o más capas de análisis",
    layer_selected: "Si está de acuerdo con la selección, haga clic en Confirmar",
}

class Guide extends Component {

    geoRef = React.createRef()

    state = { isOpen: true }


    handleOpen = () => {
        this.setState({ isOpen: true })

    }

    handleClose = () => {
        this.setState({ isOpen: false })

    }

    render() {
        return (
            <div>
                <Popup
                    content={stepText[this.props.step]}
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    size='mini'
                    className={this.props.step}
                    context={this.props.context}
                    basic

                />

            </div>

        )
    }
}


export default Guide