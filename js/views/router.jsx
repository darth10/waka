import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route } from 'react-router-dom'
import { TransitionGroup, Transition } from 'react-transition-group'

import { UiStore } from '../stores/uiStore.js'

import Sign from './sign/index.jsx'
import Station from './station/index.jsx'
import Lines from './lines.jsx'
import Settings from './settings.jsx'
import Sponsor from './sponsor.jsx'
import TestLines from './test_lines.jsx'
import Timetable from './timetable.jsx'
import VehicleLocationBootstrap from './vehicle_loc_bootstrap.jsx'
import NoMatch from './nomatch.jsx'

class RouterRender extends React.Component {
  static propTypes = {
    location: PropTypes.object,
  }
  triggerStateUpdate = key => {
    return node => {
      if (node) {
        if (key === 'entered') {
          UiStore.state.exiting = window.location.pathname
        }
        UiStore.trigger('animation', [key, node])
      }
    }
  }
  render() {
    return (
      <TransitionGroup className="content">
        <Transition
          timeout={300}
          key={this.props.location.key}
          onEntering={this.triggerStateUpdate('entering')}
          onEntered={this.triggerStateUpdate('entered')}
          onExiting={this.triggerStateUpdate('exiting')}
          onExited={this.triggerStateUpdate('exited')}
        >
          <Switch location={this.props.location} key={this.props.location.key}>
            <Route path="/" exact />

            <Route
              path="/s/:region/:station/realtime/:trip_id"
              component={VehicleLocationBootstrap}
            />
            <Route
              path="/s/:region/:station/timetable/:route_name"
              component={Timetable}
            />
            <Route path="/sign/:region/:station" component={Sign} />
            <Route path="/s/:region/:station" component={Station} />

            <Route
              path="/l/:region/:line_id"
              component={VehicleLocationBootstrap}
            />
            <Route path="/l/:region" component={Lines} />

            <Route path="/settings" component={Settings} />
            <Route path="/sponsor" component={Sponsor} />
            <Route path="/testlines" component={TestLines} />
            <Route component={NoMatch} />
          </Switch>
        </Transition>
      </TransitionGroup>
    )
  }
}
const RouterRenderWithRouter = withRouter(RouterRender)
export default RouterRenderWithRouter
