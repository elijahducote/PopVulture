import axios from "axios";
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
    const email = formData.email.substring(0, formData.email.indexOf("@"));
    const subject = `PopVulture Submission from ${email}`;
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
    
    const hf = axios.create(
      {
        baseURL: "https://api-inference.huggingface.co",
        timeout: 8000,
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_KEY}`,
          "Content-Type": "application/json",
          // "X-Wait-For-Model": true
        }
      }
      ),
      prompt = `"${text}".\nDecide this message's magnitude (0-9) on how it factors under the wider context & subtleties of red flags, if it sounds like it's employing tactics of misleading/suspicious/spam/scam/phishing/social engineering attempts.\nMake an informed decision for the resulting number on its own newline; no exceptions. Lastly, make sure to reword your explanation like you are firmly stating the reason a person's email was rejected from the final approximation.`,
      resp = await hf.post(
        "/models/mistralai/Mistral-7B-Instruct-v0.3/v1/chat/completions", 
        {
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                }
                ]
            }
            ],
            frequency_penalty: 1.327, // (-2,2) how much is it to be unlike the diction from the model
            presence_penality: 0.7753, // (-2,2) how much is it to be unlike the input prompt(s)
            //temperature: .815, // (0-2) how predictable/unpredictable the conditioning is 
            max_tokens: 1024, // total tokens that can be generated
            top_p: .795, // (0-1) how much of a percentage to sample from a pool of token probablities
            seed: 71594052, // random seed
            stream: false
        }
        );
        
        const msg = resp.data.choices[0].message.content.split("\n"),
        reason = msg[2].split(". ",1)[0],
        number = parseInt(msg[0][msg.length - 1]);
        
        if (number < 6) throw Error(reason);
        
        await resend.emails.send(emailRequest);
        
        // Check if the email was sent successfully
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "text/html"
          },
          body: `<!doctype html><html><head><title>Thank you!</title><link href=../../fonts.css rel=stylesheet></head><body><style>:root{font-size:1px}body,html{background:#000;font-size:35rem;font-family:Brisa Sans}}.container{padding:0;min-width:auto;margin:0 -50% 0 -50%;width:100%;max-height:100vh;max-width:100vw;display:block;position:absolute;inset:0 50% 0 50%;box-sizing:content-box;background:#000}@media (min-height:626px) and (min-width:365px){.container{font-size:20rem}}@media (min-height:912px) and (min-width:540px){.container{font-size:40rem}.container{font-size:60rem}}@media (min-width:992px) and (min-height:654px){.container{font-size:100rem}}@media (min-width:1363px) and (min-height:559px){.container{font-size:120rem}}@media (min-width:1932px) and (min-height:1121px){.container{font-size:150rem}}.wrapper{line-height:1.5em;letter-spacing:.075em;right:100%;margin:50% 0 0 0;color:#fff;left:0;width:100%;padding:0;position:absolute;box-sizing:border-box;display:flex;text-align:center;justify-content:center;align-content:center;object-position:center;align-items:center}svg{width:5em}</style><div class=container><div class=wrapper style="margin:0 auto"><svg fill=none viewBox="0 0 24 24"xmlns=http://www.w3.org/2000/svg><path clip-rule=evenodd d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-6-3c.3.3.3.7 0 1l-5 5c-.3.3-.7.3-1 0l-2-2a.7.7 0 1 1 1-1l1.5 1.4 2.2-2.2L15 9c.3-.3.7-.3 1 0Z"fill=#7FFFD4 fill-rule=evenodd /></svg></div><div class=wrapper><h2 style=color:#7fffd4>Received.</h2></div><br><br><br><div class=wrapper><p><span style=font-style:italic>Hi ${email},</span> we will get back with you, shortly!</div></div></body></html>`,
        };
        
  } catch (error) {
    // Handle any errors that occur during processing
    return {
      statusCode:400,
      headers: {
        "Content-Type": "text/html"
      },
      body:`<!doctype html><html><head><title>Try again.</title><link href=../../fonts.css rel=stylesheet></head><body><style>:root{font-size:1px}body,html{background:#000;font-size:35rem;font-family:Brisa Sans}.container{padding:0;min-width:auto;margin:0 -50% 0 -50%;width:100%;max-height:100vh;max-width:100vw;display:block;position:absolute;inset:0 50% 0 50%;box-sizing:content-box;background:#000}@media (min-height:626px) and (min-width:365px){.container{font-size:20rem}}@media (min-height:912px) and (min-width:540px){.container{font-size:40rem}.container{font-size:60rem}}@media (min-width:992px) and (min-height:654px){.container{font-size:100rem}}@media (min-width:1363px) and (min-height:559px){.container{font-size:120rem}}@media (min-width:1932px) and (min-height:1121px){.container{font-size:150rem}}.wrapper{line-height:1.5em;letter-spacing:.075em;right:100%;margin:50% 0 0 0;color:#fff;left:0;width:100%;padding:0;position:absolute;box-sizing:border-box;display:flex;text-align:center;justify-content:center;align-content:center;object-position:center;align-items:center}svg{width:5em}</style><div class=container><div class=wrapper style="margin:0 auto"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#FF0000" fill-rule="evenodd" d="M21.7 20.2c.3.4.3 1 0 1.5a1 1 0 0 1-1.5 0L16 17.4l-4.3 4.3a1 1 0 0 1-1.4 0 1 1 0 0 1 0-1.4l4.3-4.3-4.3-4.2a1 1 0 1 1 1.4-1.4l4.3 4.2 4.3-4.3a1 1 0 0 1 1.4 0c.4.4.4 1 0 1.4L17.4 16l4.3 4.2ZM16 0a16 16 0 1 0 0 32 16 16 0 0 0 0-32Z"/></svg></div><div class=wrapper><h2 style=color:#FF0000>Failed.</h2></div><br><br><br><div class=wrapper><p><span style=font-style:italic>Oops.</span>  Something is afoot! ${error}</div></div></body></html>`,
    };
  }
};