const Meaning = require('the-ultimate-question');

module.exports = {

  purpose: function(req, res) {
    return res.json({
      answer: Meaning.answer(),
      question: Meaning.question()
    });
  }
};

