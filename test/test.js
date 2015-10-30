var expect = require('chai').expect
var request = require('request');
var request = require('superagent');

var path = process.env.KEY || "http://localhost:8080/v1/marks"


describe('Post', function(){
  it('Accepts a good worksheet', function(done){
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
  it('Accepts a good homework', function(done){
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
  it('Throws back a missing task_type', function(done){
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
  it('Throws back a missing student', function(done){
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
  it('Throws back a bad task type', function(done){
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
  it('Throws back more marks than marks out of', function(done){
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
  })
});

describe('Get', function(){
  describe('Get results without a student', function(){
    it('Should break because I havent provided a student', function(done){
      request
        .get(path)
        .end(function(err, res){
          expect(err).to.not.equal(null);
          expect(res.statusCode).to.equal(400);
          done()
        });
    })
  });
  describe('Get all results for Darren', function(){
    it('Should return successfully', function(done){
      request
        .get(path+"?student=darrent")
        .end(function(err, res){
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.not.equal(null);
          done()
        });
    });
    it('Should return more than 0 results', function(done){
      request
        .get(path+"?student=darren")
        .end(function(err, res){
          expect(err).to.equal(null);
          expect(res.statusCode).to.equal(200);
          expect(res.body.length).to.be.above(0);
          done();
        })
    })
  })
})
