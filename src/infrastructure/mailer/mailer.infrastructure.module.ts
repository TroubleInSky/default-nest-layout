import { Module } from "@nestjs/common";
import { appConfigInstance } from "../app-config/app-config.infrastructure";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        transport: {
          host: appConfigInstance.SMTP_HOST,
          port: appConfigInstance.SMTP_PORT,
          secure: appConfigInstance.SMTP_USE_SSL,
          auth: {
            user: appConfigInstance.SMTP_USER_NAME,
            pass: appConfigInstance.SMTP_PASSWORD
          }
        },
        defaults: {
          from: appConfigInstance.SMTP_SENDER_EMAIL
        },
        template: {
          dir: join(__dirname, "../../templates"),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        }
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot()
  ]
})
export class MailerInfrastructureModule {}
