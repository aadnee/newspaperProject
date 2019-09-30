// @flow
/* eslint eqeqeq: "off" */

import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';

/**
 * Renders alert messages using Bootstrap classes.
 */
export class Alert extends Component {
  alerts: { text: React.Node, type: string }[] = [];

  render() {
    return (
      <>
        {this.alerts.map((alert, i) => (
          <div key={i} className={'alert alert-' + alert.type} role="alert">
            {alert.text}
            <button
              className="close"
              onClick={() => {
                this.alerts.splice(i, 1);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </>
    );
  }

  static success(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'success' });
    });
  }

  static info(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'info' });
    });
  }

  static warning(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'warning' });
    });
  }

  static danger(text: React.Node) {
    // To avoid 'Cannot update during an existing state transition' errors, run after current event through setTimeout
    setTimeout(() => {
      for (let instance of Alert.instances()) instance.alerts.push({ text: text, type: 'danger' });
    });
  }
}

export class Card extends Component<{ title: React.Node, children?: React.Node }> {
  render() {
    return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{this.props.title}</h5>
            <div className="card-text">{this.props.children}</div>
          </div>
        </div>
    );
  }
}

class ListGroupItem extends Component<{ to?: string, children: React.Node }> {
  render() {
    return this.props.to ? (
        <NavLink className="list-group-item" activeClassName="active" to={this.props.to}>
          {this.props.children}
        </NavLink>
    ) : (
        <li className="list-group-item">{this.props.children}</li>
    );
  }
}

/**
 * Renders a list group using Bootstrap classes
 */
export class ListGroup extends Component<{
  children: React.Element<typeof ListGroupItem> | (React.Element<typeof ListGroupItem> | null)[] | null
}> {
  static Item = ListGroupItem;

  render() {
    return <ul className="list-group">{this.props.children}</ul>;
  }
}

/**
 * Renders a row using Bootstrap classes
 */
export class Row extends Component<{ children: React.Node}> {
  render() {
    return <div className="row">{this.props.children}</div>;
  }
}

export class Layout extends Component <{children: React.Node}>{
  render() {
    return(
      <div className="col-sm-10 mx-auto">
        <Row width="100%">
          {this.props.children}
        </Row>
      </div>
    );
  }
}

/**
 * Renders a column with specified width using Bootstrap classes
 */
export class Column extends Component<{ width: number, children: React.Node }> {
  render() {
    return <div className={'col-sm-' + this.props.width}>{this.props.children}</div>;
  }
}

class NavBarBrand extends Component<{ children?: React.Node }> {
  render() {
    if (!this.props.children) return null;
    return (
        <NavLink style={{font: "400 50px/1.3 'Berkshire Swash', Helvetica, sans-serif",
          color: "white",
          textShadow: "4px 4px 0px rgba(0,0,0,0.1)"}} className="navbar-brand" activeClassName="active" exact to="/nyheter/page/1">
          {this.props.children}
        </NavLink>
    );
  }
}

//class NavBarDropdown extends Component

class NavBarLink extends Component<{ to: string, exact?: boolean, children?: React.Node}> {
  render() {
    if (!this.props.children) return null;
    return (
        <NavLink className={"nav-link"} activeClassName="active" exact={this.props.exact} to={this.props.to}>
          {this.props.children}
        </NavLink>
    );
  }
}

/**
 * Renders a navigation bar using Bootstrap classes
 */
export class NavBar extends Component<{ children: React.Element<typeof NavBarBrand | typeof NavBarLink>[]}> {
  static Brand = NavBarBrand;
  static Link = NavBarLink;

  render() {
    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark sticky-top">
          {this.props.children.filter(child => child.type == NavBarBrand)}
          <ul className="navbar-nav">{this.props.children.filter(child => child.type == NavBarLink)}</ul>
        </nav>
    );
  }
}

class ButtonSuccess extends Component<{
  onClick: () => mixed,
  children: React.Node
}> {
  render() {
    return (
        <button type="button" className="btn btn-success" onClick={this.props.onClick}>
          {this.props.children}
        </button>
    );
  }
}

class ButtonDanger extends Component<{
  onClick: () => mixed,
  children: React.Node
}> {
  render() {
    return (
        <button type="button" className="btn btn-danger float-right" onClick={this.props.onClick}>
          {this.props.children}
        </button>
    );
  }
}

class ButtonLight extends Component<{
  onClick: () => mixed,
  children: React.Node
}> {
  render() {
    return (
        <button type="button" className="btn btn-light" onClick={this.props.onClick}>
          {this.props.children}
        </button>
    );
  }
}

class ButtonInfo extends Component<{
  onClick: () => mixed,
  children: React.Node
}> {
  render() {
    return (
        <button type="button" className="btn btn-info float-right" onClick={this.props.onClick}>
          {this.props.children}
        </button>
    );
  }
}

/**
 * Renders a button using Bootstrap classes
 */
export class Button {
  static Success = ButtonSuccess;
  static Danger = ButtonDanger;
  static Light = ButtonLight;
  static Info = ButtonInfo;
}

class FormInput extends Component<{
  type: string,
  label: React.Node,
  value: mixed,
  onChange: (event: SyntheticInputEvent<HTMLInputElement>) => mixed,
  required?: boolean,
  pattern?: string
}> {
  render() {
    return (
        <div className="form-group row">
          <label className="col-sm-1 col-form-label">{this.props.label}</label>
          <div className="col-sm-11">
            <input
                className="form-control"
                type={this.props.type}
                value={this.props.value}
                onChange={this.props.onChange}
                required={this.props.required}
                pattern={this.props.pattern}
            />
          </div>
        </div>
    );
  }
}

/**
 * Renders simplified form elements using Bootstrap classes
 */
export class Form {
  static Input = FormInput;
}

