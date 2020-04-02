const mongoose  = require('mongoose');
const db = require('../_helpers/database');
const PArecord = db.PArecord;


module.exports = {
    getAllPArecords,
   addPArecord,
   deletePArecord
}



async function getAllPArecords() {
    return PArecord.find({}).populate({path: 'createdBy'});
}

async function deletePArecord(date, username) {
    return await PArecord.deleteOne({ createdBy: username, createdDate: date  });
}

async function addPArecord(parecord, username) {

    // validate
    if (await PArecord.findOne({ createdBy: username, createdDate: parecord.createdDate  })) {
        throw 'Parecord created by"' + parecord.createdBy +" on "+ parecord.createdDate +'" already exists';
    }
    else if(!username){
        throw 'Error with the user submitting the request. User information missing. Malformed request.';
    }
    //populate missing fields in the parecord object
    let newrecord = parecord;
    parecord.createdBy = username;
    parecord.createdDate =  Date.now();

    let dbrecord = new PArecord(newrecord);

    // save the record
    await dbrecord.save();

}
