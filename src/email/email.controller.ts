import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDto } from './dto/email.dto';

@Controller('api/v1/email')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }
    
    @Post('send')
    async sendEmail(@Body() body: sendEmailDto) {
        return await this.emailService.sendEmail(body);
     }
}
