var http = require('http');
var url = require('url');

var httpProxy = require('http-proxy');

// 获取运行参数
var args = process.argv.slice(2);

var port = args[0] ? args[0].split(':').shift() : 8080;
var targetPort = args[0] ? args[0].split(':').pop() : 8082;

// 新建一个代理 Proxy Server 对象
var proxy = httpProxy.createProxyServer({
    ignorePath: true,
});

// 捕获异常
proxy.on('error', function(err, req, res) {
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end('系统维修中，请稍后。。。');
});

// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发
var server = http.createServer(function (req, res) {
    var targetHost = 'http://localhost:' + targetPort;
    var targetPath = req.url;

    var projectKey = getProjectKeyByPath(targetPath);

    switch (projectKey) {
        case 'static':
            targetPath = targetPath.replace('/static/', '/AidingStatic/');
            break;
    }

    proxy.web(req, res, {
        target: targetHost + targetPath,
    });

    console.log(targetHost + targetPath);
});

console.log('listening on port ' + port);
server.listen(port);

function getProjectKeyByPath(path) {
    return path.slice(1, path.slice(1).indexOf('/') + 1);
}
