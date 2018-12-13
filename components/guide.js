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
            <Grid.Row>
                <Grid.Column>
                    <div >
                        <Popup
                            content={this.props.step}
                            open={this.state.isOpen}
                            onClose={this.handleClose}
                            onOpen={this.handleOpen}
                            size='mini'
                            className="controlPopup"
                            context={this.props.context}
                            style={styleInitial}
                        // position='top center'



                        />
                    </div>
                </Grid.Column>
                <Grid.Column>
                    <Popup
                        className="popupLeft"
                        content={this.props.stepSearch}
                        open={this.state.isOpen}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        size='mini'
                        context={this.props.context}
                        style={styleSearch}

                    />
                </Grid.Column>
                <Popup
                    className="popupLeftPolygon"
                    content={this.props.stepPolygon}
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    size='mini'
                    context={this.props.context}
                    style={stylePolygon}
                    pointing="left"



                />
            </Grid.Row>
        )
    }
}


export default Guide