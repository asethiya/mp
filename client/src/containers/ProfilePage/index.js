import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import auth from '../../utils/auth';

class ProfilePage extends Component {

    render (){
        let userInfo = auth.getUserInfo();
        return (
            <List>
              <List.Item icon='users' content={userInfo.username} />
              <List.Item
                icon='mail'
                content={userInfo.email}
              />
            </List>
          )
    }

}

export default ProfilePage;