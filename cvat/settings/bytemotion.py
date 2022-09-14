from .production import *

# Avoid proper account registration
ACCOUNT_AUTHENTICATION_METHOD = "username_email"
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"

# Don't show unassigned tasks to any user
RESTRICTIONS["reduce_task_visibility"] = True
