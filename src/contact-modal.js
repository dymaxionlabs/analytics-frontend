import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons'
/* import axios from 'axios'

const ContactFormUrl = process.env.ContactFormUrl */
const ContactFormToken = process.env.ContactFormToken


const NameInput = ({ placeholder, value, requiredField, isValid, onChange }) => {
    const helpClassName = "help is-danger " + (isValid ? "is-hidden" : "")
    const inputClassName = "input " + (isValid ? "" : "is-danger")

    return (
        <div className="field">
            <div className="control is-expanded has-icons-left">
                <input name="name" className={inputClassName} type="text" placeholder={placeholder} value={value} onChange={onChange} required />
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faUser} />
                </span>
                <p className={helpClassName}>{requiredField}</p>
            </div>
        </div>
    )
}

const EmailInput = ({ placeholder, value, requiredField, isValid, onChange }) => {
    const helpClassName = "help is-danger " + (isValid ? "is-hidden" : "")
    const inputClassName = "input " + (isValid ? "" : "is-danger")

    return (
        <div className="field">
            <div className="control is-expanded has-icons-left">
                <input name="email" className={inputClassName} type="email" placeholder={placeholder} value={value} onChange={onChange} required />
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <p className={helpClassName}>{requiredField}</p>
            </div>
        </div>
    )
}


const MessageInput = ({ placeholder, value, requiredField, isValid, onChange }) => {
    const helpClassName = "help is-danger " + (isValid ? "is-hidden" : "")
    const inputClassName = "textarea " + (isValid ? "" : "is-danger")

    return (
        <div className="field">
            <div className="control">
                <textarea name="message" className={inputClassName} placeholder={placeholder} onChange={onChange} value={value} required></textarea>
            </div>
            <p className={helpClassName}>{requiredField}</p>
        </div>
    )
}

class ModalContactForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fields: {
                name: '',
                email: '',
                city: '',
                message: '',
            },
            validFields: {
                name: false,
                email: false,
                city: true,
                message: false,
            },
            isSubmitting: false,
            isValidated: false,
            showSuccessMessage: false,
            showErrorMessage: false,
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.isInvalid = this.isInvalid.bind(this)
    }

    handleInputChange(event) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        const isValid = (target.checkValidity() === true);

        this.setState({
            fields: {
                ...this.state.fields,
                [name]: value,
            },
            validFields: {
                ...this.state.validFields,
                [name]: isValid,
            },
            showSuccessMessage: false,
            showErrorMessage: false,
        })

        //console.log(`State: ${JSON.stringify(this.state)}`)
        //console.log(`is invalid: ${this.isInvalid()}`)
    }

    isInvalid() {
        for (let key in this.state.validFields) {
            if (!this.state.validFields[key]) {
                return true
            }
        }
        return false
    }

    handleSubmit(event) {
        event.preventDefault()

        this.setState({ isValidated: true })
        if (this.isInvalid()) return

        const params = { ...this.state.fields, _token: ContactFormToken }
        //console.log(`Params to submit: ${JSON.stringify(params)}`)

        this.setState({ isSubmitting: true })

        setTimeout(() => {
            this.setState({
                showSuccessMessage: true,
                fields: {
                    name: '',
                    email: '',
                    city: '',
                    message: '',
                },
                validFields: {
                    name: false,
                    email: false,
                    city: true,
                    message: false,
                },
                isValidated: false,
                isSubmitting: false,
            })
            this.props.onSubmitSuccess()
        }, 1000)

        /*  let that = this;
         axios.post(ContactFormUrl, params)
             .then(function (response) {
                 that.setState({
                     showSuccessMessage: true,
                     fields: {
                         name: '',
                         email: '',
                         city: '',
                         message: '',
                     },
                     validFields: {
                         name: false,
                         email: false,
                         city: true,
                         message: false,
                     },
                     isValidated: false,
                 })
                 this.props.onSubmitSuccess()
             })
             .catch(function (error) {
                 that.setState({ showErrorMessage: true })
             })
             .then(() => {
                 that.setState({ isSubmitting: false })
             }) */
    }

    render() {
        let submitClassName = "button button-background-color subtitle subtitle-color is-link"
        if (this.state.isSubmitting) {
            submitClassName += " is-loading"
        }
        const successMessageClassName = "notification is-success " +
            (this.state.showSuccessMessage ? "" : "is-hidden")
        const errorMessageClassName = "notification is-danger " +
            (this.state.showErrorMessage ? "" : "is-hidden")

        let modalClassName = "modal"
        if (this.props.isActive)
            modalClassName += " is-active"

        return (
            <form id="ventana">
                <div className={modalClassName}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Descargar Reporte</p>
                            <button className="delete" aria-label="close" onClick={this.props.onClose}></button>
                        </header>
                        <section className="modal-card-body">

                            <div className="columns">
                                <div className="column">
                                    <p className="color-black ">Por favor,complete el siguiente formulario</p>
                                    <div className={successMessageClassName}>
                                        <p className="subtitle-color">¡Gracias! Nos pondremos en contacto en la brevedad. Haz click <a download href={this.props.selectedFile} onClick={this.props.onClose}> Aqui </a> para descargar el reporte </p>

                                    </div>
                                    <div className={errorMessageClassName}>
                                        <p className="subtitle-color">Ha ocurrido un error. Por favor, inténtelo de nuevo más tarde.</p>

                                    </div>
                                    <div className="columns">
                                        <div className="column">
                                            <div className="field is-horizontal">
                                                <div className="field-body">
                                                    <NameInput
                                                        placeholder="Nombre"
                                                        requiredField={"Complete este campo."}
                                                        value={this.state.fields.name}
                                                        isValid={!this.state.isValidated || this.state.validFields.name}
                                                        onChange={this.handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="field is-horizontal">
                                                <div className="field-body">
                                                    <EmailInput
                                                        placeholder="Email"
                                                        requiredField={"Complete este campo."}
                                                        value={this.state.fields.email}
                                                        isValid={!this.state.isValidated || this.state.validFields.email}
                                                        onChange={this.handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="field is-horizontal">
                                                <div className="field-body">
                                                    <div className="field">
                                                        <p className="control">
                                                            <input className="input" type="email" placeholder="Ciudad">
                                                            </input>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <MessageInput
                                                placeholder="Mensaje"
                                                requiredField={"Complete este campo."}
                                                value={this.state.fields.message}
                                                isValid={!this.state.isValidated || this.state.validFields.message}
                                                onChange={this.handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div>
                            <footer className="modal-card-foot ">
                                <button className={submitClassName} disabled={this.state.isValidated && this.isInvalid()} onClick={this.handleSubmit} >Enviar </button>
                            </footer>
                        </div>
                    </div>
                </div>
                <input type="hidden" name="_landing" value={this.props.landing} />
                <input className="gotcha" type="text" name="_gotcha" />
            </form>
        )
    }
}

export default ModalContactForm