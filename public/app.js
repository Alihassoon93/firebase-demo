const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSigedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    whenSignedIn.hidden = false;
    whenSigedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3> <p>User ID: ${user.uid}</p>`;
  } else {
    // signed out
    whenSignedIn.hidden = true;
    whenSigedOut.hidden = false;
    userDetails.innerHTML = "";
  }
});

// datebase
const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingsList = document.getElementById("thingsList");

let thingsref;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    // signed in
    thingsref = db.collection("things");

    createThing.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;

      thingsref.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp(),
      });
    };

    unsubscribe = thingsref
      .where("uid", "==", user.uid)
      .orderBy("createdAt")
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name}</li>`;
        });

        thingsList.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
  }
});
