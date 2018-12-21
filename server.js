const express =require ('express');
const keys =require('./config/keys');
const stripe =require('stripe')(keys.stripeSecretkey);
const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');
const app =express();
//handlebar middleware
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//set static folder
app.use(express.static(`${__dirname}/public`));
//index route
app.get('/',(req,res)=>{
    res.render('index',{stripePublishablekey: keys.stripePublishableKey});
});
//charge route
app.post('/charge',(req,res)=>{
    const amount=1000;
   stripe.customers.create({
       email:req.body.stripeEmail,
       source:req.body.stripeToken
   }).then(customer=>stripe.charges.create({
       amount,
       description:"wale tayo ebook",
       currency:'usd',
       customer:customer.id
   }))
       .then(charge=>{
           res.render('success');
       })
})

const port =process.env.PORT||5000;
app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
});
