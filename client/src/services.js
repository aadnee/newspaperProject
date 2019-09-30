// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Sak {
  id: number;
  overskrift: string;
  innhold: string;
  bilde: string;
  tidspunkt: string;
  kategori: string;
  viktighet: number;
  forfatter: string;
}

class Kategori{
  navn: string;
}


class NyhetsService {
  getSak(id: number): Promise<Sak[]>{
    return axios.get('/nyheter/kategori/' + id);
  }

  getAll(sorter: string): Promise<Sak[]>{
    return axios.get('/nyheter/sortert/' + sorter);
  }

  getSakerViktighet1(): Promise<Sak[]>{
    return axios.get('/nyheter');
  }

  getSakerKategori(kategori: string): Promise<Sak[]>{
    return axios.get('/nyheter/'+ kategori);
  }

  createSak(sak: Sak): Promise<void>{
    return axios.post("/nyheter", sak);
  }

  updateSak(sak: Sak): Promise<void>{
    console.log(sak);
    return axios.put("/nyheter/kategori/" + sak.id, sak);
  }

  deleteSak(id: number): Promise<void>{
    return axios.delete("/nyheter/kategori/" + id);
  }

  getNewest(): Promise<Sak[]>{
    return axios.get("/nyheter/newest");
  }
}

class KategoriService{
  getKategorier(): Promise<Kategori[]>{
    return axios.get('/kategorier');
  }
}

export let nyhetsService = new NyhetsService();
export let kategoriService = new KategoriService();
