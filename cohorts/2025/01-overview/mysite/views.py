import os
from pathlib import Path
from django.conf import settings
from django.http import HttpResponse
from django.template import engines


def spa_index(request, path=None):
    """Serve the SPA index, discovering built asset filenames under dist/assets.

    This implementation reads the `templates/index.html` file directly and
    renders it with the Django template engine to avoid accidentally
    picking `dist/index.html` from the template search path.
    """
    base = Path(settings.BASE_DIR)
    dist_dir = base / 'dist'
    assets_dir = dist_dir / 'assets'
    js_files = []
    css_files = []
    if assets_dir.exists():
        for p in sorted(assets_dir.iterdir()):
            if p.suffix == '.js':
                js_files.append('assets/' + p.name)
            elif p.suffix == '.css':
                css_files.append('assets/' + p.name)

    # Prefer the project templates file; fallback to dist/index.html content
    template_path = base / 'templates' / 'index.html'
    if not template_path.exists():
        # fallback to dist/index.html
        template_path = dist_dir / 'index.html'

    content = template_path.read_text(encoding='utf-8')
    django_engine = engines['django']
    template = django_engine.from_string(content)
    rendered = template.render({'assets_js': js_files, 'assets_css': css_files}, request=request)
    return HttpResponse(rendered)
