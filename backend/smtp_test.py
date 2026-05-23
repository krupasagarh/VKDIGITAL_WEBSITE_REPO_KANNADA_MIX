import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv


def main() -> None:
    load_dotenv(".env")

    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    user = os.environ.get("SMTP_USER")
    pwd = os.environ.get("SMTP_PASSWORD")
    mail_from = os.environ.get("MAIL_FROM", user)
    mail_to = os.environ.get("MAIL_TO")

    print("SMTP_HOST:", host)
    print("SMTP_PORT:", port)
    print("SMTP_USER:", user)
    print("MAIL_TO:", mail_to)

    msg = EmailMessage()
    msg["Subject"] = "VK Digital SMTP test"
    msg["From"] = mail_from
    msg["To"] = mail_to
    msg.set_content("This is a test email from VK Digital backend SMTP test.")

    try:
        with smtplib.SMTP(host, port, timeout=20) as smtp:
            smtp.set_debuglevel(1)
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(user, pwd)
            smtp.send_message(msg)
        print("SMTP_TEST: SUCCESS")
    except Exception as e:
        print("SMTP_TEST: FAILED")
        print(type(e).__name__, str(e))


if __name__ == "__main__":
    main()

