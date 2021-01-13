'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const passport = app.middleware.passport();
  const { router, controller } = app;

  router.get('/', controller.home.index);
  // 账号管理
  router.resources('account', '/api/account', passport, controller.account);
  // 用户管理
  router.resources('user', '/api/user', passport, controller.user);
  // 文章管理
  router.resources('posts', '/api/post', passport, controller.posts);
  // ipfs
  router.get('/api/ipfs/:hash', passport, controller.posts.ipfs);
  // 登录test
  // router.post('/api/login', controller.login.login);
  router.post('/api/loginBySignature', controller.login.loginBySignature);
  // 公告
  router.get('/api/announcement', passport, controller.announcement.index);

  // Logging
  router.get('/api/logs', passport, controller.logging.index);

  // fan票申请管理
  router.get('/api/minetoken_application', passport, controller.minetokenApplication.list);
  // router.post('/api/minetoken_application', passport, controller.minetokenApplication.modify);
  // router.get('/api/minetoken_application_survey', passport, controller.minetokenApplication.surveyList);
  // router.get('/api/minetoken_application_survey/:id', passport, controller.minetokenApplication.surveyListId);
};
