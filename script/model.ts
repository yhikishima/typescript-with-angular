// model.ts
module TodoApp.Model {
  // Todo1件を表すデータ
  export interface ITodo {
    // TodoのID
    id?: number;
    // Todoの内容
    text: string;
    // Todoが完了かどうか
    done: boolean;
  }
}