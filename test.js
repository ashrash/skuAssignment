const StreamArray = require('stream-json/streamers/StreamArray');
const {Writable} = require('stream');
const path = require('path');
const fs = require('fs');

const fileStream = fs.createReadStream(path.join(__dirname, './src/static/transactions.json'));
const jsonStream = StreamArray.withParser();

const processingStream = new Writable({
    write({key, value}, a, callback) {
      console.log(key)
    },
    objectMode: true
});

//Pipe the streams as follows
fileStream.pipe(jsonStream.input);
jsonStream.pipe(processingStream);
