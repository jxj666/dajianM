const data_c = {
  req_url: "https://dj.majiangyun.com/",
  req_url_http: "http://dj.majiangyun.com"
};
var data_v = {
  api_token: sessionStorage.api_token || localStorage.api_token,
  uid: sessionStorage.uid || localStorage.uid,
  img_url: "",
  play_url: "",
  product: [],
  arr1: [],
  arr2: [],
  i: 1,
  img_box: [],
  img_box1: [],
  img_box2: [],
  type: 2,
  edit: 0,
  id: "",
  page_play: "",
  sessionId: "",
  level: ""
};

function dajian(page) {
  if (page == "login") {
    fun.getSessionId();
  } else {
    if (!data_v.api_token || !data_v.uid) {
      location.href = "page-login.html";
      return;
    }
    $("#logout").on("click", () => {
      fun.logout();
    });
  }
  setTimeout(() => {
    if (page == "login") {
      $("#login_btn").on("click", () => {
        fun.login();
      });
      $("#verify").on("click", () => {
        fun.getCode();
      });
    } else if (page == "index") {
      fun.start(page);
    } else if (page == "list") {
      data_v.level = 1;
      fun.start(page);
      fun.getIndexList();
      $("#upImg_btn").on("click", () => {
        fun.upLoadImg();
      });
      $("#quit_btn").on("click", () => {
        fun.hideList();
      });
      $("#submit_btn").on("click", () => {
        fun.upList();
      });
      $("#add_btn").on("click", () => {
        fun.addList();
      });
      $("#close_img_pop_btn").on("click", () => {
        fun.hideImgPop();
      });
    } else if (page == "list2") {
      data_v.level = 2;
      fun.start(page);
      fun.getIndexList2(page);
      fun.getParentSeries();
      $("#upImg_btn").on("click", () => {
        fun.upLoadImg();
      });
      $("#quit_btn").on("click", () => {
        fun.hideList();
      });
      $("#submit_btn").on("click", () => {
        fun.upList2();
      });
      $("#add_btn").on("click", () => {
        fun.addList();
      });
      $("#close_img_pop_btn").on("click", () => {
        fun.hideImgPop();
      });
    } else if (page == "list3") {
      data_v.level = 3;
      fun.start(page);
      fun.getIndexList3(page);
      fun.getParentSeries("1");
      $("#upImg_btn").on("click", () => {
        fun.upLoadImg();
      });
      $("#quit_btn").on("click", () => {
        fun.hideList();
      });
      $("#submit_btn").on("click", () => {
        fun.upList3();
      });
      $("#add_btn").on("click", () => {
        fun.addList();
      });
      $("#exampleSelect1").on("change", () => {
        fun.getProductSeries();
      });
      $("#close_img_pop_btn").on("click", () => {
        fun.hideImgPop();
      });
    } else if (page == "play") {
      data_v.page_play = true;
      fun.start(page);
      fun.getPlayList(page);
      fun.getParentSeries("2");
      $("#upImg_btn").on("click", () => {
        fun.upLoadImg();
      });
      $("#upPlay_btn").on("click", () => {
        fun.uploadVideo();
      });
      $("#quit_btn").on("click", () => {
        fun.hideList();
      });
      $("#submit_btn").on("click", () => {
        fun.upPlayList();
      });
      $("#add_btn").on("click", () => {
        fun.addList();
      });
      $("#close_img_pop_btn").on("click", () => {
        fun.hideImgPop();
      });
      $("#close_play_pop_btn").on("click", () => {
        fun.hideVideoPop();
      });
      $("#exampleSelect1").on("change", () => {
        fun.getProductSeries();
      });
      $("#exampleSelect2").on("change", () => {
        fun.getProductSeries2();
      });
      $("#toggle_btn1").on("click", () => {
        fun.toggle_upPlay(1);
      });
      $("#toggle_btn2").on("click", () => {
        fun.toggle_upPlay(2);
      });
      $("#toggle_btn3").on("click", () => {
        fun.toggle_upPlay(3);
      });
      $("#addProduct_btn").on("click", () => {
        fun.addProduct();
      });
    } else if (page == "word") {
      fun.start(page);
      fun.getWordList();
      $("#quit_btn").on("click", () => {
        fun.hideList();
      });
      $("#submit_btn").on("click", () => {
        fun.upWordList();
      });
      $("#add_btn").on("click", () => {
        fun.addList();
      });
    } else if (page == "user") {
      fun.start(page);
      fun.getUserList();

      $("#quit_btn").on("click", () => {
        fun.hideList();
      });
      $("#submit_btn").on("click", () => {
        fun.upUserList();
      });
      $("#add_btn").on("click", () => {
        fun.addList();
      });
    } else {}
  }, 1);
}

var fun = {
  getSessionId() {
    $.ajax({
        method: "get",
        url: `${data_c.req_url}/sessionId`,
        data: {}
      })
      .done(function (data) {
        // console.log(data)
        data_v.sessionId = data.data.sessionId;
        fun.getCode();
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  getCode() {
    var date = +new Date();
    var str1 = "DaJiang#%*Xiangmu";
    var str2 = data_v.sessionId;
    var str3 = "";
    var md = forge.md.sha1.create();
    md.update(str1 + str2 + date);
    str3 = md.digest().toHex();
    headersDate = {
      "YX-TIMESTAMP": date,
      "YX-SESSIONID": str2,
      "YX-TOKEN": str3
    };
    // console.log(headersDate)
    $.ajax({
        method: "get",
        url: `${data_c.req_url}/verify`,
        headers: headersDate,
        data: {}
      })
      .done(function (data) {
        // console.log(data)
        $(".verify img").attr("src", data.data.path);
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  addProduct() {
    var series = "";
    var series1 = $("#exampleSelect1")[0].value;
    var series2 = $("#exampleSelect2")[0].value;
    var series3 = $("#exampleSelect3")[0].value;

    var title = "";

    if (series2 == "00000" && series3 == "00000") {
      series = series1;
      title = $(`#exampleSelect1 option[value=${series1}]`).html();
    } else if (series3 == "00000") {
      series = series2;
      title = $(`#exampleSelect2 option[value=${series2}]`).html();
    } else {
      series = series3;
      title = $(`#exampleSelect3 option[value=${series3}]`).html();
    }

    var obj = {
      // series: series,
      // series2: series2,
      // threeSeries: threeSeries,
      product: series,
      title: title
    };
    data_v.product.push(obj);
    console.log(JSON.stringify(data_v.product));
    fun.add_product_html();
  },
  add_product_html() {
    var arr = data_v.product;
    var html = "";
    for (var j = 0; j < arr.length; j++) {
      data_v.i = data_v.i + 1;
      html += `
            <div class=" col-md-6 product_list_el${arr[j].product}">
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong class="product_list_el">${
                  arr[j].title
                }</strong>
                <button type="button" class="close" onclick='fun.delete_product_list(${arr[j].product})'>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            </div>
            `;
    }
    $("#product_list").html("");
    $("#product_list").html(html);
  },
  delete_product_list(p) {
    $(`.product_list_el${p}`).remove();
    var j ;
    for (var i = 0; i < data_v.length; i++) {
      if (data_v.product[i].product == p) {
        j = i;
        break;
      }
    }
     data_v.product.splice(j, 1);
    console.log(JSON.stringify(data_v.product))
  },
  start(page) {
    $(".app-menu__item").removeClass("active");
    $(`#page_${page}`).addClass("active");
  },

  login() {
    var date = +new Date();
    var str1 = "DaJiang#%*Xiangmu";
    var str2 = data_v.sessionId;
    var str3 = "";
    var md = forge.md.sha1.create();
    md.update(str1 + str2 + date);
    str3 = md.digest().toHex();
    headersDate = {
      "YX-TIMESTAMP": date,
      "YX-SESSIONID": str2,
      "YX-TOKEN": str3
    };

    var str1 = $("#str_user").val();
    var str2 = $("#str_pass").val();
    var str3 = $("#str_pass_img").val();

    var bol1 = $("#bol_checkbox")[0].checked;
    localStorage.api_token = "";
    localStorage.uid = "";
    sessionStorage.api_token = "";
    sessionStorage.uid = "";
    if (!str1 || !str2 || !str3) {
      alert("请输入正确参数!");
      return;
    }
    $.ajax({
        method: "POST",
        headers: headersDate,
        url: `${data_c.req_url}/api/user/login`,
        data: {
          email: str1,
          password: str2,
          code: str3
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          if (bol1) {
            localStorage.api_token = data.data.api_token;
            localStorage.uid = data.data.uid;
          } else {
            sessionStorage.api_token = data.data.api_token;
            sessionStorage.uid = data.data.uid;
          }
          fun.toIndex();
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  logout() {
    localStorage.api_token = "";
    localStorage.uid = "";
    sessionStorage.api_token = "";
    sessionStorage.uid = "";
    $.ajax({
        method: "POST",
        url: `${data_c.req_url}/api/user/logout`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
        } else if (data.code == 401) {
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
        fun.toLogin();
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
        location.reload();
      });
  },
  toggle_upPlay(a) {
    $("#up_play1").hide();
    $("#up_play2").hide();
    $("#up_play3").hide();
    $(".toggle_btn")
      .removeClass("btn-primary")
      .addClass("btn-secondary");
    $(`#toggle_btn${a}`)
      .addClass("btn-primary")
      .removeClass("btn-secondary");
    data_v.type = a;
    if (a == 1) {
      $("#up_play1").show();
    } else if (a == 2) {
      $("#up_play2").show();
    } else {
      $("#up_play3").show();
    }
  },
  getWordList() {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/keyword`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pageSize: 1000,
          page: 1
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = ``;
          var arr1 = data.data.list || [];
          for (var i = 0; i < arr1.length; i++) {
            html1 += `<tr><td>${arr1[i].sort}</td><td>${
              arr1[i].title
            }</td><td>${
              arr1[i].search_number
            }</td><td><button onclick='fun.deleteWordList(${
              arr1[i].id
            })'  class="btn btn-sm btn-danger" type="button">删除</button><div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.editWordList(${JSON.stringify(
                      arr1[i]
                    )})'  class="btn btn-sm btn-success" type="button">编辑</button></td></tr>`;
          }
          $("#tbody").html(html1);
          $("#sampleTable").DataTable();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },

  getUserList() {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/user`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pageSize: 1000,
          page: 1
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = ``;
          var arr1 = data.data.list || [];
          for (var i = 0; i < arr1.length; i++) {
            html1 += `<tr><td>${arr1[i].username}</td><td>${
              arr1[i].email
            }</td><td><button onclick='fun.deleteUserList(${
              arr1[i].id
            })'  class="btn btn-sm btn-danger" type="button">删除</button></td></tr>`;
          }
          $("#tbody").html(html1);
          $("#sampleTable").DataTable();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  getIndexList() {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/series`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pageSize: 1000,
          page: 1
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = ``;
          var arr1 = data.data.list || [];
          for (var i = 0; i < arr1.length; i++) {
            html1 += `<tr><td>${arr1[i].sort}</td><td>${
              arr1[i].title
            }</td><td><img onclick='fun.oppenImgPop("${data_c.req_url}/image/${
              arr1[i].image_url
            }")' style='cursor:pointer;width:100%;max-width:200px' src='${
              data_c.req_url
            }/image/${arr1[i].image_url}'/></td><td>${
              arr1[i].status == 1 ? "已发布" : "草稿"
            } <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.oppenUpStates("${arr1[i].id}","${
              arr1[i].status
            }","series")'  class="btn btn-sm btn-primary" type="button">${
              arr1[i].status == 1 ? "取消发布" : "发布"
            }</button></td><td><button onclick='fun.deleteList(${
              arr1[i].id
            })'  class="btn btn-sm btn-danger" type="button">删除</button>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.editList(${JSON.stringify(
                      arr1[i]
                    )})'  class="btn btn-sm btn-success" type="button">编辑</button></td></tr>`;
          }
          $("#tbody").html(html1);
          $("#sampleTable").DataTable();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  editList(str) {
    var obj = str;
    // console.log(obj)
    $("#pop_list").show();
    $("#list_editor").val(obj.title);
    data_v.img_url = obj.image_url;
    $("#sortInput1").val(obj.sort);
    $("#up_img_box").attr("src", `${data_c.req_url}/image/${data_v.img_url}`);
    $("#fileHelp").hide();
    $("#imgFileShow").show();
    data_v.edit = 1;
    data_v.id = obj.id;
  },
  getIndexList2() {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/series/getSeriesChildrenList`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pageSize: 1000,
          page: 1,
          level: 2
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = ``;
          var arr1 = data.data.list || [];
          for (var i = 0; i < arr1.length; i++) {
            html1 += `<tr><td>${arr1[i].sort}</td><td>${
              arr1[i].title
            }</td><td>${
              arr1[i].pid_title
            }</td><td><img onclick='fun.oppenImgPop("${data_c.req_url}/image/${
              arr1[i].image_url
            }")' style='cursor:pointer;width:100%;max-width:200px' src='${
              data_c.req_url
            }/image/${arr1[i].image_url}'/></td><td>${
              arr1[i].status == 1 ? "已发布" : "草稿"
            } <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.oppenUpStates("${arr1[i].id}","${
              arr1[i].status
            }","series")'  class="btn btn-sm btn-primary" type="button">${
              arr1[i].status == 1 ? "取消发布" : "发布"
            }</button></td><td><button onclick='fun.deleteList(${
              arr1[i].id
            })'  class="btn btn-sm btn-danger" type="button">删除</button> <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.editList2(${JSON.stringify(
                      arr1[i]
                    )})'  class="btn btn-sm btn-success" type="button">编辑</button></td></tr>`;
          }
          $("#tbody").html(html1);
          $("#sampleTable").DataTable();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  getIndexList3() {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/series/getSeriesChildrenList`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pageSize: 1000,
          page: 1,
          level: 3
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = ``;
          var arr1 = data.data.list || [];
          for (var i = 0; i < arr1.length; i++) {
            html1 += `<tr><td>${arr1[i].sort}</td><td>${
              arr1[i].title
            }</td><td>${
              arr1[i].pid_title
            }</td><td><img onclick='fun.oppenImgPop("${data_c.req_url}/image/${
              arr1[i].image_url
            }")' style='cursor:pointer;width:100%;max-width:200px' src='${
              data_c.req_url
            }/image/${arr1[i].image_url}'/></td><td>${
              arr1[i].status == 1 ? "已发布" : "草稿"
            } <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.oppenUpStates("${arr1[i].id}","${
              arr1[i].status
            }","series")'  class="btn btn-sm btn-primary" type="button">${
              arr1[i].status == 1 ? "取消发布" : "发布"
            }</button></td><td><button onclick='fun.deleteList(${
              arr1[i].id
            })'  class="btn btn-sm btn-danger" type="button">删除</button> <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.editList3(${JSON.stringify(
                      arr1[i].id
                    )})'  class="btn btn-sm btn-success" type="button">编辑</button></td></tr>`;
          }
          $("#tbody").html(html1);
          $("#sampleTable").DataTable();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  editList3(id) {
    $.ajax({
        method: "get",
        url: `${data_c.req_url}/api/series/getThreeSeriesById`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          id: id
        }
      })
      .done(function (data) {
        // console.log(data)
        fun.editList3_fix(data.data);
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  editList3_fix(str) {
    var obj = str;
    // console.log(obj)
    $("#pop_list").show();
    $("#list_editor").val(obj.title);
    data_v.img_url = obj.image_url;
    $("#sortInput1").val(obj.sort);
    $("#exampleSelect1")[0].value = obj.series1_id;
    setTimeout(() => {
      $("#exampleSelect2")[0].value = obj.series2_id;
    }, 100);
    setTimeout(() => {
      $("#exampleSelect2")[0].value = obj.series2_id;
    }, 1000);
    $("#up_img_box").attr("src", `${data_c.req_url}/image/${data_v.img_url}`);
    $("#fileHelp").hide();
    $("#imgFileShow").show();
    data_v.edit = 1;
    data_v.id = obj.id;
  },
  editList2(str) {
    var obj = str;
    // console.log(obj)
    $("#pop_list").show();
    $("#list_editor").val(obj.title);
    data_v.img_url = obj.image_url;
    $("#sortInput1").val(obj.sort);
    $("#exampleSelect1")[0].value = obj.pid;
    $("#up_img_box").attr("src", `${data_c.req_url}/image/${data_v.img_url}`);
    $("#fileHelp").hide();
    $("#imgFileShow").show();
    data_v.edit = 1;
    data_v.id = obj.id;
  },
  getPlayList() {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/product`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pageSize: 1000,
          page: 1
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = ``;
          var arr1 = data.data.list || [];
          for (var i = 0; i < arr1.length; i++) {
            var html2 = ``;
            var arr2 = arr1[i].product_list;
            for (var j = 0; j < arr2.length; j++) {
              html2 += `<span>${arr2[j]}</span><br>`;
            }
            html1 += `<tr><td>${arr1[i].sort}</td><td>${
              arr1[i].click_num
            }</td><td>${arr1[i].title}</td><td>${
              arr1[i].description
            }</td><td>${html2}</td><td><img onclick='fun.oppenImgPop("${
              data_c.req_url
            }/image/${
              arr1[i].image_url
            }")' style='cursor:pointer;width:100%;max-width:200px' src='${
              data_c.req_url
            }/image/${arr1[i].image_url}'/></td><td>${
              arr1[i].status == 1 ? "已发布" : "草稿"
            } <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.oppenUpStates("${arr1[i].id}","${
              arr1[i].status
            }","product")'  class="btn btn-sm btn-primary" type="button">${
              arr1[i].status == 1 ? "取消发布" : "发布"
            }</button></td><td><button onclick='fun.deleteList2(${
              arr1[i].id
            })'  class="btn btn-sm btn-danger" type="button">删除</button>
                    <div class='h1'></div>
                    <div class='h1'></div>                    <div class='h1'></div>

                    <button onclick='fun.editPlayList(${
                      arr1[i].id
                    })'  class="btn btn-sm btn-waring" type="button">编辑</button>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <div class='h1'></div>
                    <button onclick='fun.oppenVideoPop("${
                      arr1[i].video_url
                    }","${
              arr1[i].type
            }")'  class="btn btn-sm btn-success" type="button">视频预览</button>
                   </td></tr>`;
          }
          $("#tbody").html(html1);
          $("#sampleTable").DataTable();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  editPlayList(id) {
    // console.log(id)
    $.ajax({
        method: "get",
        url: `${data_c.req_url}/api/product/${id}`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid
        }
      })
      .done(function (data) {
        // console.log(data)
        fun.editPlayList_fix(data.data);
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  editPlayList_fix(str) {
    var obj = str;
    // console.log(obj)
    $("#list_editor").val(obj.title);
    data_v.img_url = obj.image_url;
    $("#sortInput1").val(obj.sort);
    $("#up_img_box").attr("src", `${data_c.req_url}/image/${data_v.img_url}`);
    data_v.type = obj.type;
    data_v.edit = 1;
    data_v.id = obj.id;
    $("#exampleTextarea").val(obj.description);
    $("#list_editor2").val(obj.sub_title);
    $("#vid").val(obj.video_id);
    data_v.product = obj.type_list;
    fun.add_product_html();
    var arr = obj.image_list;
    data_v.img_box = JSON.parse(JSON.stringify(arr));
    if (arr.length == 4) {
      data_v.img_box2 = [arr.pop()];
      data_v.img_box1 = arr;
    } else if (arr.length == 1) {
      data_v.img_box2 = arr;
    } else {
      data_v.img_box1 = arr;
    }

    fun.show_img_box(true);

    if (data_v.type == 2) {
      data_v.play_url = obj.video_url;
    } else if (data_v.type == 3) {
      $("#tx_url2").val(obj.video_url);
    } else {
      $("#tx_url").val(obj.video_url);
    }
    fun.toggle_upPlay(data_v.type);
    $("#pop_list").show();
  },
  oppenUpStates(id, state, type) {
    var state_fix = state == "1" ? 0 : 1;
    var url = "";
    if (type == "product") {
      url = `${data_c.req_url}/api/product/updateStatus`;
    } else {
      url = `${data_c.req_url}/api/series/updateStatus`;
    }
    $.ajax({
        method: "post",
        url: url,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          id: id,
          status: state_fix
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  oppenImgPop(url) {
    $("#pop_img").show();
    $("#img_box").attr("src", url);
  },
  hideImgPop() {
    $("#pop_img").hide();
    $("#img_box").attr("src", "");
  },
  oppenVideoPop(url, type) {
    if (type == 1) {
      var patt1 = new RegExp("//");
      if (patt1.test(url)) {
        window.open(`${url}`);
      } else {
        window.open(`//${url}`);
      }
    } else {
      var url_fix = `${data_c.req_url}/video/${url}`;
      $("#pop_play").show();
      $("#play_box").attr("src", url_fix);
    }
  },
  hideVideoPop() {
    $("#pop_play").hide();
    $("#play_box").attr("src", "");
  },
  deleteList(id) {
    var r = confirm("确定删除?");
    if (r == true) {
      $.ajax({
          method: "DELETE",
          url: `${data_c.req_url}/api/series/${id}`,
          data: {
            api_token: data_v.api_token,
            uid: data_v.uid
          }
        })
        .done(function (data) {
          // console.log(data)
          if (data.code == 0) {
            alert(data.message);
            location.reload();
          } else if (data.code == 401) {
            fun.toLogin();
            alert(data.message);
          } else {
            alert(data.message || "未知错误!");
          }
        })
        .fail(function (jqXHR, textStatus) {
          // console.log("请求失败: " + textStatus);
        });
    } else {}
  },
  deleteUserList(id) {
    var r = confirm("确定删除?");
    if (r == true) {
      $.ajax({
          method: "DELETE",
          url: `${data_c.req_url}/api/user/${id}`,
          data: {
            api_token: data_v.api_token,
            uid: data_v.uid
          }
        })
        .done(function (data) {
          // console.log(data)
          if (data.code == 0) {
            alert(data.message);
            location.reload();
          } else if (data.code == 401) {
            fun.toLogin();
            alert(data.message);
          } else {
            alert(data.message || "未知错误!");
          }
        })
        .fail(function (jqXHR, textStatus) {
          // console.log("请求失败: " + textStatus);
        });
    } else {}
  },
  editWordList(str) {
    var obj = str;
    // console.log(obj)
    $("#pop_list").show();
    $("#list_editor").val(obj.title);
    $("#sortInput1").val(obj.sort);
    data_v.edit = 1;
    data_v.id = obj.id;
  },
  deleteWordList(id) {
    var r = confirm("确定删除?");
    if (r == true) {
      $.ajax({
          method: "DELETE",
          url: `${data_c.req_url}/api/keyword/${id}`,
          data: {
            api_token: data_v.api_token,
            uid: data_v.uid
          }
        })
        .done(function (data) {
          // console.log(data)
          if (data.code == 0) {
            alert(data.message);
            location.reload();
          } else if (data.code == 401) {
            fun.toLogin();
            alert(data.message);
          } else {
            alert(data.message || "未知错误!");
          }
        })
        .fail(function (jqXHR, textStatus) {
          // console.log("请求失败: " + textStatus);
        });
    } else {}
  },
  deleteList2(id) {
    var r = confirm("确定删除?");
    if (r == true) {
      $.ajax({
          method: "DELETE",
          url: `${data_c.req_url}/api/product/${id}`,
          data: {
            api_token: data_v.api_token,
            uid: data_v.uid
          }
        })
        .done(function (data) {
          // console.log(data)
          if (data.code == 0) {
            alert(data.message);
            location.reload();
          } else if (data.code == 401) {
            fun.toLogin();
            alert(data.message);
          } else {
            alert(data.message || "未知错误!");
          }
        })
        .fail(function (jqXHR, textStatus) {
          // console.log("请求失败: " + textStatus);
        });
    } else {}
  },
  toLogin() {
    location.href = "page-login.html";
  },
  toIndex() {
    location.href = "index.html";
  },
  upLoadImg() {
    if (!$("#img_editor")[0].files[0]) {
      alert("请选择图片!");
      return;
    }
    var formData = new FormData(); //构造空对象，下面用append 方法赋值。
    formData.append("api_token", data_v.api_token);
    formData.append("uid", data_v.uid);
    formData.append("image", $("#img_editor")[0].files[0]);

    var url = `${data_c.req_url}/api/file/uploadImage`;
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          data_v.img_url = data.data.fileName;

          if (data_v.page_play) {
            data_v.img_box2 = [{
              path: data.data.fileName,
              selected: 1
            }];
            // console.log(data_v.img_box2)
            fun.show_img_box();
          } else {
            $("#up_img_box").attr(
              "src",
              `${data_c.req_url}/image/${data.data.fileName}`
            );
            $("#fileHelp").hide();
            $("#imgFileShow").show();
          }
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  uploadVideo() {
    if (!$("#play_editor")[0].files[0]) {
      alert("请选择视频!");
      return;
    }
    var formData = new FormData(); //构造空对象，下面用append 方法赋值。
    formData.append("api_token", data_v.api_token);
    formData.append("uid", data_v.uid);
    formData.append("video", $("#play_editor")[0].files[0]);

    var url = `${data_c.req_url}/api/file/uploadVideo`;
    $("#pop_wait").show();
    $.ajax({
        url: url,
        type: "POST",
        data: formData,
        processData: false,
        contentType: false
      })
      .done(function (data) {
        $("#pop_wait").hide();
        // console.log(data)
        if (data.code == 0) {
          data_v.play_url = data.data.fileName;
          data_v.img_box1 = data.data.imagePath;
          // console.log(data_v.img_box)
          fun.show_img_box();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        $("#pop_wait").hide();

        // console.log("请求失败: " + textStatus);
      });
  },
  show_img_box(choice) {
    if (choice) {} else {
      data_v.img_box = [].concat(data_v.img_box1, data_v.img_box2);
      for (var i = 0; i < data_v.img_box.length; i++) {
        if (i == 0) {
          data_v.img_box[i].selected = 1;
        } else {
          data_v.img_box[i].selected = 0;
        }
      }
      // console.log(data_v.img_box)
    }

    var html = "";
    var arr = data_v.img_box;
    for (var i = 0; i < arr.length; i++) {
      html += `
            <div class="form-group  col-md-6"><img class='${
              arr[i].selected ? "green_b" : ""
            }' src="${data_c.req_url}/image/${arr[i].path}"
            alt="" onclick='fun.choice_img("${arr[i].path}")'></div>
            `;
    }
    $("#choice_img_box").html("");
    $("#choice_img_box").append(html);
  },
  choice_img(path) {
    for (var i = 0; i < data_v.img_box.length; i++) {
      if (data_v.img_box[i].path == path) {
        data_v.img_box[i].selected = 1;
      } else {
        data_v.img_box[i].selected = 0;
      }
    }
    fun.show_img_box(true);
  },
  upWordList() {
    var title = $("#list_editor").val();
    var sort = $("#sortInput1").val();

    if (!title || !sort) {
      alert("请输入完整参数!");
      return;
    }
    if (title.length > 20 || title.replace(/\w/g, "").length > 10) {
      alert("搜索词限制在10个字以内!");
      return;
    }
    var method = "";
    var url = "";
    if (data_v.edit) {
      method = "put";
      url = `${data_c.req_url}/api/keyword/${data_v.id}`;
    } else {
      method = "POST";
      url = `${data_c.req_url}/api/keyword`;
    }
    $.ajax({
        method: method,
        url: url,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          title: title,
          sort: sort
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          fun.hideList();
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  upUserList() {
    var str = $("#list_editor").val();
    var str2 = $("#list_editor2").val();
    var str3 = $("#list_editor3").val();

    if (!str || !str2 || !str3) {
      alert("请输入完整参数!");
      return;
    }
    $.ajax({
        method: "POST",
        url: `${data_c.req_url}/api/user`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          username: str,
          email: str2,
          password: str3
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          fun.hideList();
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  upList() {
    var title = $("#list_editor").val();
    var image_url = data_v.img_url;
    // var pid = 0
    var sort = $("#sortInput1").val();

    if (!title || !image_url) {
      alert("请输入完整参数!");
      return;
    }
    var url = "";
    var method = "";
    if (data_v.edit) {
      method = "put";
      url = `${data_c.req_url}/api/series/${data_v.id}`;
    } else {
      method = "POST";
      url = `${data_c.req_url}/api/series`;
    }

    $.ajax({
        method: method,
        url: url,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          title: title,
          image_url: image_url,
          // pid: pid,
          sort: sort
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          fun.hideList();
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  upList2() {
    var title = $("#list_editor").val();
    var image_url = data_v.img_url;
    var pid = $("#exampleSelect1")[0].value;
    var sort = $("#sortInput1").val();

    if (!title || !image_url) {
      alert("请输入完整参数!");
      return;
    }

    var url = "";
    var method = "";
    if (data_v.edit) {
      method = "put";
      url = `${data_c.req_url}/api/series/${data_v.id}`;
    } else {
      method = "POST";
      url = `${data_c.req_url}/api/series`;
    }

    $.ajax({
        method: method,
        url: url,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          title: title,
          image_url: image_url,
          pid: pid,
          sort: sort,
          level: data_v.level
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          fun.hideList();
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  upList3() {
    var title = $("#list_editor").val();
    var image_url = data_v.img_url;
    var pid = $("#exampleSelect1")[0].value;
    var pid2 = $("#exampleSelect2")[0].value;
    var sort = $("#sortInput1").val();
    if (!title || !image_url) {
      alert("请输入完整参数!");
      return;
    }
    var url = "";
    var method = "";
    if (data_v.edit) {
      method = "put";
      url = `${data_c.req_url}/api/series/${data_v.id}`;
    } else {
      method = "POST";
      url = `${data_c.req_url}/api/series`;
    }

    $.ajax({
        method: method,
        url: url,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          title: title,
          image_url: image_url,
          // pid: pid,
          pid: pid2,
          sort: sort,
          level: data_v.level
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          fun.hideList();
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  upPlayList() {
    var description = $("#exampleTextarea").val();
    var title = $("#list_editor").val();
    var sub_title = $("#list_editor2").val() || "去除";
    var image_url = data_v.img_url;
    var play_url = data_v.play_url;
    var tx_url = $("#tx_url").val();
    var tx_url2 = $("#tx_url2").val();

    if (data_v.type == 1) {
      play_url = tx_url;
    } else if (data_v.type == 3) {
      play_url = tx_url2;
    }
    var pid = $("#exampleSelect1")[0].value;
    var type_id = $("#exampleSelect2")[0].value;
    var image_list = data_v.img_box;
    var type_list = data_v.product;
    var type = data_v.type;
    var video_id = $("#vid").val();
    var sort = $("#sortInput1").val();

    var data = {
      api_token: data_v.api_token,
      uid: data_v.uid,
      title: title,
      // sub_title: sub_title,
      description: description,
      image_list: image_list,
      video_url: play_url,
      type_list: type_list,
      type: type,
      video_id: video_id,
      sort: sort
    };
    // console.log(data)
    if (description.length > 30 || description.replace(/\w/g, "").length > 20) {
      alert("描述限制在20个字以内!");
      return;
    }
    if (title.length > 20 || title.replace(/\w/g, "").length > 10) {
      alert("标题限制在10个字以内!");
      return;
    }
    if (!title || !description || !sub_title) {
      alert("请输入完整参数!");
      return;
    }

    var url = "";
    var method = "";
    if (data_v.edit) {
      method = "put";
      url = `${data_c.req_url}/api/product/${data_v.id}`;
    } else {
      method = "POST";
      url = `${data_c.req_url}/api/product`;
    }

    $.ajax({
        method: method,
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data)
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          alert(data.message);
          fun.hideList();
          location.reload();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  hideList() {
    data_v.edit = 0;
    $("#pop_list").hide();
    data_v.img_url = "";
    data_v.play_url = "";
    data_v.img_box = [];
    data_v.img_box1 = [];
    data_v.img_box2 = [];
    data_v.product = [];

    $("#list_editor").val("");

    var obj1 = document.getElementById("img_editor");
    if (obj1) {
      obj1.outerHTML = obj1.outerHTML;
    }
    var obj2 = document.getElementById("play_editor");
    if (obj2) {
      obj2.outerHTML = obj2.outerHTML;
    }

    $("#up_img_box").attr("src", ``);
    $("#up_play_box").attr("src", ``);
    $("#exampleTextarea").val("");
    $("#list_editor").val("");
    $("#list_editor2").val("");
    $("#list_editor3").val("");
    var image_url = "";
    var play_url = "";
    var image_list = [];
    var type_list = [];
    $("#vid").val("");
    $("#tx_url").val("");
    $("#tx_url2").val("");
    $("#sortInput1").val("");
    $("#fileHelp").show();
    $("#imgFileShow").hide();
    $("#fileHelp2").show();
    $("#playFileShow").hide();
    $("#product_list").html("");
    $("#choice_img_box").html("");
  },
  addList() {
    $("#pop_list").show();
  },
  getParentSeries(child) {
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/series/getParentSeries`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = "";
          var arr1 = data.data;
          for (var i = 0; i < arr1.length; i++) {
            html1 += `<option value='${arr1[i].id}'>${arr1[i].title}</option>`;
          }
          $("#exampleSelect1").html(html1);

          fun.getProductSeries();
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  getProductSeries() {
    $("#exampleSelect2").html(``);
    var pid = $("#exampleSelect1")[0].value;
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/series/getProductSeries`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pid: pid
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = "";
          var arr1 = data.data;
          data_v.arr2 = arr1;
          var val = "";
          if (arr1.length == 0) {
            val = "00000";
            html1 = `<option value='00000'>无选项</option>`;
          } else {
            var val = arr1[0].id;
            for (var i = 0; i < arr1.length; i++) {
              html1 += `<option value='${arr1[i].id}'>${
                arr1[i].title
              }</option>`;
            }
          }

          $("#exampleSelect2").html(html1);
          if (arr1.length == 0) {
            $("#exampleSelect3").html(html1);

          } else {
            fun.getProductSeries2();
          }
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  },
  getProductSeries2() {
    $("#exampleSelect3").html(``);
    var pid = $("#exampleSelect2")[0].value;
    $.ajax({
        method: "GET",
        url: `${data_c.req_url}/api/series/getProductSeries`,
        data: {
          api_token: data_v.api_token,
          uid: data_v.uid,
          pid: pid
        }
      })
      .done(function (data) {
        // console.log(data)
        if (data.code == 0) {
          var html1 = "";
          var arr1 = data.data;
          data_v.arr2 = arr1;
          var val = "";
          if (arr1.length == 0) {
            val = "00000";
            html1 = `<option value='00000'>无选项</option>`;
          } else {
            var val = arr1[0].id;
            for (var i = 0; i < arr1.length; i++) {
              html1 += `<option value='${arr1[i].id}'>${
                arr1[i].title
              }</option>`;
            }
          }

          $("#exampleSelect3").html(html1);
        } else if (data.code == 401) {
          fun.toLogin();
          alert(data.message);
        } else {
          alert(data.message || "未知错误!");
        }
      })
      .fail(function (jqXHR, textStatus) {
        // console.log("请求失败: " + textStatus);
      });
  }
};