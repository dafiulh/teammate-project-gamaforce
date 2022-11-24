var express = require('express');
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKeys.json");
var router = express.Router();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gamaforce-30380-default-rtdb.asia-southeast1.firebasedatabase.app"
});

var db = admin.firestore();
var collRef = db.collection("missions");

router.get('/list', async function(req, res) {
  var missions = {};
  var snap = await collRef.get();

  snap.forEach(doc => {
      missions[doc.id] = doc.data().name;
  })

  res.status(200).json(missions);
});

router.get('/get/:id', async function(req, res) {
  if (!req.params.id)
    return res.status(400).json({ success: false });

  const id = req.params.id;
  const snap = await collRef.doc(id).get();

  res.status(200).json(snap.data());
});

router.post('/add', async function(req, res) {
  if (!req.body.name) 
    return res.status(400).json({ success: false });

  const doc = await collRef.add(req.body);
  res.status(200).json({ success: true, id: doc.id });
});

router.patch('/update/:id', async function(req, res) {
  if (!req.params.id)
    return res.status(400).json({ success: false });

  await collRef.doc(req.params.id).update(req.body);
  res.status(200).json({ success: true });
});

router.delete('/delete/:id', async function(req, res) {
  if (!req.params.id)
    return res.status(400).json({ success: false });

  await collRef.doc(req.params.id).delete();
  res.status(200).json({ success: true });
});

module.exports = router;
