let http = require('http')
const { v4: uuidv4 } = require('uuid')
const errHandel = require('./erroeHandle.js')
console.log('1',errHandel)
const todos = []


const resquestListen = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = ''
    req.on('data', chunk => {
        console.log(chunk)
        body += chunk
        // console.log(body)
    })
    if(req.url == '/todos' && req.method =="GET"){
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            'status' : 'success',
            'data' : todos
        }))
        res.end()

    }else if(req.url == '/todos' && req.method =="POST"){
        req.on('end', () =>{
            try{
                const title = JSON.parse(body).title
                if(title !== undefined) {
                    const todo = {
                        'title' : title,
                        'id': uuidv4()
                    }
                    todos.push(todo)
                    res.writeHead(200, headers)
                    res.write(JSON.stringify({
                        'status' : 'success',
                        'data' : todos
                    }))
                    res.end()
                }else{
                    errHandel(res)
                }
            }
            catch(err){
                errHandel(res)
            }
        })

    }else if(req.url == '/todos' && req.method =="DELETE") {
        todos.length = 0
        res.writeHead(200, headers)
        res.write(JSON.stringify({
            'status' : 'success',
            'data' : todos
        }))
        res.end()
    }else if(req.url.startsWith('/todos/') && req.method =="DELETE") {
        const id = req.url.split('/').pop()
        const index = todos.findIndex(item => item.id == id)
        if(index !== -1){
            todos.splice(index, 1)
            res.writeHead(200, headers)
            res.write(JSON.stringify({
                'status' : 'success',
                'data' : todos
            }))
            res.end()
        }else {
            errHandel(res)
        }
    }else if(req.url.startsWith('/todos/') && req.method =="PATCH"){
        req.on('end', () => {
            try{
              const title = JSON.parse(body).title
              const id = req.url.split('/').pop()
              const index = todos.findIndex(item => item.id == id)
              if( title !== undefined && index !== -1){
                todos[index].title = title
                res.writeHead(200, headers)
                res.write(JSON.stringify({
                    'status' : 'success',
                    'data' : todos
                }))
                res.end()
              }else {
                errHandel(res)
              }
            }catch{
                errHandel(res)
            }
        })
    }
    else if(req.method =="OPTIONS"){
        res.writeHead(200, headers)
        res.write('OPTIONS')
        res.end()
    }
    else {
        res.writeHead(404, headers)
        res.write('error')
        res.end()
    }
}
const serve = http.createServer(resquestListen)
serve.listen(3005)
