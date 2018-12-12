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
            <div>
                <Popup
                    content={this.props.step}
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    size='mini'
                    className="controlPopup"
                    context={this.props.context}
                    position="relative"

                />
                <Popup

                    content={this.props.step}
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    size='mini'
                    context={this.props.context}
                    position='top left'

                />

                <Popup
                    content={this.props.step}
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    size='mini'
                    context={this.props.context}
                    position='top center'

                />
            </div>
        )
    }
}


export default Guide