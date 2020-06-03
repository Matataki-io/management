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
  // 信息推送
  router.post('/api/message/telegram/md', passport, controller.telegrambot.sendMessageMarkdown);
  router.post('/api/message/telegram/html', passport, controller.telegrambot.sendMessageHtml);
  router.post('/api/boardcast/telegram/md', passport, controller.telegrambot.boardcastMessageMarkdown);
  router.post('/api/boardcast/telegram/html', passport, controller.telegrambot.boardcastMessageHtml);
  router.get('/api/getAllTelegramBindedUser', passport, controller.telegrambot.getAllTelegramBindedUser);
  // 文章管理
  router.resources('posts', '/api/post', passport, controller.posts);
  // ipfs
  router.get('/api/ipfs/:hash', passport, controller.posts.ipfs);
  // 登录test
  router.post('/api/login', controller.login.login);
  // 添加管理员
  router.post('/api/admin/addUser', passport, controller.admin.addUser);
  router.patch('/api/admin/edit', passport, controller.admin.edit);
  router.get('/api/admin', passport, controller.admin.list);
  router.get('/api/admin/me', passport, controller.admin.getMe);
  // 公告
  router.get('/api/announcement', passport, controller.announcement.index);
  router.post('/api/announcement', passport, controller.announcement.post);

  // Logging
  router.get('/api/logs', passport, controller.logging.index);

};
