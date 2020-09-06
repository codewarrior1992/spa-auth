let express = require('express');
let router = express.Router();
const firebaseDb = require('../connections/firebase-admin');
const fireAuth = require('../connections/firebase');

router.post('/sign-up', function (req, res, next) {
	let { email, password } = req.body.data;

	fireAuth
		.createUserWithEmailAndPassword(email, password)
		.then((response) => {
			let userData = {
				email,
				uid: response.user.uid,
			};
			firebaseDb.ref(`/users/${response.user.uid}`).set(userData);
			res.send({
				success: true,
				response,
				responseText: '註冊成功',
			});

			res.end();
		})
		.catch(function (error) {
			let errorCode = error.code;
			let errorMessage = error.message;
			res.send({
				success: false,
				errorCode,
				errorMessage,
			});
		});
	// }
});

router.post('/sign-in', function (req, res, next) {
	let { email, password } = req.body.data;

	fireAuth
		.signInWithEmailAndPassword(email, password)
		.then((response) => {
			console.log(fireAuth.currentUser);

			/* */
			req.session.uid = response.user.uid;
			let uid = req.session.uid;
			/* */

			res.send({
				success: true,
				response,
				uid,
				responseText: '登入成功',
			});

			res.end();
		})
		.catch(function (error) {
			// Handle Errors here.
			let errorCode = error.code;
			let errorMessage = error.message;
			// ...
			res.send({
				success: false,
				errorCode,
				errorMessage,
			});
		});
});

module.exports = router;
