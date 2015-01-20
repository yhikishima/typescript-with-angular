/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="./model.ts" />
// service.ts

module TodoApp {
  export interface IPromise<T> {
    success(callback: (result: T)) => void): void;
  }

  export class Service {
    todoList: ITodo[];

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

  }
}

