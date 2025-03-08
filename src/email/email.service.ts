import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailOptions, Transporter } from 'nodemailer';
import { sendEmailDto } from './dto/email.dto';

@Injectable()
export class EmailService {
  emailTransporter(): Transporter {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'localhost',
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    });
    return transporter;
  }

  async sendEmail(emailData: sendEmailDto) {
    const { recipients, subject, html } = emailData;
    const transporter = this.emailTransporter();

    // Convert subject to string if it's not already
    const emailSubject =
      typeof subject === 'string'
        ? subject
        : (subject as any)?.props?.children?.join('') || 'New Email';

    // Convert html to string if it's a React element
    const emailHtml =
      typeof html === 'string' ? html : this.convertReactElementToString(html);

    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(','),
      subject: emailSubject,
      html: emailHtml,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw error?.message;
    }
  }

  // Helper method to convert React element to string
  private convertReactElementToString(element: any): string {
    if (typeof element === 'string') return element;

    if (element && element.type && element.props) {
      // Handle basic conversion for common React elements
      const tag = element.type;
      const props = element.props;

      // Convert children to string
      const childrenToString = (children: any): string => {
        if (Array.isArray(children)) {
          return children
            .map((child) =>
              typeof child === 'string'
                ? child
                : typeof child === 'object'
                  ? this.convertReactElementToString(child)
                  : String(child),
            )
            .join('');
        }
        return typeof children === 'string' ? children : String(children);
      };

      // Handle different types of elements
      switch (tag) {
        case 'div':
          return `<div>${childrenToString(props.children)}</div>`;
        case 'h5':
          return `<h5>${childrenToString(props.children)}</h5>`;
        case 'p':
          return `<p>${childrenToString(props.children)}</p>`;
        case 'a':
          return `<a href="${props.href}">${childrenToString(props.children)}</a>`;
        default:
          return String(element);
      }
    }

    return String(element);
  }
}
