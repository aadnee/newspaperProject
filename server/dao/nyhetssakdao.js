// @flow
const Dao = require("./dao.js");

module.exports = class NyhetssakDao extends Dao {

  getAll(orderBy: string, callback: (status: number, data: string) => mixed){
    super.query(
        `SELECT id, kategori, overskrift, DATE_FORMAT(tidspunkt, "%Y.%c.%d %H:%i")AS tidspunkt, viktighet, forfatter FROM nyhetssak ORDER BY ${orderBy}`,
        [],
        callback
    );
  }

  getOne(id: string, callback: (status: number, data: string) => mixed) {
    super.query(
        "SELECT id, overskrift, innhold, DATE_FORMAT(tidspunkt, \"%Y.%c.%d %H:%i\")AS tidspunkt, bilde, kategori, viktighet, forfatter FROM nyhetssak WHERE id = ?",
        [id],
        callback
    );
  }

  getViktighet1(callback: (status: number, data: string) => mixed){
    super.query(
        "SELECT * FROM nyhetssak WHERE viktighet = 1 ORDER BY id DESC ",
        [],
        callback
    );
  }

  getKategori(kategori: string, callback: (status: number, data: string) => mixed){
    super.query(
        "SELECT * FROM nyhetssak WHERE kategori = ? ORDER BY id DESC ",
        [kategori],
        callback
    );
  }

  getNewest(callback: (status: number, data: string) => mixed){
    super.query(
        "SELECT id, kategori, overskrift, DATE_FORMAT(tidspunkt, \"%Y.%c.%d %H:%i\")AS tidspunkt, viktighet, forfatter FROM nyhetssak ORDER BY id DESC LIMIT 5",
        [],
        callback
    )
}


  createOne(json: Object, callback: (status: number, data: string) => mixed){
    var val = [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, json.forfatter];
    super.query(
        "INSERT INTO nyhetssak(overskrift, innhold, bilde, kategori, viktighet, forfatter) VALUES (?,?,?,?,?,?)",
        val,
        callback
    );
  }

  updateOne(json: Object, callback: (status: number, data: string) => mixed){
    var val = [json.overskrift, json.innhold, json.bilde, json.kategori, json.viktighet, json.id];
    super.query(
        "UPDATE nyhetssak SET overskrift = ?, innhold =?, bilde = ?, kategori=?, viktighet=? WHERE id = ?",
        val,
        callback
    );
  }

  deleteOne(id: string, callback: (status: number, data: string) => mixed){
    super.query(
        "DELETE FROM nyhetssak WHERE id = ?",
        [id],
        callback
    );
  }
}