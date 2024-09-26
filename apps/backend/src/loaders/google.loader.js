import { OAuth2Client } from "google-auth-library";
import { environment } from "./environment.loader.js";

const client = new OAuth2Client(
  environment.GOOGLE_CLIENT_ID,
  environment.GOOGLE_CLIENT_SECRET,
  //environment.GOOGLE_REDIRECT_URL
  environment.GOOGLE_REDIRECT_URL ||
    "http://localhost:3000/auth/google-calendar",
);

const OauthCalClient = new OAuth2Client(
    environment.GOOGLE_CLIENT_ID,
    environment.GOOGLE_CLIENT_SECRET,
    environment.GOOGLE_CALENDAR_REDIRECT_URL
)

const OauthClient = client;

export {
    OauthClient, OauthCalClient
}
