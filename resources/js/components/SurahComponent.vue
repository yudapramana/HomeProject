<template>
  <div class="content-wrapper">

    <!-- Content Header -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">Surah</h1>
          </div><!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">Surah</li>
            </ol>
          </div><!-- /.col -->
        </div><!-- /.row -->
      </div><!-- /.container-fluid -->
    </div> <!-- /.content-header -->

    <!-- Content Body -->
    <section class="content">
      <div class="container">

            <div class="row mt">
                <div class="col-md-12">
                    <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Surah of Alquran</h3>
                    </div>
                    <!-- /.card-header -->
                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                        <thead>
                            <tr>
                            <th>Nomor</th>
                            <th>Nama</th>
                            <th>Type</th>
                            <th>Arti</th>
                            <th>Ayat</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="surah in surahs" :key="surah.nomor">
                            <td>{{surah.nomor}}</td>
                            <td>{{surah.nama}}</td>
                            <td>{{surah.type | upText}}</td>
                            <td>{{surah.arti}}</td>
                            <td>{{surah.ayat}}</td>
                            <td>
                                <a href="#" @click="showDetail(surah)">
                                    <i class="fa fa-info-circle blue"></i>
                                </a>
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <!-- /.card-body -->

                    </div>
                    <!-- /.card -->
                </div>
            </div>

            <!-- Modal -->
                <div class="modal fade" id="detailSurah" tabindex="-1" role="dialog" aria-labelledby="addNewLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="detailSurahLabel">Info Surah #<span id="nomorsurah"></span></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form @submit.prevent="editmode ? updateUser() : createUser()" @keydown="form.onKeydown($event)">
                            <div class="modal-body">

                                <div class="form-group">
                                    <input v-model="form.nama" type="text" name="nama" placeholder="nama"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('nama') }" readonly>
                                    <has-error :form="form" field="nama"></has-error>
                                </div>

                                <div class="form-group">
                                    <input v-model="form.arti" type="text" name="arti" placeholder="arti"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('arti') }" readonly>
                                    <has-error :form="form" field="arti"></has-error>
                                </div>

                                <div class="form-group">
                                    <input v-model="form.ayat" type="text" name="ayat" placeholder="ayat"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('ayat') }" readonly>
                                    <has-error :form="form" field="ayat"></has-error>
                                </div>

                                <div class="form-group">
                                    <textarea v-model="form.keterangan" type="text" name="keterangan" id="keterangan"  placeholder="keterangan Surah"
                                        class="form-control" :class="{ 'is-invalid': form.errors.has('keterangan') }"
                                        oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' readonly></textarea>
                                    <has-error :form="form" field="keterangan"></has-error>
                                </div>


                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>

      </div><!-- /.container-fluid -->
    </section><!-- /.container-fluid -->

  </div>
</template>

<script>
    export default {
        data(){
            return {
                surahs: {},
                form: new Form({
                    nama : '',
                    arti : '',
                    ayat: '',
                    keterangan: '',
                })
            }
        },
        methods:{
            loadSurahs(){
                axios.get("https://al-quran-8d642.firebaseio.com/data.json").then(
                    ({ data }) => (this.surahs = data)
                );
            },
            showDetail(surah){
                console.log(surah.nama);
                this.form.reset();
                $('#detailSurah').modal('show');
                this.form.fill(surah);
                $('#nomorsurah').html(surah.nomor);

                setTimeout(function(){ 
                    setHeight($('#keterangan'));
                }, 300);

                
            },
        },
        created(){
            this.loadSurahs();
        }
    }

    function setHeight(jq_in){
        jq_in.each(function(index, elem){
            console.log('called');
            console.log(elem.scrollHeight);
            // This line will work with pure Javascript (taken from NicB's answer):
            elem.style.height = elem.scrollHeight+'px'; 
        });
    }
</script>
