import React, { Component } from 'react'
import { Button, Dropdown, Segment, TransitionablePortal, Header } from 'semantic-ui-react'






class ListDivided extends React.PureComponent {

    render() {
        const optionsConstruccion = [
            { key: 'construc', icon: 'tree', text: 'Construcción reciente', value: 'construc' },
            { key: 'techos', icon: 'tree', text: 'Techos', value: 'techos' },
            { key: 'piletas', icon: 'tree', text: 'Piletas', value: 'piletas' },
            { key: 'mancha', icon: 'tree', text: 'Mancha Urbano', value: 'mancha' },
            { key: 'asentamiento', icon: 'tree', text: 'Asentamiento Informales', value: 'asentamiento' },
            { key: 'area', icon: 'tree', text: 'Areas Verdes', value: 'area' },
            { key: 'calles', icon: 'tree', text: 'Calles', value: 'calles' },
            { key: 'imagen', icon: 'tree', text: 'Imagen Nocturna', value: 'imagen' },
        ]

        const optionsAgricultura = [
            { key: 'area sembrada', icon: 'tree', text: 'Área sembrada', value: 'area sembrada' },
            { key: 'area anegada', icon: 'tree', text: 'Área anegada', value: 'area anegada' },
            { key: 'pivotes', icon: 'tree', text: 'Pivotes', value: 'pivotes' },
            { key: 'simbolsa', icon: 'tree', text: 'Silobolsa', value: 'simbolsa' },
            { key: 'indice ndvi', icon: 'tree', text: 'Índice NDVI', value: 'indice ndvi' },
            { key: 'indice evi', icon: 'tree', text: 'Índice EVI', value: 'indice evi' },
        ]
        const optionsDatosDemograficos = [
            { key: 'asentamientos informales', icon: 'tree', text: 'Asentamientos informales', value: 'asentamientos informales' },
            { key: 'escuelas', icon: 'tree', text: 'Escuelas', value: 'escuelas' },
            { key: 'hospitales', icon: 'tree', text: 'Hospitales', value: 'hospitales' },
        ]


        return (
            <div >
                <Button.Group >
                    <Button additionPosition="bottom">Desarrollo Urbano</Button>
                    <Dropdown className="ui" data-tooltip="Seleccione una o más capas de análisis" options={optionsConstruccion} floating button className='icon' />

                </Button.Group>
                <Button.Group additionPosition="bottom">
                    <Button >Agricultura </Button>
                    <Dropdown className="ui" data-tooltip="Seleccione una o más capas de análisis" options={optionsAgricultura} floating button className='icon' />
                </Button.Group>


                <Button.Group additionPosition="bottom">
                    <Button> Datos Demograficos </Button>
                    <Dropdown className="ui" data-tooltip="Seleccione una o más capas de análisis" options={optionsDatosDemograficos} floating button className='icon' />
                </Button.Group>


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

                    <Header >
                        <ListDivided />

                    </Header>

                </Segment>
            </TransitionablePortal>
        )
    }
}


export default ButtonCircule