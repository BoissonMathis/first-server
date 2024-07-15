const UserService = require('../../services/UserService')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const server = require('./../../server')
let should = chai.should();
const _ = require('lodash')
var tab_id_users = []
var articles = []

let users = [
    {
        firstName: "Détenteur d'article 1",
        lastName: "Iencli",
        username: "oui1",
        email:"iencli1@gmail.com"
    },
    {
        firstName: "Détenteur d'article 2",
        lastName: "Iencli",
        username: "oui2",
        email:"iencli2@gmail.com"
    },
    {
        firstName: "Détenteur d'article 3",
        lastName: "Iencli",
        username: "oui3",
        email:"iencli3@gmail.com"
    },
    {
        firstName: "Détenteur d'article 4",
        lastName: "Iencli",
        username: "oui4",
        email:"iencli4@gmail.com"
    }
];

it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers(users, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})

function rdm_user(tab) {
    let rdm_id = tab[Math.floor(Math.random() * tab.length)]
    return rdm_id
}

chai.use(chaiHttp)

describe("POST - /article", () => {
    it("Ajouter un article. - S", (done) => {
        chai.request(server).post('/article/' + rdm_user(tab_id_users)).send({
            name: "voiture",
            description: "ceci est une description",
            price: 12000,
            quantity: 40
        }).end((err, res) => {
            expect(res).to.have.status(201)
            articles.push(res.body)
            done()
        });
    })
    it("Ajouter un article incorrect. (Sans name) - E", (done) => {
        chai.request(server).post('/article/' + rdm_user(tab_id_users)).send({
            description: "ceci est une description",
            price: 12000,
            quantity: 40
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un article incorrect. (Avec une quantité < 0 ) - E", (done) => {
        chai.request(server).post('/article/' + rdm_user(tab_id_users)).send({
            name: "avion",
            description: "ceci est une description",
            price: 1000000,
            quantity: -3
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
    it("Ajouter un article incorrect. (Avec un champ vide) - E", (done) => {
        chai.request(server).post('/article/' + rdm_user(tab_id_users)).send({
            name: "",
            description: "ceci est une description",
            price: 20,
            quantity: 7
        }).end((err, res) => {
            expect(res).to.have.status(405)
            done()
        })
    })
})

describe("GET - /article/:id", () => {
    it("Chercher un article correct. - S", (done) => {
        chai.request(server).get('/article/' + articles[0]._id)
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Chercher un article incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/article/665f18739d3e172be5daf092')
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher un article incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).get('/article/123')
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
    
})

describe("GET - /articles", () => {
    it("Chercher plusieurs articles. - S", (done) => {
        chai.request(server).get('/articles').query({id: _.map(articles, '_id')})
        .end((err, res) => {
            res.should.have.status(200)
            expect(res.body).to.be.an('array')
            done()
        })
    })

    it("Chercher plusieurs articles incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).get('/articles').query({id: ["66791a552b38d88d8c6e9ee7", "66791a822b38d88d8c6e9eed"]})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Chercher plusieurs articles incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).get('/articles').query({id: ['123', '456']})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /article", () => {
    it("Modifier un article. - S", (done) => {
        chai.request(server).put('/article/' + articles[0]._id).send({ name: "Tv" })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Modifier un article avec un id invalide. - E", (done) => {
        chai.request(server).put('/article/123456789').send({name: "pommier", description: "Un arbre"})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier un article avec un id inexistant. - E", (done) => {
        chai.request(server).put('/article/66791a552b38d88d8c6e9ee7').send({name: "pommier", description: "Un arbre"})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier un article avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/article/' + articles[0]._id).send({name: "", description: "Un arbre"})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("PUT - /articles", () => {
    it("Modifier plusieurs articles. - S", (done) => {
        chai.request(server).put('/articles').query({id: _.map(articles, '_id')}).send({ price: 30 })
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })

    it("Modifier plusieurs articles avec des ids invalide. - E", (done) => {
        chai.request(server).put('/articles').query({id: ['267428142', '41452828']}).send({name: "Alexandre"})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })

    it("Modifier plusieurs articles avec des ids inexistant. - E", (done) => {
        chai.request(server).put('/articles').query({id: ['66791a552b38d88d8c6e9ee7', '667980886db560087464d3a7']})
        .send({name: "Lutfu"})
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })

    it("Modifier des articles avec un champ requis vide. - E", (done) => {
        chai.request(server).put('/articles').query({id: _.map(articles, '_id')}).send({ name: ""})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /article", () => {
    it("Supprimer un article. - S", (done) => {
        chai.request(server).delete('/article/' + articles[0]._id)
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer un article incorrect (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/article/665f18739d3e172be5daf092')
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer un article incorrect (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/article/123')
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

describe("DELETE - /articles", () => {
    it("Supprimer plusieurs articles. - S", (done) => {
        chai.request(server).delete('/articles').query({id: _.map(articles, '_id')})
        .end((err, res) => {
            res.should.have.status(200)
            done()
        })
    })
    it("Supprimer plusieurs articles incorrects (avec un id inexistant). - E", (done) => {
        chai.request(server).delete('/articles/665f18739d3e172be5daf092&665f18739d3e172be5daf093')
        .end((err, res) => {
            res.should.have.status(404)
            done()
        })
    })
    it("Supprimer plusieurs articles incorrects (avec un id invalide). - E", (done) => {
        chai.request(server).delete('/articles').query({id: ['123', '456']})
        .end((err, res) => {
            res.should.have.status(405)
            done()
        })
    })
})

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, function (err, value) {
        done()
    })
})