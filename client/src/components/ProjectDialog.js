import React, { Component } from 'react'
import { Button, Icon, Modal, Form } from 'semantic-ui-react'
import { get, map} from 'lodash';
import auth from '../utils/auth';

class ProjectDialog extends Component {
  state = { open: false, project: {
      bidEnds: new Date()
  } }

  open = () => this.setState({ open: true })
  close = () => {
      //create the project
      let project = this.state.project;

      let fetchOptions = {
        method: 'POST', 
        body: JSON.stringify(project),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.getToken()}` 
        }

      }

      fetch("http://localhost:8000/api/projects", fetchOptions)
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
      project: { ...this.state.project, [target.name]: target.value },
    });

  render() {
    const { open } = this.state;

    const inputs = [
        {name: 'title', label: 'Title', type: 'text'},
        {name: 'description', label: 'Description', type: 'text'},
        {name: 'budget', label: 'Budget', type: 'text'},
        {name: 'completeBy', label: 'Complete By', type: 'text'},
        {name: 'bidEnds', label: 'Bid Ends', type: 'text'}
    ]

    return (
      <Modal
        open={open}
        onOpen={this.open}
        onClose={this.close}
        size='small'
        trigger={
            <Button primary icon>
              Create Project <Icon name='right chevron' />
            </Button>
          }
      >
        <Modal.Header>Create Project</Modal.Header>
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
                    value={get(this.state.project, get(input, 'name'), '')}
                    type={get(input, 'type')} />
                ))}
              </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button icon='check' content='Create' onClick={this.close} />
        </Modal.Actions>
      </Modal>
    )
  }
}

export default ProjectDialog