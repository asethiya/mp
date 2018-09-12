import React, { Component } from 'react';
import {Card, Image, Icon, List, Message } from 'semantic-ui-react';
import ProjectDialog from '../../components/ProjectDialog';
import BidDialog from '../../components/BidDialog';

class ProjectsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          projects: []
        };
      }
    

    componentDidMount() {
    fetch("http://localhost:8000/api/projects")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            projects: result
          });
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

    render (){
        let {projects} = this.state;
        return (
            <Card.Group>
                <Card>
                    <Card.Content>
                    <Card.Header>Add a new project</Card.Header>
                    <Card.Description>
                        <ProjectDialog onClose={(project)=> this.setState({projects: [project, ...projects]})}/>
                    </Card.Description>
                    </Card.Content>
                </Card>
                {projects.map((project) => {
            return <Card key={project._id}>
            <Card.Content>
                <Image floated='right' size='mini' src='https://picsum.photos/200/?random' />
                <Card.Header>{project.title}</Card.Header>
                <Card.Meta>
                <List>
                    <List.Item icon='users' content={project.owner_id} />
                    <List.Item icon='dollar sign' content={project.budget} />
                    <List.Item icon='calendar alternate' content={project.completeBy}/>
                    <List.Item icon='money bill alternate' content={project.winningBid?  project.winningBid.amount: 'None'}/>
                    <List.Item icon='handshake' content={project.totalBids} />
                    </List>
                </Card.Meta>
                <Card.Description>
                    {project.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                { project.status === 'Auction' && <span><Icon name='stopwatch'/>{project.bidEnds}</span>}
                { project.status === 'Auction' &&
                    <BidDialog project={project} onClose={(updatedProject)=> {
                        let index = projects.indexOf(project);
                        let updatedProjects = [
                            ...projects.slice(0, index),
                            updatedProject,
                            ...projects.slice(index + 1),
                        ]
                        this.setState({projects: updatedProjects})
                        }
                    }/>
                }
                 { project.status !== 'Auction' &&
                    <Message>
                        {project.status}
                    </Message>
                 }
            </Card.Content>
        </Card>
                })}

  </Card.Group>
        )
}
}

export default ProjectsPage;