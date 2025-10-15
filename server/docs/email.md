# Email Utility (Azure Communication Services)

Location: `server/utils/email_service.py`

## Function

- Name: `send_email(recipient: str, subject: str, content: str, content_type: str = "plainText")`
- Inputs:
  - `recipient`: recipient email address (string)
  - `subject`: email subject (string)
  - `content`: email body content (string)
  - `content_type`: The type of content, 'plainText' or 'html'. Defaults to 'plainText'.
- Output:
  - The result object from the Azure SDK poller, or `None` on exception. e.g. `{'id': str, 'status': 'Succeeded', 'error': None}`

## Setup

- Dependency is already listed in `server/requirements.txt`: `azure-communication-email`
- Set environment variables :
  - `AZURE_EMAIL_CONNECTION_STRING`
  - `AZURE_EMAIL_SENDER_ADDRESS`

## Learn more (Attachments or other features)

https://learn.microsoft.com/azure/communication-services/quickstarts/email/send-email?tabs=windows%2Cconnection-string%2Csend-email-and-get-status-async%2Casync-client&pivots=programming-language-python
