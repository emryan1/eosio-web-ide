const parecordService = require('../services/parecord.service')

module.exports = {
    createPArecord,
    getPArecords,
    deletePArecord
};


function createPArecord(req, res, next) {
    //console.log(req);
    parecordService.addPArecord(req.body, req.user.sub)
        .then(() => res.send(['Recorded!']))
        .catch(err => next(err));
}

function getPArecords(req,res,next){
    parecordService.getAllPArecords()
        .then(parecords => res.json(parecords))
        .catch(err => next(err));}


function deletePArecord(req,res,next){
    parecordService.deletePArecord(req.params.date, req.user.sub)
        .then(amountdel => {
            res.send(['Deleted:' + amountdel.deletedCount]);
        })
        .catch(err => next(err));
}
