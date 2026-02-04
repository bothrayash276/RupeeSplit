import express from "express";
import cors from "cors";
import "dotenv/config";
import setArray from "./setArray.js";
import Transactions from "./minimumTransaction.js";
import { MongoClient } from "mongodb";
import { removefromGroup, removefromUserDB } from "./removeFromGroup.js";
const app = express();
const port = process.send.PORT;

const client = new MongoClient(process.env.MONGODB_URI);

client.connect();

const notExist = {
  doesExist: false,
};

app.use(cors());
app.use(express.json());

app.get("/find/:email", async (req, res) => {
  const email = req.params.email;
  const db = await client.db("RupeeSplit");
  const col = await db.collection("users");
  const user = await col.findOne({ email });
  if (user) {
    res.json(user);
  } else {
    res.json(notExist);
  }
});

app.get("/grpmem/:uid", async (req, res) => {
  const uid = req.params.uid;
  const db = await client.db("RupeeSplit");
  const col = await db.collection("users");
  const user = await col.findOne({ uid });
  if (user) {
    res.json(user);
  } else {
    res.json(uid);
  }
});

app.post("/register", async (req, res) => {
  const db = await client.db("RupeeSplit");
  const collection = await db.collection("users");
  const data = await req.body;
  const email = data.email;
  const user = await collection.findOne({ email });
  if (!user) {
    await collection.insertOne(data);
    res.json(data);
  }
  else {
    res.json(user)
  }
});

app.post('/update', async (req, res) => {
  const db = await client.db('RupeeSplit')
  const collection = await db.collection('users')
  const data = await req.body
  const email = data.email
  const user = await collection.findOneAndReplace({email}, data)
  res.send("updated successfully")
})

app.get('/findFriend/:uid', async (req, res) => {
  const uid = req.params.uid
  const db = await client.db('RupeeSplit')
  const collection = await db.collection('users')
  const file = await collection.findOne({uid})
  if(file){
    res.json(file)
  }
  else{
    res.json({
      'doesExist' : false
    })
  }
})

app.post('/addFriend', async (req, res) => {
  const db = await client.db('RupeeSplit')
  const collection = await db.collection('users')
  const dataObj = await req.body
  const user1 = dataObj[0]
  const user2 = dataObj[1]
  const email1 = user1.email
  const email2 = user2.email
  await collection.findOneAndUpdate({email: email1}, {
    $set: {friends: setArray(user1.friends)}
  })
  await collection.findOneAndUpdate({email: email2}, {
    $set: {friends: setArray(user2.friends)}
  })
});

app.post("/newgrp", async (req, res) => {
  const db = await client.db("RupeeSplit");
  const collection = await db.collection("groups");
  const data = await req.body;
  await collection.insertOne(data);
  res.send("Group Created Successfully")
});

app.post("/updategrp", async (req, res) => {
  const db = await client.db("RupeeSplit");
  const collection = await db.collection("groups");
  const {_id, ...data} = await req.body;
  const id = data.id;
  await collection.findOneAndReplace({id}, data)
  res.send("Group Created Successfully")
});

app.get("/findgrp/:grpID", async (req, res) => {
  const grpID = req.params.grpID;
  const db = await client.db("RupeeSplit");
  const col = await db.collection("groups");
  const user = await col.findOne({ id: grpID });
  res.json(user)
});

app.post("/deleteUserFromGroup", async (req, res) => {
  const [userId, groupId] = await req.body
  const db = await client.db('RupeeSplit')
  const collection = db.collection('groups')
  const userCollection = db.collection('users')
  const group = await collection.findOne({id: groupId})
  const user = await userCollection.findOne({uid: userId})
  const removedUser = await removefromUserDB(groupId, user)
  const removedGroup = await removefromGroup(userId, group)
  if(group.members.length === 1) {
    await collection.deleteOne({id: groupId})
  }
  else {
    await collection.findOneAndReplace({id: groupId}, removedGroup)
  }
  await userCollection.findOneAndReplace({uid: userId}, removedUser)
  res.send("User removed successfully")
}) 

app.post('/transaction', async (req, res) => {
  const data = await req.body
  const filtered_dues = Transactions(data)
  res.json(filtered_dues)
})

app.post('/grpInvite', async (req, res) => {
  const [f, g] = await req.body
  const {_id : id1, ...friend} = f
  const {_id : id2, ...group} = g

  const db = await client.db('RupeeSplit')
  const collGroup = await db.collection('groups')
  const collFriend = await db.collection('users')

  await collFriend.findOneAndReplace({uid : friend.uid}, friend)
  await collGroup.findOneAndReplace({id : group.id}, group)
})




app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
