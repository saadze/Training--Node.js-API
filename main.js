const fs = require('fs')
const http = require('http')
const url = require('url')

const templateOverview = fs.readFileSync(__dirname + '/templates/overview.html', 'utf-8')
const templateCard = fs.readFileSync(__dirname + '/templates/templatecard.html', 'utf-8')
const templateProduct = fs.readFileSync(__dirname + '/templates/product.html', 'utf-8')
const productData = fs.readFileSync(__dirname + '/dev-data/data.json', 'utf-8')
const dataObject = JSON.parse(productData)

const replaceTemplate = (html, el) => {
    let output = html.replace(/{%PRODUCT%}/g, el.productName)
    output = output.replace(/{%IMAGE%}/g, el.image)
    output = output.replace(/{%PRICE%}/g, el.price)
    output = output.replace(/{%LOCATION%}/g, el.from)
    output = output.replace(/{%QUANTITY%}/g, el.quantity)
    output = output.replace(/{%NUTRIENTS%}/g, el.nutrients)
    output = output.replace(/{%DESCRIPTION%}/g, el.description)
    output = output.replace(/{%ID%}/g, el.id)
    if (el.organic == false){
        output = output.replace(/{%NOTORGANIC%}/g, 'not-organic')
    }
    return output
}

const server = http.createServer((req,res)=>{
    //Using the new URL API
    const baseURL = 'https://' + req.headers.host + '/'
    const { pathname, searchParams } = new URL(req.url, baseURL)
    // Reading the first param value
    //console.log(searchParams.get('id'))
    if(pathname === '/overview' || pathname ==='/'){
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = dataObject.map(el =>
            replaceTemplate(templateCard,el)).join('')
        const overviewHtml = templateOverview.replace('{%PRODUCTCARDS%}', cardsHtml)
        res.end(overviewHtml)
    }else if(pathname === '/product'){
        const product = dataObject[searchParams.get('id')]
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
       const output = replaceTemplate(templateProduct,product)
        res.end(output)
    }else if(pathname === '/api'){
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(productData)
    }else{
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>ERROR 404</h1>')
    }
})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to you habiba in my server')
})
