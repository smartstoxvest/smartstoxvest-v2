import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM")

def send_reset_email(to_email: str, token: str):
    reset_link = f"{os.getenv('FRONTEND_URL')}/reset-password?token={token}"
    message = Mail(
        from_email=EMAIL_FROM,
        to_emails=to_email,
        subject="🔐 SmartStoxVest Password Reset Request",
        html_content=f"""
        <p>Hi there,</p>
        <p>You requested a password reset. Click the link below to reset it:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
        <p>If you didn’t request this, just ignore this email.</p>
        """
    )
    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)
        return True
    except Exception as e:
        print("❌ Email sending failed:", e)
        return False
