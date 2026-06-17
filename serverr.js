const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Brauzer əsas səhifəni istəyəndə public qovluğundakı index.html-i oxuyub ötürür
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('index.html faylı public qovluğunda tapılmadı!');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Səhifə tapılmadı');
    }
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Aldayə SaaS Serveri (Daxili Modulla) İşə Düşdü!`);
    console.log(`🌍 Brauzerdə baxın: http://localhost:${PORT}`);
    console.log(`==================================================`);
});