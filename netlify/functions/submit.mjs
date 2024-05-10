import { Resend } from "resend";
import { parse } from 'querystring';

exports.handler = async (event, context) => {
  try {
    const resend = new Resend(process.env.RESEND);
    // Parse the incoming form data
    const formData = parse(event.body);

    // Set up the Resend API request
    const from = 'PopVulture <info@popvulture.org>';
    const to = ['evanducote@gmail.com'];
    const subject = `PopVulture Form Submission from ${formData.email}`;
    const text = formData.message;
    const headers = {"X-Entity-Ref-ID":Math.floor(Date.now() / 1000).toString()};
    const tags = [{name: "category",value: "email_submission"}];
    
    // Set up the email request
    const emailRequest = {
      from,
      to,
      subject,
      text,
      headers,
      tags
    };
    
    await resend.emails.send(emailRequest);

    // Check if the email was sent successfully
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Email sent successfully',
        }),
      };

  } catch (error) {
    // Handle any errors that occur during processing
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to process form data',
        error: error.toString(),
      }),
    };
  }
};