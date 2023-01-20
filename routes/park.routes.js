const { authJwt } = require('../middleware');
const controller = require('../controller/park.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });
  //,[authJwt.verifyToken]
  app.get('/api/park/findOne/:parkId', controller.findOne);

  app.get('/api/park/findAll', controller.findAll);

  app.get('/api/park/findAllparksByCompany/:companyId', controller.findAllParksByCompany);

  app.get('/api/park/findAllparksLicensed', controller.findAllParksLicensed);

  app.get('/api/park/findAllparksByDate/:startDate/:endDate', controller.findAllParksByDate);

  app.post('/api/park/create', controller.create);

  app.put('/api/park/update/:parkId', controller.update);

  app.delete('/api/park/delete/:parkId', controller.delete);

  app.delete('/api/park/deleteAll', controller.deleteAll);
};
