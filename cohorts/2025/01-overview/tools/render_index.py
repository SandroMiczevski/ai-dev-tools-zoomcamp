import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
import django
django.setup()
from django.template.loader import render_to_string

html = render_to_string('index.html', {
    'assets_js': ['assets/index-DeltGbau.js'],
    'assets_css': ['assets/index-73qNnEWD.css'],
})
print(html)
