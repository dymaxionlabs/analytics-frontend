import React, { Component } from 'react'
import { Button, Form, Modal, Header } from 'semantic-ui-react'

class ContactForm extends Component {
    render() {
        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Input fluid label='Nombre' placeholder='Nombre' />
                    <Form.Input fluid label='Email' placeholder='Email' />
                    <Form.Input fluid label='Ciudad' placeholder='Ciudad' />
                </Form.Group>
                <Form.TextArea placeholder='Mensaje' />
                <Form.Button>Enviar</Form.Button>
            </Form>
        )
    }
}

class ModalContactForm extends Component {
    render() {
        return (
            <Modal trigger={<Button floated='left' hoverable>Confirmar</Button>} closeIcon>
                < Header content='Cotizar Imagenes' />
                <Modal.Content>
                    <ContactForm />
                </Modal.Content>
            </Modal >
        )
    }
}

export default ModalContactForm