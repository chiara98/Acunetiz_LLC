const express = require('express');
const router = express.Router({mergeParams: true});
const Company = require('../models/company');
const orders = require('./order');
const Order = require('../models/order');
const products = require('./product')

//Helper function for checking if a user is logged in.
const authCheck = (req, res, next) => {
  //request the user and if there is not a user:
  if(!req.user){
    //if user is not logged in
    //redirect to the login page
    res.redirect("/auth/login");
  }else{
    // if there is a user then continue
    next();
  }
};

// Company index
// GET request that will display the company name that was registered
router.get('/', (req, res,next) => {
  //find function will find a
  Company.find({}, 'name', function(err, company) {
    if (err) {
      console.error(err);
    }else {
      res.render('company/index', {company: company}, {user:req.user});
    }
  });
});

// Register new company
//This route GET will send the user to company/new which will render the ejs template that will show
// the company registeration form.
router.get('/new', authCheck, (req, res, next) => {
  res.render('company/new', {user: req.user});
});


  // From company index you can click on the company name and further information will load, such as
  // products
  //Show company details
  router.get('/:id', authCheck, (req, res, next) => {

    console.log(id);
    //GET request will take in the company id and find the specific company based on the id that was sent in from the paramaters
    Company.findById(req.params.company_id, function(err, company) {
      if(err) { console.error(err) };
      //Retrieve product from that company

      Product.find({ company: company })
        if(err) { console.error(err) };
        // render a page that will display the products and company

        res.render('company/show', { company: company, products : products, companyId: req.params.id, user: req.user });

    });
  });

//This POST request will save the data for a new company
router.post('/', authCheck, (req,res, next) => {
    console.log(req.body);
    // create an instance of company and set it equal to a new company that takes in the requst body
    const company = new Company(req.body);
    //mongoose function save() will save that company into the database

    company.save(function(err, company) {
      if(err) console.log(err);


      //Redirect the user to a page that will conatain that company
      return res.redirect('/company');

  })

  });



// router.use method to nest routes
// Each product is tied to a specified company id
router.use('/:companyId/products', products);
router.use('/:companyId/order', orders);
module.exports = router;
