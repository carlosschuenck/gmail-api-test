var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

const gmail = google.gmail('v1');

var SCOPES = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send'
];


var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }

  authorize(JSON.parse(content), testeMethod);
});

//Coloquei aqui o método que deseja testar.
function testeMethod(auth){
  getMessages(auth);
  getMessage(null, null, auth);

}

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);


  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}


function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}


function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}


function listLabels(auth) {
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

//==============================================================================


function makeBody(to, from, subject, message) {
  var str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
  ].join('');

  var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
      return encodedMail;
}

/*
 Pega uma lista de emails da sua caixa de entrada. É possivel limitar a quantidade com {maxResults}
*/
function getMessages(auth) {
  gmail.users.messages.list({
    includeSpamTrash: false,
    maxResults: 10,
    q: "",
    auth: auth,
    userId: 'me',
  }, function (err, results) {
      console.log(err);
      console.log(results);
  });
}

/**
 * Método busca 1 msg só de acordo com o ID da mesma. Nela vem o body, title etc.
 */
function getMessage(userId, messageId, auth) {
  gmail.users.messages.get({
    auth: auth,
    userId: 'me',
    id: '160e7de89a58cca9' //ID de uma MSG que eu achei na minha lista de mensagem que obtive atraves do método getMessages
  }, function (err, results) {
    console.log(err);
    console.log(results);
  });
}

/*
 * Método busca o anexo de uma mensagem. É necessario o id da msg que deseja pegar o anexo.
 */
function getAttachments(userId, message, auth) {
  var parts = message.payload.parts;
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    if (part.filename && part.filename.length > 0) {
      var attachId = part.body.attachmentId;
      gmail.users.messages.attachments.get({
        auth: auth,
        id: attachId,
        messageId: '160e7bce14c441b3', //ID de uma MSG que eu achei na minha lista de mensagem que obtive atraves do método getMessages
        userId: 'me'
      },function(err, attachment) {
        console.log(part.filename)
        console.log(part.mimeType)
        console.log(attachment)
      });
    }
  }
}

//Envia email.
function sendMessage(auth) {
  var raw = makeBody('carlosschuenck.10@gmail.com', 'carlosschuenck.10@gmail.com', 'GMAIL - API - ENVIANDO EMAIL TESTE', 'Testando envio de email pelo GMAIL API');
  gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
          raw: raw
      }
  }, function(err, response) {
    console.log(err);
    console.log(response);
  });
}
