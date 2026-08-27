const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.send"
];

const CREDENTIALS_PATH =
    path.join(
        __dirname,
        "credentials.json"
    );

const TOKEN_PATH =
    path.join(
        __dirname,
        "token.json"
    );


/* =========================================================
   READ CREDENTIALS
========================================================= */

function loadCredentials() {

    if (!fs.existsSync(CREDENTIALS_PATH)) {

        throw new Error(
            "credentials.json not found."
        );
    }


    return JSON.parse(
        fs.readFileSync(
            CREDENTIALS_PATH,
            "utf8"
        )
    );
}


/* =========================================================
   CREATE OAUTH CLIENT
========================================================= */

function createClient() {

    const credentials =
        loadCredentials();


    const config =
        credentials.installed ||
        credentials.web;


    if (!config) {

        throw new Error(
            "Invalid Google OAuth credentials file."
        );
    }


    return new google.auth.OAuth2(
        config.client_id,
        config.client_secret,
        config.redirect_uris
            ? config.redirect_uris[0]
            : "http://localhost:3000/oauth2callback"
    );
}


/* =========================================================
   SAVE TOKEN
========================================================= */

function saveToken(
    client
) {

    fs.writeFileSync(
        TOKEN_PATH,

        JSON.stringify(
            client.credentials,
            null,
            2
        )
    );


    console.log(
        "token.json saved successfully."
    );
}


/* =========================================================
   GET AUTH CLIENT
========================================================= */

async function authorize() {

    const client =
        createClient();


    /*
       Existing token?
    */

    if (
        fs.existsSync(
            TOKEN_PATH
        )
    ) {

        const token =
            JSON.parse(
                fs.readFileSync(
                    TOKEN_PATH,
                    "utf8"
                )
            );


        client.setCredentials(
            token
        );


        console.log(
            "Existing Gmail token loaded."
        );


        return client;
    }


    /*
       No token yet.
       Start OAuth flow.
    */

    const authUrl =
        client.generateAuthUrl({

            access_type:
                "offline",

            scope:
                SCOPES,

            prompt:
                "consent"

        });


    console.log(
        "\n========================================"
    );

    console.log(
        "Open this URL in your browser:"
    );

    console.log(
        authUrl
    );

    console.log(
        "========================================\n"
    );


    const rl =
        readline.createInterface({
            input:
                process.stdin,

            output:
                process.stdout
        });


    const code =
        await new Promise(
            (resolve) => {

                rl.question(
                    "Enter the authorization code: ",
                    resolve
                );

            }
        );


    rl.close();


    const {
        tokens
    } =
        await client.getToken(
            code.trim()
        );


    client.setCredentials(
        tokens
    );


    saveToken(
        client
    );


    return client;
}


/* =========================================================
   RUN
========================================================= */

authorize()
    .then(
        () => {

            console.log(
                "Gmail authorization completed."
            );

        }
    )
    .catch(
        (error) => {

            console.error(
                "\nGmail authorization failed:"
            );

            console.error(
                error.message
            );

        }
    );