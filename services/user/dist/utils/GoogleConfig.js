import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const GoogleConfig = () => {
    const oauth2Client = new google.auth.OAuth2(process.env.Google_Client_ID, process.env.Google_Client_Secret, 'http://localhost:3000/auth/google/callback');
};
