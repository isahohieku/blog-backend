import nodemailer, { Transporter } from 'nodemailer';
import mailgunTransport from 'nodemailer-mailgun-transport';
import mg from 'mailgun-js';

class EmailHandler {
    // Configure transport options
    private api_key: string = process.env.MAILGUN_ACTIVE_API_KEY;
    private domain: string = process.env.MAILGUN_DOMAIN;
    private mailgunOptions: mailgunTransport.Options = {
        auth: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            api_key: this.api_key,
            domain: this.domain
        }
    };
    private mailgunTransporter: mailgunTransport.MailgunTransport = mailgunTransport(this.mailgunOptions);
    private transporter: Transporter;
    private mailgun: mg.Mailgun = mg({ apiKey: this.api_key, domain: this.domain });

    public constructor() {
        this.transporter = nodemailer.createTransport(this.mailgunTransporter);
    }

    /**
   * @param to - Email recipient
   * @param subject - Email subject
   * @param data - Data to be sent
   * @param templateName - (optional) EJS template to be used
   * @param content - (optional) Body of the email
   */
    public sendEmail(to: string, subject: string, data: any, templateName?: string, content?: string): Promise<any> {
        return new Promise((resolve, reject): any => {

            const mailOptions: any = { from: 'Isah Ohieku no-reply@isahohieku.com', to, subject };

            const template = `
                    <html>
                        <head>
                            <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/>
                                <o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                            <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
                            <meta content="width=device-width" name="viewport"/>
                            <!--[if !mso]><!-->
                            <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
                        </head>

                        <body>
                            <p>Hello, you're getting this email because Isah is writing an app.</p>

                            <p>Have a lovely day</p>
                        </body

                    </html>
                `;

            mailOptions.html = template;
            if (content) {
                mailOptions.html = content;
            }

            this.transporter.sendMail(mailOptions, (error, info): any => {
                if (error) { return reject(error); }
                console.log(info);
                console.log('Error', error);
                return resolve(info);
            });

        });
    }

    public addToMailingList(listName: string, subscriber: { fullName: string; email: string }): Promise<any> {
        return new Promise((resolve, reject): any => {
            const list = this.mailgun.lists(`${listName}@${this.domain}`);
            const newSubscriber = {
                subscribed: true,
                address: subscriber.email,
                name: subscriber.fullName
            };

            list.members().create(newSubscriber, function (error, data): any {
                return error ? reject(error) : resolve(data);
            });
        });
    }
}

export default new EmailHandler();