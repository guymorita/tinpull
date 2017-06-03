
const tinder = require('tinder')
const util = require('util')
const prompt = require('prompt')
const fs = require('fs-extra')

const file = './export.json'

const client = new tinder.TinderClient()

const getUserHistory = (fbAuthToken, fbId) => {
  client.authorize(
    fbAuthToken,
    fbId,
    function(error, data) {
      client.getHistory(function(error, data){
        if (error) {
          console.log('error', error)
        }
        console.log(util.inspect(data, {showHidden: false, depth: null}));
        fs.outputFile(file, JSON.stringify(data), err => {
          console.log(err) // => null

          fs.readFile(file, 'utf8', (err, data) => {
            if (err) return console.error(err)
            console.log(data) // => hello!
          })
        })
      });
    }
  );
}

prompt.get(['fbAuthToken', 'fbId'], function (err, result) {
  const { fbAuthToken, fbId } = result
  getUserHistory(fbAuthToken, fbId)
  });

