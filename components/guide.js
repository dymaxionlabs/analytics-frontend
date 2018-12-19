import { Popup, Grid } from 'semantic-ui-react'
import React, { Component } from 'react'


const styleInitial = {
    borderRadius: 0,
    padding: '1em',
    margin: "10px",
}

const styleSearch = {
    borderRadius: 0,
    padding: '0em',
    margin: "70px",

}

const stylePolygon = {
    borderRadius: 0,
    padding: '1em',
    margin: "500px",

}

const stepText = {
    initial: " Escriba una ciudad o busque en el mapa un lugar ",
    search_done: "Dibuje un polígono del área que desea analizar",
    polygon_drawn: "Seleccione una o más capas de análisis",
    layer_selected: "Si está de acuerdo con la selección, haga clic en Confirmar",
}

class Guide extends Component {



    state = { isOpen: true }


    handleOpen = () => {
        this.setState({ isOpen: true })

    }

    handleClose = () => {
        this.setState({ isOpen: false })

    }

    render() {
        return (
            <div >
                <Popup
                    content={stepText[this.props.step]}
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    size='mini'
                    className={"initial" + this.props.step}
                    context={this.props.context}
                    style={styleInitial}
                    // position="top right"
                    position='top center'


                />
            </div>

        )
    }
}


export default Guide