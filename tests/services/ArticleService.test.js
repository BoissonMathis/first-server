const ArticleService = require('../../services/ArticleService')
const UserService = require('../../services/UserService')
const chai = require('chai');
let expect = chai.expect;
const _ = require('lodash')
var id_article_valid = ""
var tab_id_articles = []
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
    },
];

it("Création des utilisateurs fictif", (done) => {
    UserService.addManyUsers(users, function (err, value) {
        tab_id_users = _.map(value, '_id')
        done()
    })
})

function rdm_user (tab) {
    let rdm_id = tab[Math.floor(Math.random() * tab.length)]
    return rdm_id
}

describe("addOneArticle", () => {
    it("Article correct. - S", () => {
        var article = {
            name: "test",
            description: "ceci est une description",
            price: 40,
            quantity: 120,
        }
        ArticleService.addOneArticle(article, rdm_user(tab_id_users), function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('user_id')
            id_article_valid = value._id
            articles.push(value)
        })
    })
    it("Article incorrect. (Sans name) - E", () => {
        var article_no_valid = {
            description: "ceci est une description",
            price: 10,
            quantity: 80
        }
        ArticleService.addOneArticle(article_no_valid, rdm_user(tab_id_users), function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')

        })
    })
})

describe("addManyArticles", () => {
    it("Articles à ajouter, valide. - S", (done) => {
        var articles_tab = [{
            name: "fourchette",
            description: "ceci est une description",
            price: 20,
            quantity: 20
        }, {
            name: "assiette",
            description: "ceci est une description",
            price: 10,
            quantity: 50
        },
        {
            name: "couteau",
            description: "ceci est une description",
            price: 25,
            quantity: 8
        }]

        ArticleService.addManyArticles(articles_tab, rdm_user(tab_id_users), function (err, value) {
            tab_id_articles = _.map(value, '_id')
            articles = [...value, ...articles]
            // expect(value).lengthOf(3)
            console.log(value)
            done()
        })
    })
    it("Articles à ajouter, non valide. - E", (done) => {
        var articles_tab_error = [{
            name: "fourchette",
            description: "ceci est une description",
            price: -20,
            quantity: 20
        }, {
            name: "couteau",
            price: 10,
            quantity: -20
        },
        {
            name: "",
            description: "ceci est une description",
            price: 15,
            quantity: 20
        }]

        ArticleService.addManyArticles(articles_tab_error, rdm_user(tab_id_users), function (err, value) {
            done()
        })
    })
})

describe("findOneArticleById", () => {
    it("Chercher un article existant correct. - S", (done) => {
        ArticleService.findOneArticleById(id_article_valid, function (err, value) {
            expect(value).to.be.a('object');
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            done()
        })
    })
    it("Chercher un article non-existant correct. - E", (done) => {
        ArticleService.findOneArticleById("100", function (err, value) {
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.equal('no-valid')
            done()
        })
    })
})

describe("findManyArticlesById", () => {
    it("Chercher des articles existant correct. - S", (done) => {
        ArticleService.findManyArticlesById(tab_id_articles, function (err, value) {
            expect(value).lengthOf(3)
            done()

        })
    })
})

describe("findOneArticle", () => {
    it("Chercher un article par les champs selectionnées. - S", (done) => {
        ArticleService.findOneArticle(["name", "description"], articles[0].name, function (err, value) {
            expect(value).to.haveOwnProperty('name')
            done()

        })
    })
    it("Chercher un article sans tableau de champ. - E", (done) => {
        ArticleService.findOneArticle("name", articles[0].name, function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
    it("Chercher un article inexistant. - E", (done) => {
        ArticleService.findOneArticle(["name"], "articles[0].name", function (err, value) {
            expect(err).to.haveOwnProperty('type_error')
            done()
        })
    })
})

describe("findManyArticles", () => {
    it("Retourne 3 articles - S", (done) => {
        ArticleService.findManyArticles(null, 3, 1, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(4)
            expect(value["results"]).lengthOf(3)
            expect(err).to.be.null
            done()
        })
    })
    it("Faire une recherche avec 0 résultats correspondant - S", (done) => {
        ArticleService.findManyArticles('couteau', 1, 3, function (err, value) {
            expect(value).to.haveOwnProperty("count")
            expect(value).to.haveOwnProperty("results")
            expect(value["count"]).to.be.equal(1)
            expect(value["results"]).lengthOf(0)
            expect(err).to.be.null
            done()
        })
    })
    it("Envoie d'une chaine de caractère a la place de la page - E", (done) => {
        ArticleService.findManyArticles(null, "coucou", 3, function (err, value) {
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            expect(value).to.undefined
            done()
        })
    })
})

describe("updateOneArticle", () => {
    it("Modifier un article correct. - S", (done) => {
        ArticleService.updateOneArticle(id_article_valid, { name: "Moto", description: "Vroum vroum" }, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('description')
            expect(value).to.haveOwnProperty('updated_at')
            expect(value['name']).to.be.equal('Moto')
            expect(value['description']).to.be.equal('Vroum vroum')
            done()

        })
    })
    it("Modifier un article avec id incorrect. - E", (done) => {
        ArticleService.updateOneArticle("1200", { name: "Jean", price: 60 }, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier un article avec des champs requis vide. - E", (done) => {
        ArticleService.updateOneArticle(id_article_valid, { name: "", description: "pas bon" }, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("updateManyArticles", () => {
    it("Modifier plusieurs articles correctement. - S", (done) => {
        ArticleService.updateManyArticles(tab_id_articles, { name: "Jean", price: 80 }, function (err, value) {
            expect(value).to.haveOwnProperty('modifiedCount')
            expect(value).to.haveOwnProperty('matchedCount')
            expect(value['matchedCount']).to.be.equal(tab_id_articles.length)
            expect(value['modifiedCount']).to.be.equal(tab_id_articles.length)
            done()

        })
    })
    it("Modifier plusieurs articles avec id incorrect. - E", (done) => {
        ArticleService.updateManyArticles("1200", { name: "trotinette", description: "oui oui" }, function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Modifier plusieurs articles avec des champs requis vide. - E", (done) => {
        ArticleService.updateManyArticles(tab_id_articles, { name: "", description: "test" }, function (err, value) {
            expect(value).to.be.undefined
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('fields_with_error').with.lengthOf(1)
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err['fields']['name']).to.equal('Path `name` is required.')
            done()
        })
    })
})

describe("deleteOneArticle", () => {
    it("Supprimer un article correct. - S", (done) => {
        ArticleService.deleteOneArticle(id_article_valid, function (err, value) { //callback
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.haveOwnProperty('price')
            done()
        })
    })
    it("Supprimer un article avec id incorrect. - E", (done) => {
        ArticleService.deleteOneArticle("1200", function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("Supprimer un article avec un id inexistant. - E", (done) => {
        ArticleService.deleteOneArticle("665f00c6f64f76ba59361e9f", function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteManyArticles", () => {
    it("Supprimer plusieurs articles correctement. - S", (done) => {
        ArticleService.deleteManyArticles(tab_id_articles, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).is.equal(tab_id_articles.length)
            done()

        })
    })
    it("Supprimer plusieurs articles avec id incorrect. - E", (done) => {
        ArticleService.deleteManyArticles("1200", function (err, value) {
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
});

it("Suppression des utilisateurs fictif", (done) => {
    UserService.deleteManyUsers(tab_id_users, function (err, value) {
        done()
    })
})