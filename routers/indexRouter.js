const { Router } = require('express');
const indexController = require('../controllers/indexController');
const { authMiddleware } = require('../controllers/middlewares');

const indexRouter = Router();

indexRouter.get('/', indexController.getIndex);
indexRouter.get('/register', indexController.getRegister);
indexRouter.post('/register', indexController.postRegister);
indexRouter.get('/login', indexController.getLogin);
indexRouter.post('/login', indexController.postLogin);
indexRouter.get('/logout', authMiddleware, indexController.getLogout);
indexRouter.get('/newMessage', authMiddleware, indexController.getNewMessage);
indexRouter.post('/newMessage', authMiddleware, indexController.postNewMessage);
indexRouter.get('/clubForm', authMiddleware, indexController.getclubMemberForm);
indexRouter.post('/clubForm', authMiddleware, indexController.postClubMemberForm);
indexRouter.get('/deleteMessage/:messageId', indexController.getDeleteMessage);

module.exports = indexRouter;