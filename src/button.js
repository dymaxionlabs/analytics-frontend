import React, { Component } from 'react'
import { Button, Dropdown, Segment, TransitionablePortal, Header } from 'semantic-ui-react'




class ListDivided extends React.PureComponent {

    render() {
        const optionsConstruccion = [
            { key: 'construc', text: 'Construcción reciente', value: 'construc' },
            { key: 'techos', text: 'Techos', value: 'techos' },
            { key: 'piletas', text: 'Piletas', value: 'piletas' },
            { key: 'mancha', text: 'Mancha Urbano', value: 'mancha' },
            { key: 'asentamiento', text: 'Asentamiento Informales', value: 'asentamiento' },
            { key: 'area', text: 'Areas Verdes', value: 'area' },
            { key: 'calles', text: 'Calles', value: 'calles' },
            { key: 'imagen', text: 'Imagen Nocturna', value: 'imagen' },
        ]

        const optionsAgricultura = [
            { key: 'area sembrada', text: 'Área sembrada', value: 'area sembrada' },
            { key: 'area anegada', text: 'Área anegada', value: 'area anegada' },
            { key: 'pivotes', text: 'Pivotes', value: 'pivotes' },
            { key: 'simbolsa', text: 'Silobolsa', value: 'simbolsa' },
            { key: 'indice ndvi', text: 'Índice NDVI', value: 'indice ndvi' },
            { key: 'indice evi', text: 'Índice EVI', value: 'indice evi' },
        ]
        const optionsDatosDemograficos = [
            { key: 'asentamientos informales', text: 'Asentamientos informales', value: 'asentamientos informales' },
            { key: 'escuelas', text: 'Escuelas', value: 'escuelas' },
            { key: 'hospitales', text: 'Hospitales', value: 'hospitales' },
        ]


        return (
            <div>
                <Button.Group >
                    <Button>Desarrollo Urbano</Button>
                    <Dropdown options={optionsConstruccion} floating button className='icon' />
                </Button.Group>
                <div>
                    <Button.Group color=''>
                        <Button>Agricultura</Button>
                        <Dropdown options={optionsAgricultura} floating button className='icon' />
                    </Button.Group>
                </div>
                <div>
                    <Button.Group color=''>
                        <Button> Datos Demograficos </Button>
                        <Dropdown options={optionsDatosDemograficos} floating button className='icon' />
                    </Button.Group>
                </div>

            </div>
        );
    }
}

class ButtonCircule extends Component {
    state = { open: false }

    handleOpen = () => this.setState({ open: true })

    handleClose = () => this.setState({ open: false })

    render() {

        return (
            <TransitionablePortal
                closeOnTriggerClick
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                openOnTriggerClick
                trigger={
                    <Button
                        className='controlButton'
                        circular icon='osi' size="massive" color="blue"
                    />
                }
            >
                <Segment style={{ left: '02%', position: 'fixed', top: '50%', zIndex: 1000 }}>
                    <Header>
                        <ListDivided />
                    </Header>

                </Segment>
            </TransitionablePortal>
        )
    }
}



export default ButtonCircule