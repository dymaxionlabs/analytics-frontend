import { Popup } from 'semantic-ui-react'
import React, { Component } from 'react'


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
            <Popup
                content={"Escriba una ciudad o busque en el mapa un lugar"}
                open={this.state.isOpen}
                onClose={this.handleClose}
                onOpen={this.handleOpen}
                size='mini'
                className="controlPopup"
                context={this.props.context}
                position="relative"

            />
        )
    }
}


export default Guide