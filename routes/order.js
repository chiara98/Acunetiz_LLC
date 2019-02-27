const express = require('express');
//required for middleware req.params
const router = express.Router({ mergeParams: true });
const Company = require('../models/company');
const Order = require('../models/order');

//Helper function
const authCheck = (req, res, next) => {
  if(!req.user){
    //if user is not logged in
    res.redirect("/auth/login");
  }else{
    next();
  }
};

// GET request to new order
router.get('/new', authCheck, (req, res, next) => {
  //Finds company based on the companyId that is in the requst parameters
  Company.findById(req.params.companyId, function(err, company) {
    if(err) { console.error(err) };
    //Once found then it renders a new page with a  form that to input order information
    // passing the instance of a company to equa
    res.render('order/new', { comapny: company });
  });
});

//Create new order
//POST request to submit information from the HTML to the database
router.post('/', authCheck, (req, res, next) => {
  //Find the company based on the company id that was sent through the parameters
  Company.findById(req.params.companyId, function(err, company) {
    // If there is an error then log the error
    if(err) { console.error(err) };
    // create an instance of a order and set it equal to a new order that takes in the req.body
    //bodyParser will read the data from the HTML

    let order = new Order(req.body);
    //Tie the order to the company
    order.company = company;
    //Save the new order into the database
    order.save(function(err, order) {
      // If error then print it
      if(err) { console.error(err) };
      //Otherwise redirect the user to the url company/company._id
      return res.redirect(`/company/${company._id}`);
    });
  });
});

//
//Order Update
//I would check if an admin is trying to access this routes
router.post('/:id', authCheck, (req, res, next) => {
  //find order by id in the database
  //takes in the req body to gather the updated informtaion

  Order.findByIdAndUpdate(req.params.id, req.body, function(err, company) {
    if(err) { console.error(err) };

    res.redirect('/company/' + req.params.company_id);
  });
});

//Delete Order
//I would check if an admin is trying to access this routes
router.delete('/:id', authCheck, (req, res, next) => {
  //delete order by id
  //remove method to remove by id
  order.remove({
    _id: req.params.id
  }, function(err){
    //log error if there is one
    if(err){
      console.error(err);
    }else {
      //otherwise send the string
      res.send('Deleted');
    }
  })
})


module.exports = router;
