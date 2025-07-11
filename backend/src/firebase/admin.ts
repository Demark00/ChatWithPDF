import admin from "firebase-admin";
import * as serviceAccount from "./credentials.json"

// Prevent reinitialization in dev
if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    })
}

export default admin;