# ring-battery-monitor
A tool to check the battery level of a Ring camera and send an email notification if it falls below 10%. 

## Why?
The official Ring software used to send low battery notifications, but the feature was removed.

## How?
This is a Firebase function that runs each morning and uses [ring-client-api](https://github.com/dgreif/ring/tree/main/packages/ring-client-api) to check the battery level and send an email notification when it's below 10%.

If you want to use this yourself, there are a few steps to follow:

1. fork and clone the repository
2. set up a Firebase account
3. enable the Sendgrid API in GCP 
4. add the following secrets to the GitHub repo: 
* `FIREBASE_TOKEN` (generate with `firebase login:ci`)
* `RING_REFRESH_TOKEN` (see https://github.com/dgreif/ring/wiki/Refresh-Tokens)
* `SENDGRID_API_KEY` (follow the instructions after setting up Sendgrid)
5. add the following variables:
* `EMAIL_RECIPIENT` (address to receive the low battery alert)
* `EMAIL_SENDER` (should align with what you set up in Sendgrid)
* `PROJECT_ID` (ID of your Firebase project)

Pushes to the `main` branch will deploy the function.
