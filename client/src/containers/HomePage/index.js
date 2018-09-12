/**
 *
 * HomePage
 */

import React from 'react';
import PropTypes from 'prop-types';

import {Container, Image, Menu, Button} from 'semantic-ui-react';
import { NavLink, withRouter, Switch, Route} from 'react-router-dom'
import auth from '../../utils/auth';
import ProjectsPage from '../ProjectsPage';
import ProfilePage from '../ProfilePage';

import './styles.css';

class HomePage extends React.Component {
  rensder() {
    return (
      <div style={{ marginTop: '15%' }}>
        <h1>You're now logged in!!!</h1>
        <div style={{ marginTop: '50px' }}>
          <Button
            primary
            onClick={() => {
              auth.clearAppStorage();
              this.props.history.push('/auth/login');
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
      <Menu className='header' fixed='top' inverted>
      <Container>
        <Menu.Item header>
          <Image
            size='mini'
            src='logo.png'
            style={{ marginRight: '1.5em' }}
          />
          Marketplace
        </Menu.Item>

        <Menu.Item as={NavLink} exact to="/" content="Projects"/>
        <Menu.Item as={NavLink} to="/profile" content="Profile"/>

        {/*user && (
          <Menu.Menu position="right">
            <Menu.Item name={user.name} content={user.name}/>
          </Menu.Menu>
        )*/}

        <Menu.Menu position='right'>
            <Menu.Item
              name='Logout'
              onClick={() => {
                auth.clearAppStorage();
                this.props.history.push('/auth/login');
              }}
            />
          </Menu.Menu>

      </Container>
    </Menu>
    <div className='content'>
    <Switch>
      <Route path="/" component={ProjectsPage} exact/>
      <Route path="/profile" component={ProfilePage} />
    </Switch>
    </div>
  </div>
    );
  }
  

}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(HomePage);
