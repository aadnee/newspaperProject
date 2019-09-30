DROP TABLE IF EXISTS nyhetssak;
DROP TABLE IF EXISTS kategori;

CREATE TABLE kategori (
    navn varchar(30) NOT NULL,
    PRIMARY KEY (navn)
);

CREATE TABLE nyhetssak (
    id int(11) NOT NULL AUTO_INCREMENT,
    overskrift VARCHAR(100) NOT NULL,
    innhold TEXT NOT NULL,
    tidspunkt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bilde varchar(1200) NOT NULL,
    kategori varchar(30) NOT NULL,
    viktighet TINYINT NOT NULL,
    forfatter varchar(120) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (kategori) REFERENCES kategori(navn)
);