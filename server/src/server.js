// @flow

import path from 'path';
import reload from 'reload';
import fs from 'fs';

const express = require ("express");
const app = express();
let mysql = require("mysql");
let bodyParser = require("body-parser");
let apiRoutes = express.Router();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
const NyhetsDao = require("../dao/nyhetssakdao.js");
const KategoriDao = require("../dao/kategoridao.js");
const public_path = path.join(__dirname, '/../../client/public');
app.use(express.static(public_path));

type Request = express$Request;
type Response = express$Response;


let pool = mysql.createPool({
  connectionLimit: 2,
  host: "mysql.stud.iie.ntnu.no",
  user: "aadnees",
  password: "HnUcAoOT",
  database: "aadnees",
  debug: false
});

let nyhetsdao = new NyhetsDao(pool);
let kategoridao = new KategoriDao(pool);

app.get("/nyheter", (req : Request, res : Response) => {
  nyhetsdao.getViktighet1((status, data) => {
    res.status(status);
    res.json(data);
  });
});

app.get("/nyheter/newest", (req : Request, res : Response) => {
  nyhetsdao.getNewest((status, data) => {
    res.status(status);
    res.json(data);
  });
});

app.get("/nyheter/sortert/:sortOn", (req : Request, res : Response)=>{
    nyhetsdao.getAll(req.params.sortOn, (status, data) =>{
      res.status(status);
      res.json(data);
    });
});

app.get("/nyheter/:kategori", (req : Request, res : Response)=>{
  nyhetsdao.getKategori(req.params.kategori, (status, data) =>{
    res.status(status);
    res.json(data);
  });
});

app.get("/nyheter/:kategori/:sakId", (req : Request, res : Response) =>{
  nyhetsdao.getOne(req.params.sakId, (status, data) =>{
    res.status(status);
    res.json(data);
  });
});

app.post("/nyheter", (req : Request, res : Response) => {
  nyhetsdao.createOne(req.body, (status, data)=>{
    res.status(status);
    res.json(data);
  });
});

app.put("/nyheter/:category/:id", (req : Request, res : Response) =>{
  nyhetsdao.updateOne(req.body, (status, data) =>{
    res.status(status);
    res.json(data);
  });
});

app.delete("/nyheter/:category/:id", (req : Request, res : Response) =>{
  nyhetsdao.deleteOne(req.params.id, (status, data) =>{
    res.status(status);
    res.json(data);
  });
});

app.get("/kategorier", (req: Request, res: Response) => {
  kategoridao.getAll((status, data) => {
    res.status(status);
    res.json(data);
  });
});

app.listen(8080);
console.log(`Running server on port 8080`);