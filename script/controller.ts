/// <reference path="../typings/angularjs/angular.d.ts" />

/// <reference path="./model.ts" />
/// <reference path="./service.ts" />
// controller.ts

module TodoApp {
  import ITodo = Model.ITodo;

  // コントローラーで使う$scopeのための型注釈用インターフェース
  export interface Scope extends ng.IScope {
    text: string;

    insert(): void;

    update(todo: ITodo): void;

    deleteDoneItems(): void;

    todoList: TodoApp.Model.ITodo[];
  }

  //サービスと画面の橋渡しを行うコントローラー
  export class Controller {
    constructor(public $scope: Scope, public todoService: TodoApp.Service) {
      this.$scope.insert = this.insert.bind(this);
      this.$scope.update = this.uodate.bind(this);
      this.$scope.deleteDoneItems = this.deleteDoneItems.bind(this);

      this.todoService.getList().success(todoList=> {
        this.$scope.todoList = todoList;
      });
    }

    // 入力データを整え、Serviceクラスのinsertメソッドに渡し、表示データを更新する
    insert(): void {
      var todo: ITodo = {
        text: this.$scope.text,
        done: false
      };
      this.todoService.insert(todo)
        .success(todo=> {
          this.$scope.todoList.push(todo);

          this.$scope.text = "";
      });
    }

    // 指定されたTODOをServiceクラスのupdateメソッドに渡し、表示データを更新する
    update(updateTodo: ITodo): void {
      this.todoService.update(updateTodo.id).success(todoList=> {
        this.$scope.todoList = todoList;
      });
    }

    // 表示データを更新する
    deleteDoneItems(): void {
      this.todoService.deleteDoneItems().success(newTodoList => {
        this.$scope.todoList = newTodoList;
      });
    }
  }
}