var expect = require('chai').expect
var request = require('request');
var request = require('superagent');
var argv = require('optimist').argv;
var moment = require('moment');


var today = moment();
var nextweek = today.add('days', 7);
var lastweek = today.add('days', -7)

var path = argv.path || "http://localhost:8080/v1/marks";


describe('Post', function(){
  it('accepts a good worksheet', function(done){
    request
      .post(path)
      .send({
        "task_type": "worksheet",
        "q1mark": 4,
        "q2mark": 5,
        "q3mark": 6,
        "q4mark": 7,
        "q1outof": 4,
        "q2outof": 5,
        "q3outof": 6,
        "q4outof": 7,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      })
  })
  it('accepts a good homework', function(done){
    request
      .post(path)
      .send({
        "task_type": "homework",
        "q1mark": 4,
        "q2mark": 5,
        "q1outof": 4,
        "q2outof": 5,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        done();
      })
  })
  it('throws 400 back a missing task_type', function(done){
    request
      .post(path)
      .send({
        "q1mark": 4,
        "q2mark": 5,
        "q1outof": 4,
        "q2outof": 5,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.not.equal(null);
        expect(res.statusCode).to.equal(400);
        done();
      })
  })
  it('throws 400 back a missing student', function(done){
    request
      .post(path)
      .send({
        "task_type": "homework",
        "q1mark": 4,
        "q2mark": 5,
        "q1outof": 4,
        "q2outof": 5
      })
      .end(function(err, res){
        expect(err).to.not.equal(null);
        expect(res.statusCode).to.equal(400);
        done();
      })
  })
  it('throws 400 back a bad task type', function(done){
    request
      .post(path)
      .send({
        "task_type": "car boot sale",
        "q1mark": 4,
        "q2mark": 5,
        "q1outof": 4,
        "q2outof": 5,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.not.equal(null);
        expect(res.statusCode).to.equal(400);
        done();
      })
  })
  it('throws 400 back when there are more marks than marks out of for a given question', function(done){
    request
      .post(path)
      .send({
        "task_type": "homework",
        "q1mark": 10,
        "q2mark": 5,
        "q1outof": 4,
        "q2outof": 5,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.not.equal(null);
        expect(res.statusCode).to.equal(400);
        done();
      })
  });
  it('throws 400 back an error when a mark is negative', function(done){
    request
      .post(path)
      .send({
        "task_type": "homework",
        "q1mark": -1,
        "q2mark": 5,
        "q1outof": 4,
        "q2outof": 5,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.not.equal(null);
        expect(res.statusCode).to.equal(400);
        done();
      })
  });
  it('throws 400 back an error when a mark out of is negative', function(done){
    request
      .post(path)
      .send({
        "task_type": "homework",
        "q1mark": 1,
        "q2mark": 5,
        "q1outof": -4,
        "q2outof": 5,
        "student": "darren"
      })
      .end(function(err, res){
        expect(err).to.not.equal(null);
        expect(res.statusCode).to.equal(400);
        done();
      })
  });
});

describe('Get', function(){
  describe('results without a student', function(){
    it('should break because I havent provided a student', function(done){
      request
        .get(path)
        .end(function(err, res){
          expect(err).to.not.equal(null);
          expect(res.statusCode).to.equal(400);
          done()
        });
    })
  });
  describe('all results for Darren', function(){
    it('should return successfully', function(done){
      request
        .get(path+"?student=darren")
        .end(function(err, res){
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.not.equal(null);
          done()
        });
    });
    it('should return more than 0 results', function(done){
      request
        .get(path+"?student=darren")
        .end(function(err, res){
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.length).to.be.above(0);
          done();
        })
    })
    it('should return 0 results for a date in the future', function(done){
      request
        .get(path+"?student=darren&from="+encodeURIComponent(nextweek.format())+"&to="+encodeURIComponent(nextweek.format()))
        .end(function(err, res){
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.length).to.be(0);
          done();
        })
    });
    it('throws 400 if I give a really honky date', function(done){
      request
        .get(path+"?student=darren&from="+encodeURIComponent(nextweek.format())+"&to=jan 37th 2015")
        .end(function(err, res){
          expect(err).to.not.equal(null);
          expect(res.statusCode).to.equal(400);
          done();
        })
    })
    it('throws 400 if the date to is less than the date from', function(done){
      request
        .get(path+"?student=darren&from="+encodeURIComponent(nextweek.format())+"&to="+encodeURIComponent(lastweek.format()))
        .end(function(err, res){
          expect(err).to.not.equal(null);
          expect(res.statusCode).to.equal(400);
          done();
        })
    });
  })
})
