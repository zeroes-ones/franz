import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Invite from '../../components/auth/Invite';
import { gaPage } from '../../lib/analytics';
import { defineMessages, intlShape } from 'react-intl';

const messages = defineMessages({
  headline: {
    id: 'settings.invite.headline',
    defaultMessage: '!!!Invite Friends',
  },
});

@inject('stores', 'actions') @observer
export default class InviteScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    gaPage('Settings/Invite');
  }


  componentWillUnmount () {
    this.props.stores.user.inviteRequest.reset()
  }

  render() {
    const { actions, location } = this.props;
    const { user } = this.props.stores;

    const isLoadingInvite = user.inviteRequest.isExecuting;
    const isInviteSuccessful = user.inviteRequest.wasExecuted && !user.inviteRequest.isError;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{this.context.intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body invite__form">
          <Invite
            onSubmit={actions.user.invite}
            // status={user.actionStatus} // not needed
            isLoadingInvite={user.inviteRequest.isExecuting}
            isInviteSuccessful={user.inviteRequest.wasExecuted && !user.inviteRequest.isError}        
            from={location.query.from}
            embed={true}
            success={location.query.success}
          />
        </div>
      </div>
    );
  }
}

InviteScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.shape({
      invite: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      from: PropTypes.string,
    }),
  }).isRequired,
};