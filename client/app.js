const endpoint = "http://localhost:3000"

var $app = $('#app')
var $user_page = ('#user_page')
var $login_page = $('#login_page')
var $register_page = $('#register_page')
var $comic_list = $('#comic_list')
var $update_page = $('#update_page')

if (localStorage.token) {
    userLoggedIn()
} else {
    userIsNoteLoggedIn()
}

$('#register_link').on('click', function (e) {
    e.preventDefault()
    $login_page.hide()
    $register_page.show()
});

$('#login_link').on('click', function (e) {
    e.preventDefault()
    $login_page.show()
    $register_page.hide()
});

$('#register_form').on('submit', function (e) {
    e.preventDefault()
    let registerData = {
        name: $('#register_name').val(),
        email: $('#register_email').val(),
        password: $('#register_password').val()
    }
    $.ajax({
        type: "post",
        url: `${endpoint}/register`,
        data: registerData,
        success: function (response) {
            $login_page.show()
            $register_page.hide()
            swal('Registrasi berasil', 'success')
        },
        error: function (err) {
            err = err.responseJSON
            swal('Registrasi gagal', 'warning')
        }
    });
});

$('#login_form').on('submit', function (e) {
    e.preventDefault()

    let loginData = {
        email: $('#login_email').val(),
        password: $('#login_password').val()
    }
    $.ajax({
        type: "post",
        url: `${endpoint}/login`,
        data: loginData,
        success: function (response) {
            localStorage.setItem('token', response.token)
            userLoggedIn()
        },
        error: function (err) {
            err = err.responseJSON
            console.log(err)
        }
    });
});

function userLoggedIn() {
    $login_page.hide()
    $register_page.hide()
    $update_page.hide()
    $comic_list.show()
    getComicList()
}

function userIsNoteLoggedIn() {
    $login_page.show()
    $register_page.hide()
    $comic_list.hide()
    $update_page.hide()
}

function getComicList() {
    $update_page.hide()
    $.ajax({
        type: "get",
        url: `${endpoint}/comic`,
        headers: {
            token: localStorage.token
        },
        success: function (response) {
            $('#collection').empty()
            response.forEach(comic => {
                $('#collection').append(
                    `<div class="col-4 mb-4">
                        <div class="card text-center">
                            <img id="img-${comic.id}" src="${comic.imageUrl}" class="card-img-top">
                            <div class="card-body">
                            <h5 class="card-title" id="title-${comic.id}">${comic.title}</h5>
                            <p class="card-text" id="author-${comic.id}">${comic.author}</p>
                            <button class="btn btn-primary edit" data-id=${comic.id}>Edit</button>
                            </div>
                        </div>
                    </div>`
                )
            });
        },
        error: function (err) {
            err = err.responseJSON
            swal("Error!", err.message, "warning");
        }
    });
}

$(document).on('click', '.edit', function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    const data = {
        title: $(`#title-${id}`).text(),
        author: $(`#author-${id}`).text(),
        imgUrl: $(`#img-${id}`).attr('src')
    }
    $('#title-update').val(data.title)
    $('#author-update').val(data.author)
    $('#img-update').val(data.imgUrl)
    $update_page.show()
    $("#update_form").on('submit', function (e) {
        e.preventDefault()
        const updateData = {
            id,
            title: $(`#title-update`).val(),
            author: $(`#author-update`).val(),
            imgUrl: $(`#img-update`).val()
        }
        $.ajax({
            type: "put",
            url: `${endpoint}/comic`,
            data: updateData,
            headers: {
                token: localStorage.token
            },
            success: function (response) {
                getComicList()
            },
            error: function (err) {
                console.log(err)
            }
        });
    })
});

$('#btn-logout').on('click', function () {
    localStorage.removeItem('token')
    userIsNoteLoggedIn()
});