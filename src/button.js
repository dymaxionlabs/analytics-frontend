import React, { Component } from 'react'
import { Button, List, Modal } from 'semantic-ui-react'


class ListDivided extends React.PureComponent {


    render() {

        return (

            <List divided relaxed>
                <DesarrolloUrbano />
                <Agricultura />
                <DatosDemograficos />

            </List >
        );
    }
}


class ButtonCircule extends Component {
    state = { open: false }
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })

    render() {
        const { open, size } = this.state
        return (
            <Modal size={size} open={open} onClose={this.close} trigger={<Button className="controlButton" circular icon='osi' size="massive" color="blue" onClick={this.show('mini')} />} closeIcon>
                <Modal.Content>
                    <ListDivided />
                </Modal.Content>
            </Modal>
        );
    }
}



class DesarrolloUrbano extends Component {
    state = { open: false }
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })
    render() {
        const { open, size } = this.state
        return (
            <List.Item>
                <List.Icon name='truck' size='large' verticalAlign='middle' />
                <List.Content>
                    <Modal size={size} open={open} onClose={this.close} trigger={<List.Header as='a' size="massive" onClick={this.show('mini')}>Desarrollo Urbano</List.Header>} closeIcon>
                        <Modal.Content>
                            < List divided relaxed >
                                <List.Item as='li'>
                                    <List.List as='ul'>
                                        <List.Item as='li'>Construcción reciente/en curso</List.Item>
                                        <List.Item as='li'>Techos</List.Item>
                                        <List.Item as='li'>Piletas</List.Item>
                                        <List.Item as='li'>Mancha Urbano</List.Item>
                                        <List.Item as='li'>Asentamiento Informales</List.Item>
                                        <List.Item as='li'>Areas Verdes</List.Item>
                                        <List.Item as='li'>Calles</List.Item>
                                        <List.Item as='li'>Imagen nocturna</List.Item>
                                    </List.List>
                                </List.Item>
                            </List >
                        </Modal.Content>
                    </Modal>
                </List.Content>
            </List.Item>


        );
    }


}

class Agricultura extends Component {
    state = { open: false }
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })
    render() {
        const { open, size } = this.state
        return (

            <List.Item>
                <List.Icon name='car' size='large' verticalAlign='middle' />
                <List.Content>
                    <Modal size={size} open={open} onClose={this.close} trigger={<List.Header as='a' size="massive" onClick={this.show('mini')}>Agricultura</List.Header>} closeIcon>
                        <Modal.Content>
                            < List divided relaxed >
                                <List.List as='ul'>
                                    <List.Item as='li'>Área sembrada</List.Item>
                                    <List.Item as='li'>Área anegada</List.Item>
                                    <List.Item as='li'>Pivotes</List.Item>
                                    <List.Item as='li'>Silobolsa</List.Item>
                                    <List.Item as='li'>Índice NDVI</List.Item>
                                    <List.Item as='li'>Índice EVI</List.Item>
                                </List.List>
                            </List >
                        </Modal.Content>
                    </Modal>
                </List.Content>
            </List.Item>



        );
    }
}


class DatosDemograficos extends Component {
    state = { open: false }
    show = size => () => this.setState({ size, open: true })
    close = () => this.setState({ open: false })
    render() {
        const { open, size } = this.state

        return (

            <List.Item>
                <List.Icon name='pencil alternate' size='large' verticalAlign='middle' />
                <List.Content>
                    <Modal size={size} open={open} onClose={this.close} trigger={<List.Header as='a' size="massive" onClick={this.show('mini')}> Datos Demograficos </List.Header>} closeIcon>
                        <Modal.Content>
                            <List.Item as='li'>
                                <List.List as='ul'>
                                    <List.Item as='li'>Asentamientos informales</List.Item>
                                    <List.Item as='li'>Escuelas</List.Item>
                                    <List.Item as='li'>Hospitales</List.Item>
                                </List.List>
                            </List.Item>
                        </Modal.Content>
                    </Modal>
                </List.Content>
            </List.Item>


        );
    }


}


export default ButtonCircule