// @flow

import ReactDOM from 'react-dom';
import * as React from 'react';
import {Component} from 'react-simplified';
import {HashRouter, Route, NavLink, Redirect} from 'react-router-dom';
import {Alert, NavBar, ListGroup, Layout} from './widgets';
import {nyhetsService} from './services';
import {kategoriService} from './services';

// Reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');
  script.src = '/reload/reload.js';
  if (document.body) document.body.appendChild(script);
}

import createHashHistory from 'history/createHashHistory';

const history = createHashHistory();

class Menu extends Component {
  kategorier = [];

  render() {
    return (
        <NavBar>
          <NavBar.Brand>Lianytt</NavBar.Brand>
          <NavBar.Link to={"/nyheter/sport/page/1"}>Sport</NavBar.Link>
          <NavBar.Link to={"/nyheter/teknologi/page/1"}>Teknologi</NavBar.Link>
          <NavBar.Link to={"/nyheter/kultur/page/1"}>Kultur</NavBar.Link>
          <NavBar.Link to={"/nyheter/livsstil/page/1"}>Livsstil</NavBar.Link>
          <NavBar.Link to={"/registrer"}>Rediger/legg til</NavBar.Link>
        </NavBar>
    );
  }

  mounted() {
    kategoriService.getKategorier()
        .then(kat => (this.kategorier = kat));
  }
}

class Livefeed extends Component {
  sisteSaker = [];
  interval = null;

  render() {
    return (
        <div className="w-100">
          <marquee direction="left" scrollamount="8" style={{background: "#777"}} ref="marq"
                   onMouseOver={() => {this.refs.marq.stop()}}
                   onMouseOut={() => {this.refs.marq.start()}}>
            {this.sisteSaker.map(sak => (
                <NavLink style={{color: "white"}} key={sak.id} exact
                         to={'/nyheter/category/' + sak.kategori + '/' + sak.id}
                         className="mr-5 ml-5">
                  {sak.overskrift} - <span className={"font-italic"}>{sak.tidspunkt}</span>
                </NavLink>
            ))}
          </marquee>
        </div>
    )
  }

  mounted() {
    nyhetsService
        .getNewest()
        .then(sak => (this.sisteSaker = sak))
        .catch((error: Error) => Alert.danger(error.message));
    this.interval = setInterval(() => {
      nyhetsService
          .getNewest()
          .then(sak => (this.sisteSaker = sak))
          .catch((error: Error) => Alert.danger(error.message));
    }, 15000);
  }

  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

class Footer extends Component {
  render() {
    return (
        <footer className={"page-footer grey pt-4"}>
          <div className="container">
            <div className={"footer-copyright text-center text-muted"}>
              © 2018 Copyright: Ådne Eide Stavseng
            </div>
          </div>
        </footer>
    )
  }
}

class Redirection extends Component {
  render() {
    return (
        <Redirect to='/nyheter/page/1'/>
    )
  }
}

class Home extends Component <{ match: { params: { id: number } } }> {
  saker = [];
  start = 1;
  end = 1;
  next = 1;
  last = 1;

  render() {
    return (
        <div>
          <Livefeed/>
          <h1 className={"text-center"}>Siste nytt</h1>
          <Layout>
            {this.saker.map(sak => (
                <NavLink style={{color: "black"}} to={'/nyheter/category/' + sak.kategori + '/' + sak.id} key={sak.id}
                         className={"list-group-item col-4 mb-2"}>
                  {(sak.bilde != null) ?
                      (<img src={sak.bilde} alt={sak.overskrift} className="img-fluid"/>):(null)}
                  <h4>{sak.overskrift}</h4>
                </NavLink>
            ))}
          </Layout>
          <div className={"footer col-10 mx-auto"}>
            {(this.props.match.params.id != 1) ? (
                <button className={"btn float-left"}
                        onClick={() => {
                          history.push("/nyheter/page/" + (this.last));
                          this.mounted
                        }}>Forrige side
                </button>
            ) : (null)}
            {(this.saker.length >= 9) ? (
                <button className={"btn float-right"} onClick={() => {
                  history.push("/nyheter/page/" + (this.next));
                  this.mounted
                }}>Neste
                  side
                </button>) : (null)}
          </div>
        </div>);
  }

  mounted() {
    this.start = (this.props.match.params.id - 1) * 9;
    this.end = ((this.props.match.params.id) * 9);
    this.next = (Number)((Number)(this.props.match.params.id) + 1);
    this.last = (Number)((Number)(this.props.match.params.id) - 1);
    nyhetsService
        .getSakerViktighet1()
        .then(saker => {
          (this.saker = saker);
          this.saker = this.saker.slice(this.start, this.end)
        })
        .catch((error: Error) => Alert.danger(error.message));
  }
}

class Category extends Component <{ match: { params: { category: string, id: number } } }> {
  saker = [];
  start = 1;
  end = 1;
  next = 1;
  last = 1;

  render() {
    console.log(this.props.match.params.category);
    let kategoriNavn = this.props.match.params.category.charAt(0).toUpperCase() + this.props.match.params.category.slice(1);
    return (
        <div>
          <h2 className={"text-center"}>{kategoriNavn}</h2>
          <Layout>
            {this.saker.map(sak => (
                <li key={sak.id} className={"list-group-item mb-3 col-6"}>
                  <NavLink style={{color: "black"}} exact to={'/nyheter/category/' + sak.kategori + '/' + sak.id}>
                    <img src={sak.bilde} alt={sak.overskrift} className="img-fluid"/>
                    <h5>{sak.overskrift}</h5>
                  </NavLink>
                </li>
            ))}
            <div className={"row col-12"}>
              {(this.props.match.params.id != 1) ? (
                  <button className={"btn float-left"}
                          onClick={() => {
                            history.push("/nyheter/" + this.props.match.params.category + "/page/" + (this.last));
                            this.mounted
                          }}>Forrige side</button>
              ) : (null)}
              {(this.saker.length >= 6) ? (
                  <button className={"btn float-right"} onClick={() => {
                    history.push("/nyheter/" + this.props.match.params.category + "/page/" + (this.next));
                    this.mounted
                  }}>Neste
                    side
                  </button>) : (null)}

            </div>
          </Layout>
        </div>
    );
  }

  mounted() {
    this.start = (this.props.match.params.id - 1) * 6;
    this.end = ((this.props.match.params.id) * 6);
    this.next = (Number)((Number)(this.props.match.params.id) + 1);
    this.last = (Number)((Number)(this.props.match.params.id) - 1);
    nyhetsService
        .getSakerKategori(this.props.match.params.category)
        .then(sak => {
          (this.saker = sak);
          this.saker = this.saker.slice(this.start, this.end)
        })
        .catch((error: Error) => Alert.danger(error.message));
  }
}

class Article extends Component <{ match: { params: { id: number } } }> {
  sak = {
    id: this.props.match.params.id,
    overskrift: '',
    innhold: '',
    bilde: '',
    tidspunkt: '',
    kategori: '',
    viktighet: 1,
    forfatter: ''
  };

  render() {
    return (
        <div>
          <div className="col-sm-10 mx-auto">
            <div className="col-12">
              <h1 className={"text-center"}>{this.sak.overskrift}</h1>
            </div>
          </div>
          <div className="col-sm-8 mx-auto">
            {(this.sak.bilde != null) ? (<div className="text-center">
              <img src={this.sak.bilde} alt="bilde" className="img-fluid"/>
            </div>):(null)}
            <br/><br/>
            <span className={"text-muted"}>{this.sak.forfatter} <span
                className={"font-italic"}>- {this.sak.tidspunkt}</span></span>
            <p>{this.sak.innhold.split("\n").map(paragraf => (
                <p>
                  {paragraf}
                </p>
            ))}</p>
          </div>
        </div>
    )
  }

  mounted() {
    nyhetsService
        .getSak(this.props.match.params.id)
        .then(sak => (this.sak = sak[0]))
        .catch((error: Error) => Alert.danger(error.message));
  }
}

class Register extends Component {
  saker = [];

  render() {
    return (
        <div className="offset-2 col-8">
          <h1 className={"text-center"}>Rediger/legg til</h1>
          <button onClick={() => history.push("/registrerSak")} className={"btn btn-info mb-2"}>Registrer ny sak
          </button>
          <ListGroup>
            {this.saker.map(sak => (
                <ListGroup.Item key={sak.id}>
                  <strong>{sak.overskrift}</strong>, <span
                    className={"text-muted"}>{sak.forfatter} - {sak.tidspunkt}</span>
                  <button type="button" onClick={() => this.delete(sak.id)}
                          className={"btn btn-danger float-right ml-2"}>Slett
                  </button>
                  <button type="button" onClick={() => this.edit(sak.id)}
                          className={"btn btn-info float-right"}>Rediger
                  </button>
                </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
    )
  }

  delete(id) {
    if (confirm("Vil du slette denne saken?")) {
      if (nyhetsService.deleteSak(id)) {
        Alert.success("Saken ble slettet");
        this.mounted();
      }
      else Alert.danger("Noe gikk galt");
    } else return false;
  }

  edit(id) {
    history.push("/redigerSak/" + id);
  }

  mounted() {
    nyhetsService
        .getAll("overskrift")
        .then(sak => (this.saker = sak))
        .catch((error: Error) => Alert.danger(error.message));
  }
}

class RegisterArticle extends Component {
  kategorier = [];
  sak = {
    overskrift: '',
    innhold: '',
    bilde: '',
    kategori: '',
    viktighet: 1,
    forfatter: ''
  };
  form = null;

  render() {
    return (

        <div className={"offset-3 col-md-6"}><br/>
          <label htmlFor="Bildevisning">Forhåndsvisning av bilde:</label>
          <div className="container" style={{height: "300px"}}>
            <img src={this.sak.bilde} style={{maxHeight: "250px"}} className={"img-fluid m-3"} alt=""/><br/>
          </div>
          <br/>
          <form action="" ref={e => (this.form = e)}>
            <label htmlFor="ArticleAuthor">Navn:</label>
            <input type="text"
                   placeholder={"Navn"}
                   className="form-control"
                   id="authorName"
                   required
                   onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.forfatter = event.target.value)}/>
            <label htmlFor="artikkelBilde">Hovedbilde (link):</label>
            <input type="text"
                   className="form-control"
                   placeholder={"Bildelink"}
                   id={"bildeInput"}
                   onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.bilde = event.target.value)}/>
            <label htmlFor="overskrift">Overskrift:</label>
            <input type="text"
                   className="form-control"
                   placeholder={"Overskrift"}
                   id={"overskrift"}
                   required
                   onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.overskrift = event.target.value)}/>
            <label htmlFor="artikkel">Artikkel:</label>
            <textarea type="text"
                      placeholder={"Artikkel"}
                      className="form-control input"
                      id="articleInput"
                      rows="5"
                      required
                      onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.innhold = event.target.value)}/>
            <label htmlFor="kategori">Kategori:</label>
            <div className={"form-group"}>
              <select className="form-control"
                      id="valgtKategori"
                      required
                      onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.kategori = event.target.value)}>
                <option value="" hidden>Velg kategori</option>
                {this.kategorier.map(kat => (
                    <option value={kat.navn}> {kat.navn}</option>
                ))}
              </select>
            </div>
            <label htmlFor="viktighet">Viktighet:</label>
            <div className="form-group">
              <select className="form-control"
                      id="valgtViktighet"
                      required
                      onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.viktighet = Number(event.target.value))}>
                <option value="" hidden>Velg viktighet</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <button className={"btn btn-info m-2"} id="submitArticle" onClick={this.submit}>Publiser</button>
            <button type="button" className={"btn btn-danger m-2"} onClick={() => history.goBack()}>Avbryt</button>
          </form>
        </div>
    )
  }

  submit() {
    if (!this.form || !this.form.checkValidity()) {
      return Alert.danger("Alle feltene må fylles ut");
    } else {
      //$FlowFixMe
      if (nyhetsService.createSak(this.sak)) {
        Alert.success("Saken ble opprettet");
        if (this.sak.kategori != "siste_nytt") {
          history.push("/nyheter/" + this.sak.kategori + "/page/1");
        } else {
          history.push("/nyheter/page/1");
        }
      }
    }
  }

  mounted() {
    kategoriService
        .getKategorier()
        .then(kat => (this.kategorier = kat));
  }
}

class EditArticle extends Component<{ match: { params: { id: number } } }> {
  kategorier = [];
  sak = {
    overskrift: '',
    innhold: '',
    bilde: '',
    kategori: '',
    viktighet: 1,
    forfatter: '',
    id: this.props.match.params.id
  };

  render() {
    console.log(this.sak);
    return (
        <div className={"offset-3 col-md-6"}>
          <label htmlFor="Bildevisning">Forhåndsvisning av bilde:</label>
          <div className="container" style={{maxHeight: "300px"}}>
            <img src={this.sak.bilde} style={{maxHeight: "250px"}} className={"img-fluid m-3"} alt=""/><br/>
          </div>
          <label htmlFor="ArticleAuthor">Navn:</label>
          <input type="text"
                 placeholder={"Navn"}
                 className="form-control"
                 id="authorName"
                 value={this.sak.forfatter}
                 required
                 onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.forfatter = event.target.value)}/>
          <label htmlFor="artikkelBilde">Hovedbilde (link):</label>
          <input type="text"
                 className="form-control"
                 placeholder={"Bildelink"}
                 id={"bildeInput"}
                 value={this.sak.bilde}
                 required
                 onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.bilde = event.target.value)}/>
          <label htmlFor="overskrift">Overskrift:</label>
          <input type="text"
                 className="form-control"
                 placeholder={"Overskrift"}
                 id={"overskrift"}
                 required
                 value={this.sak.overskrift}
                 onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.overskrift = event.target.value)}/>
          <label htmlFor="artikkel">Artikkel:</label>
          <textarea type="text"
                    placeholder={"Artikkel"}
                    className="form-control input"
                    id="articleInput"
                    rows="5"
                    required
                    value={this.sak.innhold}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.innhold = event.target.value)}/>
          <label htmlFor="kategori">Kategori:</label>
          <div className={"form-group"}>
            <select className="form-control"
                    id="valgtKategori"
                    value={this.sak.kategori}
                    required
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.kategori = event.target.value)}>
              <option value="" hidden>Velg kategori</option>
              {this.kategorier.map(kat => (
                  <option key={kat.navn} value={kat.navn}> {kat.navn}</option>
              ))}
            </select>
          </div>
          <label htmlFor="viktighet">Viktighet:</label>
          <div className="form-group">
            <select className="form-control"
                    id="valgtViktighet"
                    required
                    value={this.sak.viktighet}
                    onChange={(event: SyntheticInputEvent<HTMLInputElement>) => (this.sak.viktighet = Number(event.target.value))}>
              <option value="" hidden>Velg viktighet</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <button type="button" className={"btn btn-info m-2"} onClick={this.submit}>Oppdater</button>
          <button type="button" className={"btn btn-danger m-2"} onClick={() => history.goBack()}>Avbryt</button>
        </div>
    )
  }

  submit() {
    //$FlowFixMe
    nyhetsService.updateSak(this.sak);
    if (this.sak.kategori != "siste_nytt") {
      history.push("/nyheter/" + this.sak.kategori + "/page/1");
    } else {
      history.push("/nyheter/page/1");
    }
  }

  mounted() {
    kategoriService.getKategorier()
        .then(kat => (this.kategorier = kat));
    nyhetsService
        .getSak(this.props.match.params.id)
        .then(sak => (this.sak = sak[0]))
        .catch((error: Error) => Alert.danger(error.message));
  }
}

const root = document.getElementById('root');
if (root)
  ReactDOM.render(
      <HashRouter>
        <div>
          <Alert/>
          <Menu/>
          <Route exact path="/" component={Redirection}/>
          <Route exact path="/#/" component={Redirection}/>
          <Route exact path="/nyheter/page/:id" component={Home}/>
          <Route exact path="/nyheter/:category/page/:id" component={Category}/>
          <Route exact path="/nyheter/category/:category/:id" component={Article}/>
          <Route exact path="/registrer" component={Register}/>
          <Route exact path="/registrerSak" component={RegisterArticle}/>
          <Route exact path="/redigerSak/:id" component={EditArticle}/>
          <Footer/>
        </div>
      </HashRouter>,
      root
  );
