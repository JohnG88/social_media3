import django_on_heroku
from decouple import config

from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = [
    'john-chat-1.herokuapp.com',
]
# HTTPS settings
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True

# HSTS settings
SECURE_HSTS_SECONDS = 31536000 # 1 year
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Amazon s3 settings
# Find these in django-storages docs
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_DEFAULT_ACL = 'public-read'
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400'
}

AWS_LOCATION = 'static'
AWS_QUERYSTRING_AUTH = False
AWS_HEADERS = {
    'Access-Control-Allow-Origins': '*',
}

# For storing in aws
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

# For storing locally
STATICFILES_STORAGE = 'storages.backends.s3boto3.S3StaticStorage'

# For aws
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'


# Heroku Logging
# With code below, will be able to see django errors in heroku logs
DEBUG_PROPAGATE_EXCEPTIONS = True

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': "[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S", 
        },
        'simple': {
            'format': '%(levelname)s %(message)s',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'MYAPP': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    }
}

# Heroku settings
django_on_heroku.settings(locals(), staticfiles=False)
del DATABASES['default']['OPTIONS']['sslmode']