import sendgrid from "@sendgrid/mail";

export const sendEmail = async (
  sendGridApiKey: string,
  from: string,
  to: string,
  subject: string,
  text: string
) => {
  sendgrid.setApiKey(sendGridApiKey);
  await sendgrid.send({to, from, subject, text});
};
