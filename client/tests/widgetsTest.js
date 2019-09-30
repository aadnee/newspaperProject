// @flow

import * as React from 'react';
import { Component } from 'react-simplified';
import { Alert, NavBar, ListGroup, Row } from '../src/widgets.js';
import { shallow, mount } from 'enzyme';

describe('Alert tests', () => {
  const wrapper = shallow(<Alert />);

  it('initially', () => {
    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });

  it('after danger', done => {
    Alert.danger('test');

    setTimeout(() => {
      let instance: ?Alert = Alert.instance();
      expect(typeof instance).toEqual('object');
      if (instance) expect(instance.alerts).toEqual([{ text: 'test', type: 'danger' }]);

      expect(wrapper.find('button.close')).toHaveLength(1);

      done();
    });
  });

  it('after clicking close button', () => {
    wrapper.find('button.close').simulate('click');

    let instance: ?Alert = Alert.instance();
    expect(typeof instance).toEqual('object');
    if (instance) expect(instance.alerts).toEqual([]);

    expect(wrapper.find('button.close')).toHaveLength(0);
  });
});

describe('NavBarBrand tests', () => {
  const wrapper = shallow(
      <NavBar.Brand>
        Test
      </NavBar.Brand>
  );

  it('Sjekker at NavBar har Brand', () => {
    expect(wrapper.find('NavLink').hasClass('navbar-brand')).toEqual(true);
  });
});

describe('NavBarLink tests', () => {
  const wrapper = shallow(
      <NavBar.Link to={"test"}>
        Test
      </NavBar.Link>
  );

  it('Sjekker at NavBar har Link', () => {
    expect(wrapper.find('NavLink').hasClass('nav-link')).toEqual(true);
  });
});

describe('ListGroup-test', ()=>{
  const wrapper = shallow(
      <ListGroup.Item>
        <p>Test</p>
      </ListGroup.Item>
  );

  it('Sjekker at ListGroup-item har riktig klasse', ()=>{
    expect(wrapper.find('p').parent().hasClass('list-group-item')).toEqual(true);
  });
});

describe('Row-test', ()=>{
  const wrapper = shallow(
      <Row>
        Test
      </Row>
  );

  it('Sjekker at Row har riktig klasse', ()=>{
    expect(wrapper.find('div').hasClass('row')).toEqual(true);
  });
});