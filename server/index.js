const cp = require('./service/individualServices/CyclicProcessService/cyclicProcess');

'use strict';

var path = require('path');
var http = require('http');

//var oas3Tools = require('openbackhaul-oas3-tools');
var oas3Tools = require('oas3-tools');
var serverPort = 8080;
const prepareElasticsearch = require('./service/individualServices/ElasticsearchPreparation');
var appCommons = require('onf-core-model-ap/applicationPattern/commons/AppCommons');

// uncomment if you do not want to validate security e.g. operation-key, basic auth, etc
//appCommons.openApiValidatorOptions.validateSecurity = false;

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: appCommons.openApiValidatorOptions
    };

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();
appCommons.setupExpressApp(app);

//TO REMOVE, ONLY FOR DEBUG
//global.databasePath = 'D:/\VALE/\WorkindDoc/\MICROSERVIZI/\loadjson/\loadMATRRunning.json'
global.databasePath = './database/load.json'


prepareElasticsearch().catch(err => {
    console.error(`Error preparing Elasticsearch : ${err}`);
}).finally(
    () => {
        // Initialize the Swagger middleware
        http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
        });
        appCommons.performApplicationRegistration();

        //cp.embeddingCausesCyclicRequestsForUpdatingMacTableFromDeviceAtMatr(2);
    }
);
