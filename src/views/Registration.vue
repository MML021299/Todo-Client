<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div class="card mt-3 col-6">
      <div class="card-body">
        <h1 class="text-center">Create New Account</h1>
        <div class="col-sm-12">
          <span><b>Username:</b></span>
          <input
            type="text"
            class="form-control"
            placeholder="Enter username..."
            v-model="user.name"
          />
        </div>
        <div class="col-sm-12">
          <span><b>Email:</b></span>
          <input
            type="email"
            class="form-control"
            placeholder="Enter email..."
            v-model="user.email"
          />
        </div>
        <div class="col-sm-12">
          <span><b>Password:</b></span>
          <input
            type="password"
            class="form-control"
            placeholder="Enter password..."
            v-model="user.password"
          />
        </div>
        <div class="col-12 mt-4 text-center">
          <v-btn @click="register">Register</v-btn>
        </div>
        <div class="mt-1 text-center btn-text">
          <span @click="$router.push('/')">Already have account?</span>
        </div>
      </div>
    </div>
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
  
  export default {
    data() {
      return {
        user: { name: "", password: "", email: "" },
        snackMessage: "",
        snack: false,
        snackColor: ''
      }
    },
    watch: {
      
    },
    mounted() {
      
    },
    methods: {
      async register() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const { name, email, password } = this.user;

        if (!emailRegex.test(this.user.email)) {
          this.snackMessage = 'Please enter a valid email address.';
          this.snackColor = 'red'
          this.snack = true
          return
        }

        if (!name || !password || !email) {
          this.snackMessage = "Please enter required fields"
          this.snackColor = 'red'
          this.snack = true
          return
        }

        let body = {
          name: name,
          email: email,
          password: password
        }
        
        try {
          await axios.post(`${APIURL}/users/register`, body)
          .then(() => {
            this.clearData()
            this.snackMessage = "Registration successful"
            this.snackColor = 'green'
            this.snack = true
            this.$router.push('/')
          })
        } catch (error) {
          this.snackMessage = "Registration failed."
          this.snackColor = 'red'
          this.snack = true
        }
      },
      clearData() {
        this.user.name = ''
        this.user.email = ''
        this.user.password = ''
      }
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
  
  .btn-login {
    border-radius: 5px;
  }

  .btn-text {
    cursor: pointer;
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
  