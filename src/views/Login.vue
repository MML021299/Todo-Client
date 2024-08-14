<template>
  <div class="container d-flex justify-content-center align-items-center">
    <div class="card mt-3 col-6">
      <div class="card-body">
        <h1 class="text-center">Login</h1>
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
          <span><b>Password:</b></span>
          <input
            type="password"
            class="form-control"
            placeholder="Enter password..."
            v-model="user.password"
          />
        </div>
        <div class="col-12 mt-3 text-center">
          <v-btn class="me-2 btn-login" @click="login">Login</v-btn>
        </div>
        <div class="mt-1 text-center btn-text">
          <span @click="$router.push('/register')">Create New Account</span>
        </div>
        <div class="mt-1 text-center btn-text">
          <span>Forgot Password?</span>
        </div>
      </div>
    </div>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ errorMessage }}
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
        user: { name: "", password: "" },
        errorMessage: "",
        snack: false,
        snackColor: ''
      }
    },
    watch: {
      
    },
    mounted() {

    },
    methods: {
      async login() {
        const { name, password } = this.user;

        if (!name || !password) {
          this.errorMessage = "Username and password are required"
          this.snackColor = 'red'
          this.snack = true
          return
        }
        
        try {
          await axios.post(`${APIURL}/users/login`, {
            name,
            password,
          }).then(res => {
            if (res.data.token) {
              this.$store.dispatch("saveUserSessionInfo", res.data)
              localStorage.setItem("token", res.data.token);
              this.$router.push("/todos");
              this.errorMessage = ""
            } else {
              this.snack = true
              this.snackColor = 'red'
              this.errorMessage = "Invalid credentials."
            }
          }).catch(() => {
            this.snack = true
            this.snackColor = 'red'
            this.errorMessage = "Invalid credentials."
          })
        } catch (error) {
          this.snack = true
          this.snackColor = 'red'
          this.errorMessage = "Invalid credentials."
        }
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

  .error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
    text-align: center;
  }
</style>
