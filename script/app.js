/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./model.ts" />
// service.ts
var TodoApp;
(function (TodoApp) {
    var Service = (function () {
        function Service($timeout) {
            this.$timeout = $timeout;
            this.todoList = [
                {
                    id: 1,
                    text: "牛乳を買う",
                    done: true
                },
                {
                    id: 2,
                    text: "原稿を書く",
                    done: false
                }
            ];
        }
        Service.prototype.getList = function () {
            var _this = this;
            return {
                success: function (callback) {
                    _this.$timeout(function () {
                        callback(angular.copy(_this.todoList));
                    });
                }
            };
        };
        // 新規ToDoを１件追加し、追加したデータのコピーを返す
        Service.prototype.insert = function (todo) {
            var _this = this;
            var maxId = 0;
            this.todoList.forEach(function (todo) {
                maxId = Math.max(maxId, todo.id);
            });
            var newTodo = {
                id: maxId + 1,
                text: todo.text,
                done: !!todo.done
            };
            // 新規TODOを一覧に追加
            this.todoList.push(newTodo);
            return {
                success: function (callback) {
                    _this.$timeout(function () {
                        callback(angular.copy(newTodo));
                    });
                }
            };
        };
        Service.prototype.update = function (updateId) {
            // 指定されたTODOのIDを探し完了フラグを反転する
            this.todoList.forEach(function (todo) {
                if (updateId === todo.id) {
                    todo.done = !todo.done;
                }
            });
            return this.getList();
        };
        // 完了済みのTODOを一括削除し、削除後のTODOの一覧のコピーを返す
        Service.prototype.deleteDoneItems = function () {
            var newTodoList = this.todoList.filter(function (todo) { return !todo.done; });
            this.todoList = newTodoList;
            return this.getList();
        };
        return Service;
    })();
    TodoApp.Service = Service;
})(TodoApp || (TodoApp = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./model.ts" />
/// <reference path="./service.ts" />
// controller.ts
var TodoApp;
(function (TodoApp) {
    //サービスと画面の橋渡しを行うコントローラー
    var Controller = (function () {
        function Controller($scope, todoService) {
            var _this = this;
            this.$scope = $scope;
            this.todoService = todoService;
            this.$scope.insert = this.insert.bind(this);
            this.$scope.update = this.update.bind(this);
            this.$scope.deleteDoneItems = this.deleteDoneItems.bind(this);
            this.todoService.getList().success(function (todoList) {
                _this.$scope.todoList = todoList;
            });
        }
        // 入力データを整え、Serviceクラスのinsertメソッドに渡し、表示データを更新する
        Controller.prototype.insert = function () {
            var _this = this;
            var todo = {
                text: this.$scope.text,
                done: false
            };
            this.todoService.insert(todo).success(function (todo) {
                _this.$scope.todoList.push(todo);
                _this.$scope.text = "";
            });
        };
        // 指定されたTODOをServiceクラスのupdateメソッドに渡し、表示データを更新する
        Controller.prototype.update = function (updateTodo) {
            var _this = this;
            this.todoService.update(updateTodo.id).success(function (todoList) {
                _this.$scope.todoList = todoList;
            });
        };
        // 表示データを更新する
        Controller.prototype.deleteDoneItems = function () {
            var _this = this;
            this.todoService.deleteDoneItems().success(function (newTodoList) {
                _this.$scope.todoList = newTodoList;
            });
        };
        return Controller;
    })();
    TodoApp.Controller = Controller;
})(TodoApp || (TodoApp = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./model.ts" />
/// <reference path="./service.ts" />
/// <reference path="./controller.ts" />
// main.ts
var TodoApp;
(function (TodoApp) {
    angular.module('todo', []).service('todoService', TodoApp.Service).controller('TodoController', TodoApp.Controller);
})(TodoApp || (TodoApp = {}));
