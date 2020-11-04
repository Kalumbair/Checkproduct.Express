var express = require('express');
const path = require('path');
var app = express();
const product = []; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));

app.get('/list', (req, res) =>{
    res.send(product);
});

app.delete('/list', (req, res) =>{
  let i=0;
    for(; i<product.length;i++)
        if(req.body.id==product[i].id)
        break;
    if(i<product.length)
    {
        product.splice(i,1);
        res.send(200);
    }
    else
        res.send(400);
});

app.put('/list', (req, res) =>{
    if("name" in req.body && "kol" in req.body && "count" in req.body && !isNaN(req.body.count) && !isNaN(req.body.kol))
    {
        let id=product.length==0?0:product[product.length-1].id+1;
        product.push({"id": id,"name": req.body.name,"kol":req.body.kol, "count": req.body.count});
        res.send(`{"id":${id}}`);
    }
   else
   res.send(400);
});

app.post('/list', (req, res) =>{
    if("id" in req.body && "name" in req.body && "kol" in req.body && "count" in req.body && !isNaN(req.body.count) && !isNaN(req.body.kol))
    {
    let i=0;
    for(; i<product.length;i++)
        if(req.body.id==product[i].id)
        break;
        if(i<product.length)
        {
            product[i].name = req.body.name;
            product[i].kol=req.body.kol;
            product[i].count= req.body.count;

            res.send(200);
        }
        else
        res.send(400);
    }
    else 
        res.send(400);
});

app.listen(3000, '127.0.0.1');
console.log(`Running server at http://127.0.0.1:3000`);