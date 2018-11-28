import React, { Component } from 'react'
import { Button, List, Modal } from 'semantic-ui-react'


class ListDivided extends React.PureComponent {
    render() {

        return (

            <List divided relaxed>
                <List.Item>
                    <List.Icon name='pencil alternate' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Highlight Changes</List.Header>
                        <List.Description as='a'>View changes highlighted on images</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='car' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Cars</List.Header>
                        <List.Description as='a'>Cars, pickups, small vans and comper vans</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='truck' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Trucks</List.Header>
                        <List.Description as='a'>Large trucks, buses and semi-trailers</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='ship' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Ships</List.Header>
                        <List.Description as='a'>All maritime vessels, tankers, or container ships</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='boat' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Boats</List.Header>
                        <List.Description as='a'>Ships which are up tp 30 meters in length</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='plane' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Aircraft</List.Header>
                        <List.Description as='a'>Airplanes, not including helicopters</List.Description>
                    </List.Content>
                </List.Item>
                <List.Item>
                    <List.Icon name='box' size='large' verticalAlign='middle' />
                    <List.Content>
                        <List.Header as='a'>Cargo Containers</List.Header>
                        <List.Description as='a'>Intermodal containers in cargo terminals </List.Description>
                    </List.Content>
                </List.Item>
            </List>
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

export default ButtonCircule