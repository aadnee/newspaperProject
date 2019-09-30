var mysql = require("mysql");

const runsqlfile = require('./runsqlfile.js');
const nyhetsDao = require('./nyhetssakdao.js');

// GitLab CI Pool
let testPool = mysql.createPool({
  connectionLimit: 1,
  host: "mysql.stud.iie.ntnu.no",
  user: "aadnees",
  password: "HnUcAoOT",
  database: "aadnees",
  debug: false,
  multipleStatements: true
});

let rootPool = mysql.createPool({
  connectionLimit: 1,
  host: "mysql",
  user: "root",
  password: "root",
  database: "School",
  debug: false,
  multipleStatements: true
});

let nyhetssakdao = new nyhetsDao(rootPool);


beforeAll(done => {
  runsqlfile("dao/create_tables.sql", rootPool, () => {
    runsqlfile("dao/create_testdata.sql", rootPool, done);
  });
});

afterAll(()=>{
  rootPool.end();
});

test("Get all articles from database", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.length).toBe(2);
    done();
  }
  nyhetssakdao.getAll("id", callback);
});

test("Get all articles from database with importance 1", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.length).toBe(2);
    done();
  }
  nyhetssakdao.getViktighet1(callback);
});

test("Get all articles from database from one category", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.length).toBe(1);
    done();
  }
  nyhetssakdao.getKategori("teknologi", callback);
});

test("Add one article to database", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.affectedRows).toBeGreaterThanOrEqual(1);
    done();
  }

  nyhetssakdao.createOne(
      {
        overskrift: "Overskrift",
        innhold: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid assumenda beatae dolore eligendi, illo incidunt modi, molestiae mollitia non obcaecati odio totam voluptatibus. Blanditiis deleniti deserunt mollitia nihil voluptate!",
        bilde: "null",
        kategori: "Kultur",
        viktighet: 2,
        forfatter: "Test"
      }, callback);
});

test("Get one article from database", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.length).toBe(1);
    expect(data[0].overskrift).toBe("Pengedrama i regjeringen");
    done();
  }

  nyhetssakdao.getOne(1, callback);
});

test("Create one article in database", done=>{
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.createOne({
    overskrift: "Overskrift",
    innhold: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid assumenda beatae dolore eligendi, illo incidunt modi, molestiae mollitia non obcaecati odio totam voluptatibus. Blanditiis deleniti deserunt mollitia nihil voluptate!",
    bilde: "null",
    kategori: "kultur",
    viktighet: 2,
    forfatter: "Test"
  }, callback);
});

test("Update one article in database", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.updateOne({
    overskrift: "Overskrift",
    innhold: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquid assumenda beatae dolore eligendi, illo incidunt modi, molestiae mollitia non obcaecati odio totam voluptatibus. Blanditiis deleniti deserunt mollitia nihil voluptate!",
    bilde: "null",
    kategori: "kultur",
    viktighet: 2,
    forfatter: "Test",
    id: 1
  }, callback);
});

test("Delete one article from database", done => {
  function callback(status, data) {
    console.log(`Test callback: status: ${status}, data: ${JSON.stringify(data)}`);
    expect(data.affectedRows).toBe(1);
    done();
  }

  nyhetssakdao.deleteOne(1, callback)
});



