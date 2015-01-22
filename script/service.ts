/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./model.ts" />
// service.ts

module TodoApp {
  // モデルのインポート
  import ITodo = Model.ITodo;

  export interface IPromise<T> {
    success(callback: (result: T) => void): void;
  }

  export class Service {
    todoList: ITodo[] = [
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

    constructor(private $timeout: ng.ITimeoutService) {
    }

    getList(): IPromise<ITodo[]> {
      return {
        success: (callback) => {
          this.$timeout(() => {
            callback(angular.copy(this.todoList));
          });
        }
      }
    }

    // 新規ToDoを１件追加し、追加したデータのコピーを返す
    insert(todo: ITodo): IPromise<ITodo> {
      var maxId = 0;
      this.todoList.forEach(todo=> {
        maxId = Math.max(maxId, todo.id);
      });
      var newTodo = {
        id: maxId + 1,
        text: todo.text,
        done: !!todo.done
      }

      // 新規TODOを一覧に追加
      this.todoList.push(newTodo);

      return {
        success: (callback) => {
          this.$timeout(() => {
            callback(angular.copy(newTodo));
          });
        }
      };
    }

    update(updateId: number): IPromise<ITodo[]> {
      // 指定されたTODOのIDを探し完了フラグを反転する
      this.todoList.forEach(todo => {
        if (updateId === todo.id) {
          todo.done = !todo.done;
        }
      });

      return this.getList();
    }

    // 完了済みのTODOを一括削除し、削除後のTODOの一覧のコピーを返す
    deleteDoneItems(): IPromise<ITodo[]> {
      var newTodoList = this.todoList.filter(todo=> !todo.done);
      this.todoList = newTodoList;

      return this.getList();
    }
  }
}

