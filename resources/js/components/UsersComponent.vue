<template>
    <div class="content-wrapper">
        <!-- Content Header -->
        <div class="content-header">
            <div class="container-fluid">
                <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0 text-dark">Management of User</h1>
                </div><!-- /.col -->
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                    <li class="breadcrumb-item">Management</li>
                    <li class="breadcrumb-item active">User</li>
                    </ol>
                </div><!-- /.col -->
                </div><!-- /.row -->
            </div><!-- /.container-fluid -->
        </div> <!-- /.content-header -->
    
        <section class="content">
            <div class="container">
                <div class="row mt" v-if="$gate.adminOrAuthor()">
                    <div class="col-md-12">
                        <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Users Table</h3>

                            <div class="card-tools">
                                <button class="btn btn-success" @click="newModal()">Add New <i class="fas fa-user-plus fa-fw"></i></button>
                            </div>
                        </div>
                        <!-- /.card-header -->
                        <div class="card-body table-responsive p-0">
                            <table class="table table-hover">
                            <thead>
                                <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Registered At</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in users.data" :key="user.id">
                                <td>{{user.id}}</td>
                                <td>{{user.name}}</td>
                                <td>{{user.email}}</td>
                                <td>{{user.type | upText}}</td>
                                <td>{{user.created_at | myDate }}</td>
                                <td>
                                    <a href="#" @click="editModal(user)">
                                        <i class="fa fa-edit blue"></i>
                                    </a>
                                    &nbsp;&nbsp;
                                    <a href="#" @click="deleteUser(user.id)">
                                        <i class="fa fa-trash red"></i>
                                    </a>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        <!-- /.card-body -->

                        <div class="card-footer">
                            <pagination :data="users" @pagination-change-page="getResults"></pagination>
                        </div>
                        </div>
                        <!-- /.card -->
                    </div>
                </div>

                <div v-if="!$gate.adminOrAuthor()">
                    <not-found></not-found>
                </div>

                <!-- Modal -->
                <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" v-show="!editmode" id="addNewLabel">Add New</h5>
                            <h5 class="modal-title" v-show="editmode" id="addNewLabel">Update User Info</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form @submit.prevent="editmode ? updateUser() : createUser()" @keydown="form.onKeydown($event)">
                            <div class="modal-body">

                                <div class="form-group">
                                    <input v-model="form.name" type="text" name="name" placeholder="Name"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                    <has-error :form="form" field="name"></has-error>
                                </div>

                                <div class="form-group">
                                    <input v-model="form.email" type="email" name="email" placeholder="Email"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                    <has-error :form="form" field="email"></has-error>
                                </div>

                                <div class="form-group">
                                    <textarea v-model="form.bio" type="text" name="bio" placeholder="Short bio for user (Optional)"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                                    <has-error :form="form" field="bio"></has-error>
                                </div>

                                <div class="form-group">
                                    <select v-model="form.type" name="type" id="type"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                        <option value="">Select user role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">Standard User</option>
                                        <option value="author">Author</option>
                                    </select>
                                    <has-error :form="form" field="type"></has-error>
                                </div>

                                <div class="form-group">
                                    <input v-model="form.password" type="password" name="password" id="password"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                                    <has-error :form="form" field="password"></has-error>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                                <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
                                <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>

                
            </div>
        </section>


    </div>
</template>

<script>
    export default {
        data(){
            return {
                editmode: true,
                users: {},
                form: new Form({
                    id : '',
                    name : '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods:{
            getResults(page = 1) {
                axios.get('api/user?page=' + page)
                    .then(response => {
                        this.users = response.data;
                    });
            },
            updateUser(){
                this.$Progress.start();

                this.form.put('api/user/'+this.form.id)
                .then(()=>{
                    $('#addNew').modal('hide');
                    this.loadUsers();
                    Swal.fire(
                                    'Updated!',
                                    'The information has been updated.',
                                    'success'
                                );
                    this.$Progress.finish();
                }).catch(()=>{
                    this.$Progress.fail();
                });
            },
            editModal(user){
                this.editmode = true;
                this.form.reset();
                $('#addNew').modal('show');
                this.form.fill(user);
            },
            newModal(){
                this.editmode = false;
                this.form.reset();
                $('#addNew').modal('show');
            },
            deleteUser(id){
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        console.log(result.value);
                        if (result.value) {
                            // Send Request to the Server
                            this.form.delete('api/user/'+id).then(()=>{
                                Swal.fire(
                                    'Deleted!',
                                    'The user has been deleted.',
                                    'success'
                                )
                                this.loadUsers();

                            }).catch(()=>{
                                Swal.fire(
                                    'Failed!',
                                    'There was something wrong.',
                                    'warning'
                                )
                            });
                        } else {
                            // Do Nothing
                        }
                        
                })
            },
            loadUsers(){
                if(this.$gate.adminOrAuthor()){
                    axios.get("api/user").then(
                        ({ data }) => (this.users = data)
                    );
                }
                
            },
            createUser(){
                this.$Progress.start();

                this.form.post('api/user')
                .then(()=>{
                    $('#addNew').modal('hide');
                    
                    this.loadUsers();
                    Toast.fire({
                        icon: 'success',
                        title: 'User created successfully'
                    });

                    this.$Progress.finish();

                }).catch(()=>{

                })

                
            }
        },
        created() {
            Fire.$on('searching', ()=>{
                let query = this.$parent.search;
                axios.get('api/findUser?q=' + query)
                .then(({ data }) => (this.users = data))
                .catch(()=> {

                });
            })
            this.loadUsers();
        }
    }
</script>
