const fs = require('fs')
const http = require('http')
const url = require('url')

const replaceTemplate = require('./modules/replaceTemplate.js')

// const textIn = fs.readFileSync('input.txt','utf-8')
// const textOut = `My name is Gnod. ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('input.txt',textOut)
// console.log(textIn)



const templateOverview = fs.readFileSync('./templates/template-overview.html','utf-8')
const templateProduct = fs.readFileSync('./templates/template-product.html','utf-8')
const templateCard = fs.readFileSync('./templates/template-card.html','utf-8')
const data = fs.readFileSync('data.json','utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req,res) => {


    const { query, pathname } = url.parse(req.url,true)
    console.log(req.url)
    console.log(url.parse(req.url,true))
    

    if (pathname === '/' || pathname ==='/overview') {

        res.writeHead(200,{
            'Content-type': 'text/html'
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    } else if (pathname === '/product') {

        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(templateProduct,product)
        res.end(output)
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data)
    } else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-word'
        })
        res.end('<h1>Page not found!</h1>')
    }
})

server.listen(8000,'127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})