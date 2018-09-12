import React, { Component } from 'react'
import { Button, Modal, Form } from 'semantic-ui-react'
import { get, map} from 'lodash';
import auth from '../utils/auth';

class ProjectDialog extends Component {
  state = { open: false, amount: 0 }

  componentDidMount() {
    this.setState({amount: this.props.project.budget});
  }

  open = () => this.setState({ open: true })
  close = () => {
      let project = this.props.project;

      let fetchOptions = {
        method: 'POST', 
        body: JSON.stringify({amount: this.state.amount}),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.getToken()}` 
        }

      }

      fetch(`http://localhost:8000/api/projects/bid/${project._id}`, fetchOptions)
      .then(res => res.json())
      .then(
        (result) => {
            this.setState({ open: false })
            //call props close
            this.props.onClose(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
        
      )

    }

    handleChange = ({ target }) =>
    this.setState({
      amount: target.value ,
    });

  render() {
    const { open } = this.state;

    const inputs = [
        {name: 'amount', label: 'Amount', type: 'text'}
    ]

    let project = this.props.project;

    return (
      <Modal
        open={open}
        onOpen={this.open}
        onClose={this.close}
        size='small'
        trigger={
          <Button floated='right' basic color='green'>
            Bid
          </Button>
          }
      >
        <Modal.Header>{`Bidding On: ${project.title}`}</Modal.Header>
        <Modal.Content>
        <Form size='large'>
                {map(inputs, (input) => (
                  <Form.Input fluid 
                    icon={get(input, 'icon')} 
                    key={get(input, 'name')}
                    iconPosition='left' 
                    label={get(input, 'label')}
                    placeholder={get(input, 'placeholder')}  
                    onChange={this.handleChange}
                    name={get(input, 'name')}
                    value={get(this.state, get(input, 'name'), '')}
                    type={get(input, 'type')} />
                ))}
              </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button icon='check' content='Submit Bid' onClick={this.close} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ProjectDialog