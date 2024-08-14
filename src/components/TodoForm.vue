<template>
    <v-card class="py-3">
        <v-card-actions class="pa-0 px-3">
            <v-spacer></v-spacer>
            <v-btn align-end class="pa-0 border-radius-medium" color="#FF0000" outlined
            @click="$emit('closeDialog')"
            style="min-width: 30px;max-width: 30px;height: 30px;text-align: center;">
            <v-icon small>mdi-close</v-icon>
            </v-btn>
        </v-card-actions>
        <v-card-title class="body-1 pt-1">
          {{ isEdit ? 'Edit' : 'Create' }} Todo List
        </v-card-title>
        <v-card-text>
            <div class="col-sm-12">
            <span><b>Todo Name:</b></span>
            <input
                type="text"
                class="form-control"
                placeholder="Enter todo name..."
                v-model="name"
            />
            </div>
            <div class="col-12 mt-3 text-center">
            <v-btn class="me-2 btn-submit" @click="submit">Submit</v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import axios from "axios";
import { APIURL } from "../constants";
export default {
  name: "TodoForm",
  props: {
    isEdit: Boolean,
    todoId: String
  },
  data() {
    return {
      name: ""
    };
  },
  mounted() {

  },
  methods: {
    async submit() {
      if (!this.name) {
        return alert("Name is required");
      }

      const body = {
        name: this.name
      }

      if (this.isEdit) {
        await axios.put(`${APIURL}/todos/update/${this.todoId}`, body)
        .then(() => {
          this.$emit('todoSubmit')
        })
        .catch(err => {
          console.log(err)
        })
      } else {
        await axios.post(`${APIURL}/todos/new`, body)
        .then(() => {
          this.$emit('todoSubmit')
        })
        .catch(err => {
          console.log(err)
        })
      }
    },
    async getTodo() {
      await axios.get(`${APIURL}/todos/${this.todoId}`)
      .then(res => {
        this.name = res.data.name
      })
      .catch(err => {
        console.log(err)
      })
    },
  },
  beforeMount() {
    if (this.isEdit) {
      this.getTodo();
    }
  },
}
</script>

<style>
</style>