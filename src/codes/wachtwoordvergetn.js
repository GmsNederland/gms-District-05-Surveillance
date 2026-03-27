
        // Firebase configuratie (invullen met jouw gegevens)
        const firebaseConfig = {
            apiKey: "JOUW_API_KEY",
            authDomain: "JOUW_PROJECT_ID.firebaseapp.com",
            databaseURL: "https://JOUW_PROJECT_ID.firebaseio.com",
            projectId: "JOUW_PROJECT_ID",
            storageBucket: "JOUW_PROJECT_ID.appspot.com",
            messagingSenderId: "JOUW_MESSAGING_SENDER_ID",
            appId: "JOUW_APP_ID"
        };

        // Firebase initialiseren
        const app = firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database();

        function sendResetEmail() {
            const email = document.getElementById('email').value;
            const messageEl = document.getElementById('message');

            if (!email) {
                messageEl.textContent = 'Vul een geldig e-mailadres in.';
                messageEl.className = 'message error';
                return;
            }

            // Firebase wachtwoord reset e-mail
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    messageEl.textContent = 'Reset link is verzonden naar je e-mail.';
                    messageEl.className = 'message';
                })
                .catch((error) => {
                    messageEl.textContent = `Fout: ${error.message}`;
                    messageEl.className = 'message error';
                });
        }

        document.getElementById("inloggen").onclick = function () {
            window.location.href = "/index.html";
        }