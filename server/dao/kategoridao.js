// @flow

const Dao = require("./dao.js");

module.exports = class kategoridao extends Dao{
  getAll(callback: (status: string, data: string) => mixed){
    super.query(
        "SELECT navn FROM kategori", [], callback
    );
  }
};