import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        console.log("email service", to)
        try {
            await this.transporter.sendMail({
                from: 'your-email@example.com',
                to,
                subject,
                text,
                html,
            });
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error(`Failed to send email to ${to}`, error.stack);
            throw new Error(`Unable to send email: ${error.message}`);
        }
    }
}
