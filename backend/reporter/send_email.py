'''----------------- 
# Title: send_email.py
# Author: Parker Clark
# Date: 2/10/2025
# Description: Emailing functionality to send webmaster a report of a problem.
-----------------'''

#---Imports---#
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

#---Constants---#
REPORTER_EMAIL = os.getenv('REPORTER_EMAIL')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

def send_email(return_address, issue):
    '''
        A function to send an email to the webmaster with a report of a problem.

        Parameters
        ----------
        return_address (str): 
            The email address of the user reporting the problem.
        issue (str): 
            The issue being reported.

        Returns
        ----------
        None
    '''

    try:
        # Grab the email address of the webmaster(s)
        email_address = _grab_email_address()

        # Create an email message object, define From, To, and Subject fields
        msg = EmailMessage()
        msg.set_content(f'User ({return_address}) has reported the following issue:\n\n{issue}')
        msg['Subject'] = 'Problem Reported'
        msg['From'] = REPORTER_EMAIL
        msg['To'] = email_address

        with smtplib.SMTP('smtp.gmail.com', 587) as smtp:

            # Begin TLS encryption for the email connection
            smtp.starttls()

            # Login to the email server using credentials from the environment
            smtp.login(REPORTER_EMAIL, EMAIL_PASSWORD)

            # Send the email message to the webmaster(s)
            smtp.send_message(msg)
            smtp.quit()

            return True
    
    except Exception as e:

        # Print the error message if an exception occurs
        print(f"An error occurred while sending the email: {e}")
        return False

def _grab_email_address():
    '''
        A function to grab the email addresses defined in the webmaster list.

        Returns
        ----------
        email_address (str): 
            The email addresses of the webmaster(s).
    '''

    # Get the absolute path to the .webmaster_emails.txt file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    email_file_path = os.path.join(base_dir, '.webmaster_emails.txt')

    # Open and grab emails present in the list of webmaster emails
    with open(email_file_path, 'r', encoding='utf-8') as f:
        email_addresses = f.readlines()

    # Generate a string of email addresses from the list, comma separated
    email_addresses = ','.join([email.strip() for email in email_addresses])

    return email_addresses
