import clarifai from 'clarifai';

const app = new clarifai.App({
    apiKey: 'ef7a1ea9f0a944f8a61eb7b4a9d571a6'
   }); 

   
const handelApicall = (req,res) => {
    app.models.predict(
    clarifai.FACE_DETECT_MODEL,
    req.body.input)
    .then(data => {res.json(data)
    }).catch(err => res.status(400).json('unable to wrok with api'))
}
const handleImahe = (req,res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    }).catch(err => res.status(400).json("unable to get entries"))
}

export default {
    handleImahe,
    handelApicall
}