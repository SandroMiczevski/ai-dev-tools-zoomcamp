import json
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Todo


def todo_to_dict(todo: Todo):
    return {
        'id': todo.id,
        'title': todo.title,
        'description': todo.description,
        'due_date': todo.due_date.isoformat() if todo.due_date else None,
        'completed': todo.completed,
        'created_at': todo.created_at.isoformat() if todo.created_at else None,
    }


@csrf_exempt
def todos_list_create(request):
    if request.method == 'GET':
        items = Todo.objects.order_by('-created_at').all()
        data = [todo_to_dict(t) for t in items]
        return JsonResponse(data, safe=False)

    if request.method == 'POST':
        try:
            payload = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse({'error': 'invalid json'}, status=400)
        todo = Todo.objects.create(
            title=payload.get('title', ''),
            description=payload.get('description', ''),
            completed=bool(payload.get('completed', False)),
        )
        return JsonResponse(todo_to_dict(todo), status=201)

    return HttpResponseNotAllowed(['GET', 'POST'])


@csrf_exempt
def todo_detail(request, pk):
    todo = get_object_or_404(Todo, pk=pk)
    if request.method == 'GET':
        return JsonResponse(todo_to_dict(todo))

    if request.method in ('PUT', 'PATCH'):
        try:
            payload = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse({'error': 'invalid json'}, status=400)
        todo.title = payload.get('title', todo.title)
        todo.description = payload.get('description', todo.description)
        if 'completed' in payload:
            todo.completed = bool(payload.get('completed'))
        todo.save()
        return JsonResponse(todo_to_dict(todo))

    if request.method == 'DELETE':
        todo.delete()
        return HttpResponse(status=204)

    return HttpResponseNotAllowed(['GET', 'PUT', 'PATCH', 'DELETE'])
from django.shortcuts import render

# Create your views here.
