import { parse } from 'querystring';
import fetch from 'node-fetch';

exports.handler = async (event, context) => {
  try {
    // Parse the incoming form data
    const formData = parse(event.body);

    // Set up the Resend API request
    const from = 'PopVulture <info@popvulture.org>';
    const to = 'evanducote@gmail.com';
    const subject = `PopVulture Form Submission from ${formData.email}`;
    const body = formData.message;

    // Set up the email request
    const emailRequest = {
      from,
      to,
      subject,
      body,
    };

    // Send the email using the Resend API
    const response = await fetch('https://api.resend.com/send-email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND}`,
        'Content-Type': 'application/json',
    'X-Entity-Ref-ID': Math.floor(Date.now() / 1000).toString(),
      },
      body: JSON.stringify(emailRequest),
    });

    // Check if the email was sent successfully
    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Email sent successfully',
        }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to send email',
          error: response.statusText,
        }),
      };
    }
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