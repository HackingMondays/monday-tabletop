var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var serveStatic = require('serve-static');

app.use(serveStatic('public/', {}));

var chat = [];
var i = 0;
io.on('connection', function (self) {
    chat.push(self);
    var identifier = i++;

    self.on('chat laid', function (message) {
        console.log(message);
        io.sockets.emit('chat beau', identifier + ' : ' + message);
    });

    self.on('disconnect', function () {
        chat = chat.filter(function (socket) {
            return socket !== self;
        });
        console.log('disconnected', chat.length, identifier);
        io.sockets.emit('user disconnected');
    });
});

server.listen(8080, function () {
    console.log('Listening on port %d', server.address().port);
});