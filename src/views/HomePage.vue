<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div class="card mt-3 col-6">
      <div class="card-body" style="height: 660px">
        <h1 class="text-center">{{ user.name }}'s Todo List</h1>
        <div
          class="d-flex flex-column flex-sm-row justify-content-between mt-3 mt-sm-5"
        >
          <div class="col-sm-7">
            <v-text-field
              class="rounded-xl"
              placeholder="Search task..."
              v-model="searchTodo"
              prepend-inner-icon="mdi-magnify"
              variant="underlined"
              @input="getTodos"
            />
          </div>
          <div class="col-sm-3">
            <v-select
              variant="underlined"
              :items="todoFilter"
              v-model="todoFilterValue"
              @update:model-value="getTodos"
            ></v-select>
          </div>
          <div class="mt-3 mt-sm-0">
            <v-tooltip>
              <template v-slot:activator="{ props }">
                <v-icon
                  class="mr-5 mt-2"
                  color="blue"
                  @click="todoFormDialog = true"
                  v-bind="props"
                  size="45"
                >
                  mdi-plus-circle
                </v-icon>
              </template>
              Create New Task
            </v-tooltip>
          </div>
        </div>
        <hr />
        <div class="mt-3 mt-sm-5">
          <div class="scroll" style="height: 375px; overflow-y: scroll">
            <div
              class="card item-card mt-2"
              v-for="(t, index) in todos"
              :key="index"
            >
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="t.done"
                    @click="updateStatus(t)"
                  />
                  <div>
                    <p class="fw-semibold">{{ t.name }}</p>
                  </div>
                  <div class="d-flex">
                    <div>
                      <v-tooltip>
                        <template v-slot:activator="{ props }">
                          <v-icon
                            class="mr-5"
                            color="green"
                            @click="openEditDialog(t._id)"
                            v-bind="props"
                          >
                            mdi-pencil
                          </v-icon>
                        </template>
                        Edit
                      </v-tooltip>
                    </div>
                    <div>
                      <v-tooltip>
                        <template v-slot:activator="{ props }">
                          <v-icon
                            color="red"
                            @click="openDeleteDialog(t._id)"
                            v-bind="props"
                          >
                            mdi-delete
                          </v-icon>
                        </template>
                        Delete
                      </v-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="d-flex flex-column flex-sm-row justify-content-between">
            <div>
              <p class="fw-bold" v-if="pendingTasks == 0">
                You have no pending tasks
              </p>
              <p class="fw-bold" v-else>
                You have {{ pendingTasks }} pending {{ pendingTasks > 1 ? 'tasks' : 'task' }}
              </p>
            </div>
            <div>
              <button
                type="button"
                class="btn btn-warning"
                @click="logOut"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Delete Task Dialog -->
    <v-dialog persistent v-model="deleteDialog" width="600">
      <v-card class="py-3">
        <v-card-actions class="pa-0 px-3">
          <v-spacer></v-spacer>
          <v-btn align-end class="pa-0 border-radius-medium" color="#FF0000" outlined
            @click="deleteDialog = false; todoId = ''"
            style="min-width: 30px;max-width: 30px;height: 30px;text-align: center;">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-title class="body-1 pt-1">Are you sure you want to delete the task?</v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" style="text-align-last: center;">
                <v-btn @click="deleteTodo(todoId)" style="min-width:105px;background-color: #39DDA6; color: white;height: 35px;text-align: center;text-transform: unset !important;" class="white--text border-radius-medium" depressed >Yes</v-btn>
                <v-btn @click="deleteDialog = false; todoId = ''" class="caption border-radius-medium" text  style="min-width:105px;background-color: #C6CDD4; color: #000;height: 35px;text-align: center;text-transform: unset !important;" >No</v-btn >
              </v-col>
            </v-row>
        </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Create Todo Dialog -->
    <v-dialog persistent v-model="todoFormDialog" width="600">
      <TodoForm :isEdit="isEdit" :todoId="todoId" @closeDialog="closeTodoFormDialog" @todoSubmit="todoSubmit" />
    </v-dialog>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackMessage }}
      <template v-slot:actions>
        <v-btn text @click="snack = false" small>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { APIURL } from "../constants";
import TodoForm from "../components/TodoForm"

export default {
  components: {
    TodoForm
  },
  data() {
    return {
      user: {},
      searchTodo: "",
      todos: [],
      todoId: '',
      snackMessage: "",
      snack: false,
      snackColor: '',
      deleteDialog: false,
      todoFormDialog: false,
      isEdit: false,
      todoFilter: ['All', 'Pending', 'Done'],
      todoFilterValue: 'All',
      pendingTasks: 0
    }
  },
  watch: {

  },
  beforeMount() {
    this.getTodos();
  },
  mounted() {
    this.user = this.$store.getters.getUser
  },
  methods: {
    async getTodos() {
      const body = {
        todoFilter: this.todoFilterValue,
        searchString: this.searchTodo
      }

      await axios.post(`${APIURL}/todos`, body)
      .then(res => {
        this.todos = res.data.todosData;
        this.pendingTasks = res.data.pendingTodosCount
      })
      .catch(err => {
        console.log('err')
        console.log(err)
        console.log('err')
      })
    },
    async deleteTodo(id) {
      await axios.delete(`${APIURL}/todos/${id}`)
      .then(() => {
        this.snackMessage = 'Todo item deleted successfully'
        this.snackColor = 'green'
        this.snack = true
        this.todoId = ''
        this.deleteDialog = false
        this.getTodos();
      })
      .catch((err) => {
        console.log('err')
        console.log(err)
        console.log('err')
        this.snackMessage = 'Error deleting task'
        this.snackColor = 'red'
        this.todoId = ''
        this.snack = true
      })
    },
    async updateStatus(todo) {
      const body = {
        done: !todo.done
      }
      
      await axios.put(`${APIURL}/todos/update_status/${todo._id}`, body)
      .then(() => {
        this.snackMessage = 'Todo item updated successfully'
        this.snackColor = 'green'
        this.snack = true
        this.todoId = ''
        this.getTodos();
      })
      .catch(err => {
        console.log('err')
        console.log(err)
        console.log('err')
        this.snackMessage = 'Error updating todo item'
        this.snackColor = 'red'
        this.todoId = ''
        this.snack = true
      })
    },
    closeTodoFormDialog() {
      this.todoId = ''
      this.isEdit = false
      this.todoFormDialog = false
    },
    todoSubmit() {
      this.snackMessage = `Todo item ${ this.isEdit ? 'edited' : 'created' } successfully`
      this.snackColor = 'green'
      this.snack = true
      this.todoFormDialog = false
      this.todoId = ''
      this.isEdit = false
      this.getTodos();
    },
    openDeleteDialog(id) {
      this.todoId = id
      this.deleteDialog = true
    },
    openEditDialog(id) {
      this.todoId = id
      this.isEdit = true
      this.todoFormDialog = true
    },
    logOut() {
      localStorage.clear();
      sessionStorage.clear()
      this.$router.push('/');
    },
  },
  computed: {

  }
};
</script>

<style scoped>
.card-body h1 {
  color: #a813ff;
}

.btn-primary {
  background-color: #a813ff;
  border: transparent;
}

.btn-danger {
  background-color: #5f8dba;
  border: transparent;
}

.btn-warning {
  background-color: #952b95;
  color: #fff;
  border: transparent;
}

.btn-submit {
  border-radius: 5px;
}

.message {
  color: green;
  font-weight: bold;
}

.item-card {
  height: 60px;
  background-color: #440c7e;
  color: #fff;
}
</style>
