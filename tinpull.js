
const tinder = require('tinder')
const util = require('util')
const prompt = require('prompt')
const fs = require('fs-extra')
const path = require('path')
const stringify = require('csv-stringify')
const moment = require('moment')
const zipFolder = require('zip-folder')

const client = new tinder.TinderClient()

const writeChat = (data, yourName) => {
  const { matches } = data
  for (var i = 0; i < matches.length; i++) {
    const match = matches[i];
    const exportLineData = [];
    const { created_date, message_count, messages, participants, person } = match;
    const _id = participants[0];
    const { birth_date, name } = person;
    const birth = moment(birth_date);
    const matchDate = moment(created_date);
    const ageAtMatch = birth.to(matchDate, true)

    for (var a = 0; a < messages.length; a++) {
      const msg = messages[a];
      const { from, message, sent_date, to } = msg;
      const messageName = from === _id ? `${name} ${ageAtMatch}` : yourName;
      exportLineData.push([sent_date, messageName, message]);
    }

    const OUTPUT_CSV = path.join(__dirname + `/exported_chats/${yourName}/${name}_${_id}.csv`);
    stringify(exportLineData, function(err, output){
      fs.outputFileSync(OUTPUT_CSV, output);
    });
  }
  setTimeout(() => {
    zipFolder(__dirname + `/exported_chats`, __dirname + '/exported_chats.zip', function(err) {
      if(err) {
          console.log('oh no!', err);
      } else {
          console.log('EXCELLENT');
      }
    });
  }, 2000)
}


const getUserHistory = (fbAuthToken, fbId, yourName) => {
  client.authorize(
    fbAuthToken,
    fbId,
    function(error, data) {
      client.getHistory(function(error, data){
        if (error) {
          console.log('error', error)
        }
        console.log(util.inspect(data, {showHidden: false, depth: null}));
        writeChat(data, yourName)
      });
    }
  );
}

prompt.get(['fbAuthToken', 'fbId', 'yourName'], function (err, result) {
  const { fbAuthToken, fbId, yourName } = result
  getUserHistory(fbAuthToken, fbId, yourName)
});

