<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <div class="card" style="margin-top: 20px;">
                    <div class="card-bpdy">
                        <img :src="$store.state.user.photo" alt="" style="width: 100%;">
                    </div>
                </div>
            </div>
            <div class="col-9">
                <div class="card" style="margin-top: 20px;">
                    <div class="card-header">
                        <span style="font-size: 130%">My Bot</span>
                        <button type="button" class="btn btn-outline-success float-end" data-bs-toggle="modal" data-bs-target="#add-bot-btn">
                            Create Bot
                        </button>
                    </div>
                    
                    <div class="modal fade" id="add-bot-btn" tabindex="-1">
                        <div class="modal-dialog model-xl modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5">Create My Bot</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form>
                                        <div class="mb-3">
                                            <label for="add-bot-title" class="form-label">Bot Name</label>
                                            <input v-model="botadd.title" type="text" class="form-control" id="add-bot-title" placeholder="Please Input Bot Name">
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-description" class="form-label">Bot Description</label>
                                            <textarea v-model="botadd.description" class="form-control" id="add-bot-description" rows="4" placeholder="Please Write Bot Description"></textarea>
                                        </div>
                                        <div class="mb-3">
                                            <label for="add-bot-code" class="form-label">Bot Code</label>
                                            <VAceEditor
                                                v-model:value="botadd.content"
                                                @init="editorInit"
                                                lang="c_cpp"
                                                theme="textmate"
                                                style="height: 300px" />
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <div class="error-message">{{ botadd.error_message }}</div>
                                    <button type="button" class="btn btn-success" @click="add_bot">Create</button>
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Bot Name</th>
                                    <th>Create Time</th>
                                    <th>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="bot in bots" :key="bot.id">
                                    <td>{{ bot.title }}</td>
                                    <td>{{ bot.createTime }}</td>
                                    <td>
                                        <button type="button" class="btn btn-outline-success" style="margin-right: 10px;" data-bs-toggle="modal" :data-bs-target="'#update-bot-modal' + bot.id">Modify</button>
                                        <button type="button" class="btn btn-outline-danger" @click="remove_bot(bot)">Delete</button>

                                        <div class="modal fade" :id="'update-bot-modal' + bot.id" tabindex="-1">
                                            <div class="modal-dialog model-xl modal-dialog-centered">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h1 class="modal-title fs-5">Modify My Bot</h1>
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <form>
                                                            <div class="mb-3">
                                                                <label for="add-bot-title" class="form-label">Bot Name</label>
                                                                <input v-model="bot.title" type="text" class="form-control" id="add-bot-title" placeholder="Please Input Bot Name">
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="add-bot-description" class="form-label">Bot Description</label>
                                                                <textarea v-model="bot.description" class="form-control" id="add-bot-description" rows="4" placeholder="Please Write Bot Description"></textarea>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="add-bot-code" class="form-label">Bot Code</label>
                                                                <VAceEditor
                                                                    v-model:value="bot.content"
                                                                    @init="editorInit"
                                                                    lang="c_cpp"
                                                                    theme="textmate"
                                                                    style="height: 300px" />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <div class="error-message">{{ bot.error_message }}</div>
                                                        <button type="button" class="btn btn-success" @click="update_bot(bot)">Save changes</button>
                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<script>
import { ref, reactive } from 'vue'; // variable:ref,  object:reactive
import $ from 'jquery'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap/dist/js/bootstrap'
import { VAceEditor } from 'vue3-ace-editor';
import ace from 'ace-builds';

export default {
    components: {
        VAceEditor,
    },
    setup() {
        ace.config.set(
            "basePath", 
            "https://cdn.jsdelivr.net/npm/ace-builds@" + require('ace-builds').version + "/src-noconflict/");


        const store = useStore();
        let bots = ref([]);

        const botadd = reactive({
            title: "",
            description: "",
            content: "",
            error_message: "",
        });

        const refresh_bots = () => {
            $.ajax({
                url: "http://localhost:3000/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                }
            })
        }

        refresh_bots();

        const add_bot = () => {
            botadd.error_message = "";
            $.ajax({ // send request to the backend
                url: "http://localhost:3000/user/bot/add/",
                type: "post",
                data: {
                    title: botadd.title, // no .value for an object 
                    description: botadd.description,
                    content: botadd.content,
                },
                headers: { // need headers for after-login operations
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        botadd.title = "";
                        botadd.description = "";
                        botadd.content = "";
                        Modal.getInstance("#add-bot-btn").hide(); // # before id, . before class
                        refresh_bots();
                    } else {
                        botadd.error_message = resp.error_message;
                    }
                },
            })
        }

        const remove_bot = (bot) => {
            $.ajax({ // send request to the backend
                url: "http://localhost:3000/user/bot/remove/",
                type: "post",
                data: {
                    bot_id: bot.id,
                },
                headers: { // need headers for after-login operations
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        Modal.getInstance("#add-bot-btn").hide();
                        refresh_bots();
                    }
                }
            })
        }

        const update_bot = (bot) => {
            botadd.error_message = "";
            $.ajax({ // send request to the backend
                url: "http://localhost:3000/user/bot/update/",
                type: "post",
                data: {
                    bot_id: bot.id,
                    title: bot.title, // no .value for an object 
                    description: bot.description,
                    content: bot.content,
                },
                headers: { // need headers for after-login operations
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    if (resp.error_message === "success") {
                        Modal.getInstance('#update-bot-modal' + bot.id).hide(); // # before id, . before class
                        refresh_bots();
                    } else {
                        bot.error_message = resp.error_message;
                    }
                },
            })
        }

        return {
            bots,
            botadd,
            add_bot,
            remove_bot,
            update_bot,
        }
    }
}
</script>

<style scoped>
div.error-message {
    color: red;
}
</style>