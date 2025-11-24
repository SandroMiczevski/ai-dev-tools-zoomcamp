from django.urls import path
from . import views

urlpatterns = [
    path('api/todos/', views.todos_list_create, name='todos-list-create'),
    path('api/todos/<int:pk>/', views.todo_detail, name='todo-detail'),
]
