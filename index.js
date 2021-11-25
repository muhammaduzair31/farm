const fs=require('fs');
const http=require('http');
const url=require('url');  
const slugify=require('slugify');
const replaceTemplate= require ('./final/modules/replaceTemplate');

/////////////////////////////read file synchronously///////////////////////////////////////////////////

//const textIn=fs.readFileSync('./final/txt/input.txt','utf-8');
//console.log(textIn);

//const textOUT=`This is what we know about Avocado: ${textIn}.\nCreated on ${Date.now()}`;
//fs.writeFileSync('./final/txt/output.txt', textOUT);
//console.log('file written!');

 ////////////////////////////read file asynchronous ////////////////////////////////

 //fs.readFile('./final/txt/start.txt','utf-8',(err,data1)=>{
   // fs.readFile(`./final/txt/${data1}.txt`,'utf-8',(err,data2)=>{
     //   console.log(data2);
       // fs.readFile('./final/txt/append.txt','utf-8',(err,data3)=>{
         //   console.log(data3);
           // fs.writeFile('./final/txt/final.txt',`${data2}\n${data3}`,'utf-8', err =>{
             // console.log('your file has been written');

            //})
    //})
//})
 //})


 ///////////////////////////////////////////////server////////////////////////////////////////////////
 
 const tempOverview=fs.readFileSync(`${__dirname}/final/templates/template-overview.html`,'utf-8');
 const tempCard=fs.readFileSync(`${__dirname}/final/templates/template-card.html`,'utf-8');
 const tempProduct=fs.readFileSync(`${__dirname}/final/templates/template-product.html`,'utf-8');



 const data=fs.readFileSync(`${__dirname}/final/dev-data/data.json`,'utf-8')
 const dataObj=JSON.parse(data);

 ////////////////////////////slugs/////instead of show id it display slugs in the url//////////////////////////
 

const slugs=dataObj.map(el=>slugify(el.productName))
console.log(slugs)
 console.log(slugify('Fresh Avocados',{lower:true}))


 const server=http.createServer((req,res)=>{
  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  
  
  //overview
   if (pathname==='/'|| pathname==='/overview'){
     res.writeHead(200,{'content-type':"text/html"});
   
     
     const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    }
    
    ////product
    else if (pathname==='/product') {
      res.writeHead(200,{'content-type':'text/html'});
      const product = dataObj[query.id];
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    }
   
   
    ///api
   else if (pathname==='/api') {
     res.writeHead(200,{'content-type':'application/json'})
     res.end(data)
   
    }
   //not found
   else{
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
   }
   
   
   ///serverlisten
 })
 server.listen(8000,'127.0.0.1',()=>{
   console.log('listening to the port 8000');
 })

