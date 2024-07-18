// 1ere chose à faire, importer les librairies
const express = require('express')              
const _ = require("lodash")
const bodyParser = require('body-parser')
const Config = require ('./config')
const Logger = require('./utils/logger').pino

// Création de notre application express.js
const app = express()

// Démarrage de la database
require('./utils/database')

// Ajout du module de login
const passport = require('./utils/passport')
// passport init

var session = require('express-session')

app.use(session({
    secret: Config.secret_cookie,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(passport.initialize())
app.use(passport.session())

// Déclaration des controllers pour l'utilisateur
const UserController = require('./controllers/UserController')
const ArticleController = require('./controllers/ArticleController')

// Déclaration des middlewares
const DatabaseMiddleware = require('./middlewares/database')
const LoggerMiddleware = require('./middlewares/logger')

// Déclaration des middlewares à express
app.use(bodyParser.json(), LoggerMiddleware.addLogger)

/*--------------------- Création des routes (User - Utilisateur) ---------------------*/
app.post('/login', DatabaseMiddleware.checkConnexion, UserController.loginUser)

// Création du endpoint /user pour l'ajout d'un utilisateur
app.post('/user', DatabaseMiddleware.checkConnexion, UserController.addOneUser)

// Création du endpoint /user pour l'ajout de plusieurs utilisateurs
app.post('/users', DatabaseMiddleware.checkConnexion, UserController.addManyUsers)

// Création du endpoint /user pour la récupération d'un utilisateur par le champ selectionné
app.get('/user', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUser)

// Création du endpoint /user pour la récupération d'un utilisateur via l'id
app.get('/user/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.findOneUserById)

// Création du endpoint /user pour la récupération de plusieurs utilisateurs via l'idS
app.get('/users', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.findManyUsersById)

// Création du endpoint /users_by_filters pour la récupération de plusieurs utilisateurs
app.get('/users_by_filters', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.findManyUsers)

// Création du endpoint /user pour la modification d'un utilisateur
app.put('/user/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.updateOneUser)

// Création du endpoint /user pour la modification de plusieurs utilisateurs
app.put('/users', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.updateManyUsers)

// Création du endpoint /user pour la suppression d'un utilisateur
app.delete('/user/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.deleteOneUser)

// Création du endpoint /user pour la suppression de plusieurs utilisateurs
app.delete('/users', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), UserController.deleteManyUsers)

/*--------------------- Création des routes (Article - Article) ---------------------*/

// Création du endpoint /article pour l'ajout d'un article
app.post('/article', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.addOneArticle)

// Création du endpoint /articles pour l'ajout de plusieurs articles
app.post('/articles', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.addManyArticles)

// Création du endpoint /article pour la récupération d'un article via l'id
app.get('/article/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.findOneArticleById)

// Création du endpoint /articles pour la récupération de plusieurs articles via l'idS
app.get('/articles', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.findManyArticlesById)

// Création du endpoint /article pour la récupération d'un article par le champ selectionné
app.get('/article', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.findOneArticle)

// Création du endpoint /articles_by_filters pour la récupération de plusieurs articles par champ selectionné
app.get('/articles_by_filters', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.findManyArticles)

// Création du endpoint /article pour la modification d'un article
app.put('/article/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.updateOneArticle)

// Création du endpoint /articles pour la modification de plusieurs articles
app.put('/articles', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.updateManyArticles)

// Création du endpoint /article pour la suppression d'un article
app.delete('/article/:id', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.deleteOneArticle)

// Création du endpoint /articles pour la suppression de plusieurs articles
app.delete('/articles', DatabaseMiddleware.checkConnexion, passport.authenticate('jwt', { session: false }), ArticleController.deleteManyArticles)

// 2e chose à faire : Créer le server avec app.listen
app.listen(Config.port, () => {   
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

module.exports = app