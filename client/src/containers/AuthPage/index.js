/**
 *
 * AuthPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { get, map, replace, set } from 'lodash';
import { Link } from 'react-router-dom';

import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';

// Utils
import auth from '../../utils/auth';
import request from '../../utils/request';

import form from './forms.json';
import './styles.css';

class AuthPage extends React.Component {
  state = { value: {}, error: null};

  componentDidMount() {
    this.generateForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.authType !== this.props.match.params.authType) {
      this.generateForm(nextProps);
    }
  }

  getRequestURL = () => {
    let requestURL;

    switch (this.props.match.params.authType) {
      case 'login':
        requestURL = 'http://localhost:8000/api/auth/token';
        break;
      case 'register':
        requestURL = 'http://localhost:8000/api/users';
        break;
      case 'reset-password':
        requestURL = 'http://localhost:1337/auth/reset-password';
        break;
      case 'forgot-password':
        requestURL = 'http://localhost:1337/auth/forgot-password';
        break;
      default:
    }

    return requestURL;
  };

  generateForm = props => {
    const params = props.location.search
      ? replace(props.location.search, '?code=', '')
      : props.match.params.id;
    this.setForm(props.match.params.authType, params);
  };

  handleChange = ({ target }) =>
    this.setState({
      value: { ...this.state.value, [target.name]: target.value },
    });

  handleSubmit = e => {
    e.preventDefault();
    const body = this.state.value;
    const requestURL = this.getRequestURL();

    // This line is required for the callback url to redirect your user to app
    if (this.props.match.params.authType === 'forgot-password') {
      set(body, 'url', 'http://localhost:3000/auth/reset-password');
    }

    request(requestURL, { method: 'POST', body: this.state.value })
      .then(response => {
        auth.setToken(response.jwt, body.rememberMe);
        auth.setUserInfo(response.user, body.rememberMe);
        this.redirectUser();
      })
      .catch(err => {
        this.setState({ error: err.response.payload.errors.message});
      });
  };

  redirectUser = () => {
    this.props.history.push('/');
  };

  /**
   * Function that allows to set the value to be modified
   * @param {String} formType the auth view type ex: login
   * @param {String} email    Optionnal
   */
  setForm = (formType, email) => {
    const value = get(form, ['data', formType], {});

    if (formType === 'reset-password') {
      set(value, 'code', email);
    }
    this.setState({ value });
  };

  /**
   * Check the URL's params to render the appropriate links
   * @return {Element} Returns navigation links
   */
  renderLink = () => {
    if (this.props.match.params.authType === 'login') {
      return (
        <Message>
          {/*
          <Link to="/auth/forgot-password">Forgot Password</Link>
          &nbsp;or&nbsp;*/}
          <Link to="/auth/register">Register</Link>
        </Message>
      );
    }

    return (
      <Message>
        <Link to="/auth/login">Ready to signin</Link>
      </Message>
    );
  };

  getHeaderText = () => {
    let text;

    switch (this.props.match.params.authType) {
      case 'login':
        text = 'Login';
        break;
      case 'register':
        text = 'Register';
        break;
      case 'reset-password':
        text = 'Reset Password';
        break;
      case 'forgot-password':
        text = 'Forgot Password';
        break;
      default:
    }

    return text;
  }

  render() {
    const inputs = get(form, ['views', this.props.match.params.authType], []);
    const error = this.state.error;

    return (
      <div className="authPage">
        <div className='wrapper'>
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='teal' textAlign='center'>
                <Image src='/logo.png' /> {this.getHeaderText()}
              </Header>
              <Form size='large' onSubmit={this.handleSubmit}>
                <Segment stacked>
                {map(inputs, (input, key) => (
                  <Form.Input fluid 
                    icon={get(input, 'icon')} 
                    key={get(input, 'name')}
                    iconPosition='left' 
                    label={get(input, 'label')}
                    placeholder={get(input, 'placeholder')}  
                    onChange={this.handleChange}
                    name={get(input, 'name')}
                    value={get(this.state.value, get(input, 'name'), '')}
                    type={get(input, 'type')} />
                ))}
                {error != null && <div class='ui negative message'>
                  <p>{error}</p>
                </div>}

                  <Button color='teal' fluid size='large'>
                    Submit
                  </Button>
                </Segment>
              </Form>
              {this.renderLink()}
            </Grid.Column>
          </Grid> 
        </div>
        {/*
          <div className="headerContainer">
            {this.props.match.params.authType === 'register' ? (
              <span>Welcome !</span>
            ) : (
              <img src={Logo} alt="logo" />
            )}
          </div>
          <div className="headerDescription">
            {this.props.match.params.authType === 'register' ? (
              <span>Please register to access the app.</span>
            ) : (
              ''
            )}
          </div>
          <div className="formContainer" style={divStyle}>
            <div className="container-fluid">
              <FormDivider />
              <form onSubmit={this.handleSubmit}>
                <div className="row" style={{ textAlign: 'start' }}>
                  {map(inputs, (input, key) => (
                    <Input
                      autoFocus={key === 0}
                      customBootstrapClass={get(input, 'customBootstrapClass')}
                      didCheckErrors={this.state.didCheckErrors}
                      errors={get(
                        this.state.errors,
                        [
                          findIndex(this.state.errors, ['name', input.name]),
                          'errors',
                        ],
                        []
                      )}
                      key={get(input, 'name')}
                      label={get(input, 'label')}
                      name={get(input, 'name')}
                      onChange={this.handleChange}
                      placeholder={get(input, 'placeholder')}
                      type={get(input, 'type')}
                      validations={{ required: true }}
                      value={get(this.state.value, get(input, 'name'), '')}
                    />
                  ))}
                  <div className="col-md-12 buttonContainer">
                    <Button
                      label="Submit"
                      style={{ width: '100%' }}
                      primary
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="linkContainer">{this.renderLink()}</div>
        </div>
                      */}
      </div>
    );
  }
}

AuthPage.defaultProps = {};
AuthPage.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default AuthPage;
