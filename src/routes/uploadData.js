const firestoreService = require('firestore-export-import')
const account = require('./randmsg-6e026-firebase-adminsdk-2m7vt-981323e8e1.json')
const url = "https://randmsg-6e026.firebaseio.com "
firestoreService.initializeApp(account,url)
firestoreService.restore("./data.json")